// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js"; // Import User type

import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Leaf, LogIn, LogOut, Loader2 } from "lucide-react"; // Added Loader2
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle"; // Assuming ThemeToggle is in src/components

export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const hideAuthButtons = pathname === '/auth';
  const [isClientDarkMode, setIsClientDarkMode] = useState(false); // Default to false, useEffect will set it

  useEffect(() => {
    // --- Dark mode initialization & listener ---
    const applyTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      let currentModeIsDark;
      if (storedTheme) {
        currentModeIsDark = storedTheme === 'dark';
      } else {
        currentModeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsClientDarkMode(currentModeIsDark);
      document.documentElement.classList.toggle("dark", currentModeIsDark);
    };

    applyTheme(); // Apply theme on initial mount

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemThemeChangeListener = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem("theme")) { // Only if no theme is explicitly set by user
            setIsClientDarkMode(e.matches);
            document.documentElement.classList.toggle("dark", e.matches);
        }
    };
    darkModeMediaQuery.addEventListener('change', systemThemeChangeListener);
    // Listen for custom theme changes (e.g., from other tabs, though less common for localStorage)
    window.addEventListener('storage', (event) => {
        if (event.key === 'theme') {
            applyTheme();
        }
    });


    // --- Supabase auth state listener ---
    setLoadingAuth(true); // Start loading auth state
    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUser(session?.user ?? null);
        setLoadingAuth(false);
        if (event === 'SIGNED_OUT' && !pathname.startsWith('/auth')) {
          router.push('/auth');
        } else if (event === 'SIGNED_IN' && pathname.startsWith('/auth')) {
          router.push('/');
        }
      }
    );

    const getInitialSession = async () => {
      const { data: { session } } = await supabaseBrowserClient.auth.getSession();
      setCurrentUser(session?.user ?? null);
      setLoadingAuth(false);
      if (session && pathname.startsWith('/auth')) {
        router.push('/');
      }
    };
    getInitialSession();

    return () => {
      authListener?.subscription?.unsubscribe(); // Corrected: Access nested subscription
      darkModeMediaQuery.removeEventListener('change', systemThemeChangeListener);
      window.removeEventListener('storage', applyTheme);
    };
  }, [router, pathname]);

  const handleSignOut = async () => {
    setLoadingAuth(true); // Indicate an auth operation is in progress
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      // Optionally show a toast for error
    } else {
      setCurrentUser(null); // Update UI immediately
      // onAuthStateChange will also trigger and handle redirect if needed
      if (!pathname.startsWith('/auth')) {
          router.push('/auth');
          router.refresh();
      }
    }
    setLoadingAuth(false);
  };

  const handleThemeToggle = () => {
    const newMode = !isClientDarkMode;
    setIsClientDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b dark:border-gray-700/50 border-gray-200/80 bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-5xl">
        <Link href="/" className="flex items-center space-x-2 group">
          <Leaf className="h-7 w-7 text-nature-leaf group-hover:animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Species<span className="text-nature-leaf">Sight</span>
          </h1>
        </Link>
        <nav className="flex items-center space-x-3">
          <ThemeToggle
            isDarkMode={isClientDarkMode}
            onToggle={handleThemeToggle}
          />
          {!hideAuthButtons && (
            <>
              {loadingAuth ? (
                <Button variant="outline" size="icon" disabled className="dark:text-white dark:border-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              ) : currentUser ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline truncate max-w-[150px]" title={currentUser.email}>
                    {currentUser.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-0 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="dark:text-white dark:border-gray-600 hover:dark:bg-gray-700">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}