"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, Brain, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * @component ThemeSwitcher
 * @description Sensory-friendly theme switcher for the Sanctuary UI. Supports three modes:
 * - Calm: Soft colors for reduced visual stimulation
 * - Focus: High contrast for deep work
 * - Night: Dark theme for low-light environments
 * @prop {ThemeMode} [value] - Controlled theme value
 * @prop {Function} [onChange] - Callback when theme changes
 * @prop {ThemeMode} [defaultValue="calm"] - Default theme
 * @prop {string} [className] - Additional CSS classes
 */

type ThemeMode = "calm" | "focus" | "night" | "system";

interface ThemeOption {
  key: ThemeMode;
  icon: React.ElementType;
  label: string;
  description: string;
}

const themes: ThemeOption[] = [
  {
    key: "calm",
    icon: Eye,
    label: "Calm mode",
    description: "Soft colors for reduced visual stimulation",
  },
  {
    key: "focus",
    icon: Brain,
    label: "Focus mode",
    description: "Minimal distractions for deep work",
  },
  {
    key: "night",
    icon: Moon,
    label: "Night mode",
    description: "Dark theme for low-light environments",
  },
];

interface ThemeSwitcherProps {
  value?: ThemeMode;
  onChange?: (theme: ThemeMode) => void;
  defaultValue?: ThemeMode;
  className?: string;
  children?: React.ReactNode;
}

export function ThemeSwitcher({
  value,
  onChange,
  defaultValue = "calm",
  className,
  children,
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeMode>(defaultValue);
  const [mounted, setMounted] = useState(false);

  // Handle controlled component
  useEffect(() => {
    if (value !== undefined) {
      setTheme(value);
    }
  }, [value]);

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    if (onChange) {
      onChange(newTheme);
    } else {
      setTheme(newTheme);
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Get saved theme or system preference
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      handleThemeChange(savedTheme);
    } else if (systemPrefersDark) {
      handleThemeChange("night");
    } else {
      handleThemeChange(defaultValue);
    }
    
    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        handleThemeChange(e.matches ? "night" : "calm");
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-10 w-24 bg-muted rounded-full animate-pulse", className)} />
    );
  }

  const currentTheme = themes.find(t => t.key === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="flex items-center space-x-2">
        <motion.button
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full",
            "bg-background border border-border",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          onClick={() => {
            const currentIndex = themes.findIndex(t => t.key === theme);
            const nextIndex = (currentIndex + 1) % themes.length;
            handleThemeChange(themes[nextIndex].key);
          }}
          aria-label={`Toggle theme. Current theme: ${currentTheme.label}`}
          whileTap={{ scale: 0.95 }}
        >
          {React.createElement(currentTheme.icon, { className: "h-4 w-4" })}
        </motion.button>
        
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-foreground">
            {currentTheme.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentTheme.description}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        <motion.div
          className="absolute left-0 right-0 -bottom-1 h-1 bg-primary/20 rounded-full overflow-hidden"
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((themes.findIndex(t => t.key === theme) + 1) * (100 / themes.length))}%` 
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>
      </AnimatePresence>
      {children}
    </div>
  );
}

// Theme provider component to apply theme classes to the document
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("calm");
  
  useEffect(() => {
    // Apply theme class to document
    document.documentElement.classList.remove("theme-calm", "theme-focus", "theme-night");
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Update data-theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <ThemeSwitcher value={theme} onChange={setTheme}>
      {children}
    </ThemeSwitcher>
  );
}