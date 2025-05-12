// src/app/auth/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Removed Link import as it's no longer used here after removing the logo link
// import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseBrowserClient } from '@/lib/supabase/client';
// Removed Leaf import as it's no longer used
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const supabase = supabaseBrowserClient;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const getRedirectUrl = useCallback(() => {
    let origin = 'http://localhost:9002'; // Default fallback
    if (typeof window !== 'undefined') {
      origin = window.location.origin;
    } else if (process.env.NEXT_PUBLIC_SITE_URL) {
      origin = process.env.NEXT_PUBLIC_SITE_URL;
    }
    return `${origin}/api/auth/callback`;
  }, []);

  useEffect(() => {
    // Dark mode detection and theme application
    const applyCurrentTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      let currentIsDark;
      if (storedTheme) {
        currentIsDark = storedTheme === 'dark';
      } else {
        currentIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      document.documentElement.classList.toggle('dark', currentIsDark);
      if (isDarkMode !== currentIsDark) {
        setIsDarkMode(currentIsDark);
      }
    };
    applyCurrentTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const systemIsDark = e.matches;
        document.documentElement.classList.toggle('dark', systemIsDark);
        if (isDarkMode !== systemIsDark) {
           setIsDarkMode(systemIsDark);
        }
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        applyCurrentTheme();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          router.push('/');
        }
      }
    );

    // Check initial session state
    const checkSessionAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      } else {
        setAuthReady(true);
      }
    };
    checkSessionAndRedirect();

    // Cleanup listeners
    return () => {
      authListener?.subscription?.unsubscribe();
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [supabase, router, isDarkMode, getRedirectUrl]);


  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nature-light-start to-nature-light-end dark:from-nature-dark-start dark:to-nature-dark-end">
        <Loader2 className="w-12 h-12 animate-spin text-nature-leaf" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-nature-light-start to-nature-light-end dark:from-nature-dark-start dark:to-nature-dark-end p-4">
      {/* === REMOVED LOGO AND TITLE SECTION START === */}
      {/*
      <div className="text-center mb-8">
        <Link href="/" aria-label="Go to Homepage">
          <Leaf className="w-16 h-16 text-nature-leaf mx-auto mb-2 hover:opacity-80 transition-opacity" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Species<span className="text-nature-leaf">Sight</span>
        </h1>
      </div>
      */}
      {/* === REMOVED LOGO AND TITLE SECTION END === */}

      {/* Auth Form Card */}
      {/* Added some margin-top to compensate for removed logo section */}
      <div className="w-full max-w-sm p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-800 shadow-2xl rounded-xl mt-8">
        {/* This header inside the card can remain or be removed based on previous request */}
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign in or create an account
          </h2>
        </div>

        {/* Supabase Auth UI Component */}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: { default: { colors: { brand: isDarkMode ? '#388E3C' : '#4CAF50', brandAccent: isDarkMode ? '#4CAF50' : '#388E3C' }}},
          }}
          theme={isDarkMode ? "dark" : "light"}
          providers={['google', 'github']}
          redirectTo={getRedirectUrl()}
          socialLayout="horizontal"
        />
      </div>
    </div>
  );
}