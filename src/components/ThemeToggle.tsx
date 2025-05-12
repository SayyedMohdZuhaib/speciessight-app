// src/components/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full transition-all duration-300 ease-in-out hover:bg-black/10 dark:hover:bg-white/10"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      )}
       <span className="sr-only">Toggle theme</span>
    </Button>
  );
}