// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Ensure this path is correct
import type { User } from "@supabase/supabase-js";

import {
    classifySpeciesAndDescribe,
    type ClassifySpeciesAndDescribeOutput
} from "@/ai/flows/classify-species";
import { supabaseBrowserClient } from "@/lib/supabase/client";

import ImageDropzone from "@/components/ImageDropzone";
import SpeciesResult from "@/components/SpeciesResult";

export default function IndexPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [speciesData, setSpeciesData] = useState<ClassifySpeciesAndDescribeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Page still uses this for its own styling
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Dark mode initialization
    const applyTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      let currentModeIsDark;
      if (storedTheme) {
        currentModeIsDark = storedTheme === 'dark';
      } else {
        currentModeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setDarkMode(currentModeIsDark);
      document.documentElement.classList.toggle("dark", currentModeIsDark);
    };
    applyTheme();
     // Listen for custom theme changes
    window.addEventListener('storage', (event) => {
        if (event.key === 'theme') {
            applyTheme();
        }
    });


    // Supabase auth state listener
    setAuthLoading(true);
    const getSessionData = async () => {
        const { data: { session } } = await supabaseBrowserClient.auth.getSession();
        setCurrentUser(session?.user ?? null);
        setAuthLoading(false);
    };
    getSessionData();

    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      setAuthLoading(false); // Update loading state on any auth change
      // Middleware handles redirects, but this ensures local state is up-to-date
    });

    return () => {
      authListener?.subscription?.unsubscribe(); // Corrected
      window.removeEventListener('storage', applyTheme);
    };
  }, []);


  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setSpeciesData(null); // Reset species data when new image is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleClassification = async () => {
    if (!imageUrl) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image of a species first.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    // Server action might be protected by middleware, client check is optional UX
    setLoading(true);
    setSpeciesData(null); // Clear previous results before new classification
    try {
      const result = await classifySpeciesAndDescribe({ photoUrl: imageUrl });
      setSpeciesData(result);
    } catch (error: any) {
      console.error("Classification failed:", error);
      toast({
        title: "Classification Failed",
        description: error.message || "We couldn't identify the species. Please try another image.",
        variant: "destructive",
        duration: 5000,
      });
       setSpeciesData(null); // Ensure previous data is cleared on error
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setSpeciesData(null);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Loading state for authentication
  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nature-light-start to-nature-light-end dark:from-nature-dark-start dark:to-nature-dark-end">
            <Loader2 className="w-12 h-12 animate-spin text-nature-leaf" />
        </div>
    );
  }

  // Main component render
  return (
    <motion.div
      key={darkMode ? "dark-theme" : "light-theme"} // Re-trigger animation on theme change if needed
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 px-4 py-8 sm:py-12
        dark:bg-gradient-to-br dark:from-nature-dark-start dark:to-nature-dark-end dark:text-gray-200
        bg-gradient-to-br from-nature-light-start to-nature-light-end text-gray-800`}
    >
      <div className="container max-w-xl w-full">
        {/* Global Header is rendered in layout.tsx */}
        <motion.div variants={cardVariants} className="mt-6 sm:mt-8">
          <Card
            className={`shadow-xl dark:shadow-2xl overflow-hidden transition-all duration-300 rounded-xl
            dark:bg-slate-800/60 dark:backdrop-blur-lg dark:border dark:border-slate-700/50
            bg-white/70 backdrop-blur-lg border border-gray-200/80`}
          >
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* === MODIFIED SECTION START === */}
              <div className="text-center space-y-1.5">
                {/* Removed the H2, added a new tagline */}
                <p className="text-lg sm:text-xl font-medium tracking-tight dark:text-gray-100 text-gray-800">
                  Discover the species around you. {/* <-- Your new tagline */}
                </p>
                {currentUser && (
                  <p className="text-md font-medium mt-2 dark:text-gray-300 text-gray-700">
                    Welcome back, {currentUser.email?.split('@')[0] || 'Explorer'}!
                  </p>
                )}
                <p className="text-sm sm:text-base max-w-md mx-auto dark:text-gray-400 text-gray-600">
                  Upload a photo to begin identifying species.
                </p>
              </div>
              {/* === MODIFIED SECTION END === */}

              {/* Image Dropzone or Preview/Button */}
              <AnimatePresence mode="wait">
                {!imageUrl ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: {duration: 0.2} }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageDropzone onImageUpload={handleImageUpload} isDarkMode={darkMode} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: {duration: 0.2} }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Image Preview */}
                    <div className="relative group rounded-lg overflow-hidden shadow-md aspect-[16/10] bg-black/5 dark:bg-black/20">
                      <img
                        src={imageUrl}
                        alt="Uploaded species"
                        className="object-contain w-full h-full"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReset}
                        className={`absolute top-2.5 right-2.5 bg-black/30 text-white
                                    hover:bg-black/50 backdrop-blur-sm transition-all rounded-full
                                    opacity-60 group-hover:opacity-100 focus:opacity-100`}
                        aria-label="Remove image"
                      >
                        <XCircle size={20} />
                      </Button>
                    </div>

                    {/* Identify Button */}
                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={handleClassification}
                        disabled={loading}
                        size="lg"
                        className={`px-8 py-3 text-base font-semibold rounded-lg transition-all duration-300 ease-in-out
                                  text-white transform hover:scale-[1.03] focus:ring-4 focus:ring-opacity-50 active:scale-[0.98]
                                  w-full sm:w-auto
                                  ${
                                    loading
                                      ? "bg-nature-moss/60 dark:bg-nature-leaf/50 animate-pulse cursor-not-allowed"
                                      : `bg-gradient-to-r from-nature-leaf to-nature-moss hover:from-nature-moss hover:to-nature-leaf
                                         dark:focus:ring-nature-leaf/40 focus:ring-nature-moss/40`
                                  }`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Identify Species"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Species Result Display */}
              <AnimatePresence>
                {speciesData && (
                    <SpeciesResult speciesDetails={speciesData} isDarkMode={darkMode} />
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-10 text-center">
          <p className="text-xs dark:text-gray-500 text-gray-400">
            Species identification powered by AI | © {new Date().getFullYear()} SpeciesSight
          </p>
        </footer>
      </div>
    </motion.div>
  );
}