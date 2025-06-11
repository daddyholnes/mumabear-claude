import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores';
import { setTheme, setCustomSettings, loadThemeFromStorage, ThemeState } from '@/stores/slices/themeSlice';
import type { ThemeVariant } from '@/stores/slices/themeSlice';

interface SanctuaryThemeContextValue {
  // Core theme
  currentTheme: ThemeVariant;
  setCurrentTheme: (theme: ThemeVariant) => void;
  
  // Settings
  customSettings: ThemeState['customSettings'];
  updateCustomSettings: (settings: Partial<ThemeState['customSettings']>) => void;
  
  // Preview mode
  previewMode: boolean;
  previewTheme?: ThemeVariant;
  
  // Convenience helpers
  shouldReduceMotion: boolean;
  shouldUseHighContrast: boolean;
  fontSize: string;
  colorBlindSupport: string;
  
  // Utility methods
  getThemeClasses: () => string;
  getAnimationDuration: (baseMs?: number) => number;
}

const defaultValue: SanctuaryThemeContextValue = {
  currentTheme: 'sanctuary',
  setCurrentTheme: () => {},
  customSettings: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    colorBlindSupport: 'none',
  },
  updateCustomSettings: () => {},
  previewMode: false,
  previewTheme: undefined,
  shouldReduceMotion: false,
  shouldUseHighContrast: false,
  fontSize: 'medium',
  colorBlindSupport: 'none',
  getThemeClasses: () => '',
  getAnimationDuration: () => 300,
};

const SanctuaryThemeContext = createContext<SanctuaryThemeContextValue>(defaultValue);

interface SanctuaryThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeVariant;
}

export function SanctuaryThemeProvider({ 
  children, 
  defaultTheme = 'sanctuary' 
}: SanctuaryThemeProviderProps) {
  const dispatch = useDispatch();
  const themeState = useSelector((state: RootState) => state.theme) as ThemeState;
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage only once
  useEffect(() => {
    if (!isInitialized) {
      dispatch(loadThemeFromStorage());
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

  // Apply theme to document when it changes
  useEffect(() => {
    if (themeState?.currentTheme) {
      document.documentElement.setAttribute('data-theme', themeState.currentTheme);
      
      // Apply theme classes for enhanced styling
      const themeClasses = [
        `theme-${themeState.currentTheme}`,
        themeState.customSettings?.highContrast ? 'high-contrast' : '',
        themeState.customSettings?.reducedMotion ? 'reduced-motion' : '',
        themeState.customSettings?.colorBlindSupport !== 'none' 
          ? `colorblind-${themeState.customSettings.colorBlindSupport}` 
          : ''
      ].filter(Boolean);
      
      // Remove old theme classes
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+|high-contrast|reduced-motion|colorblind-\w+/g, '');
      
      // Add new theme classes
      document.documentElement.classList.add(...themeClasses);
    }
  }, [
    themeState?.currentTheme, 
    themeState?.customSettings?.highContrast,
    themeState?.customSettings?.reducedMotion,
    themeState?.customSettings?.colorBlindSupport
  ]);

  const value: SanctuaryThemeContextValue = {
    currentTheme: themeState?.currentTheme || defaultTheme,
    setCurrentTheme: (theme: ThemeVariant) => {
      dispatch(setTheme(theme));
    },
    customSettings: themeState?.customSettings || defaultValue.customSettings,
    updateCustomSettings: (settings) => {
      dispatch(setCustomSettings(settings));
    },
    previewMode: themeState?.previewMode || false,
    previewTheme: themeState?.previewTheme,
    
    // Convenience helpers
    shouldReduceMotion: themeState?.customSettings?.reducedMotion || false,
    shouldUseHighContrast: themeState?.customSettings?.highContrast || false,
    fontSize: themeState?.customSettings?.fontSize || 'medium',
    colorBlindSupport: themeState?.customSettings?.colorBlindSupport || 'none',
    
    // Utility methods
    getThemeClasses: () => {
      const classes = [`theme-${themeState?.currentTheme || defaultTheme}`];
      if (themeState?.customSettings?.highContrast) classes.push('high-contrast');
      if (themeState?.customSettings?.reducedMotion) classes.push('reduced-motion');
      if (themeState?.customSettings?.colorBlindSupport !== 'none') {
        classes.push(`colorblind-${themeState?.customSettings?.colorBlindSupport}`);
      }
      return classes.join(' ');
    },
    
    getAnimationDuration: (baseMs: number = 300) => 
      themeState?.customSettings?.reducedMotion ? Math.min(baseMs / 3, 100) : baseMs,
  };

  return (
    <SanctuaryThemeContext.Provider value={value}>
      {children}
    </SanctuaryThemeContext.Provider>
  );
}

export const useSanctuaryTheme = () => {
  const context = useContext(SanctuaryThemeContext);
  if (!context) {
    throw new Error('useSanctuaryTheme must be used within a SanctuaryThemeProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useEnhancedTheme = useSanctuaryTheme;
