import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores';
import { setTheme, setCustomSettings, loadThemeFromStorage, ThemeState } from '@/stores/slices/themeSlice';
import type { ThemeVariant } from '@/stores/slices/themeSlice';

// Backward compatibility types
type LegacyTheme = 'dark' | 'light' | 'system';

// Enhanced theme provider types
type ExtendedTheme = ThemeVariant | LegacyTheme;

type EnhancedThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ExtendedTheme;
  storageKey?: string;
};

type EnhancedThemeProviderState = {
  // Legacy compatibility
  theme: LegacyTheme;
  setTheme: (theme: LegacyTheme) => void;
  
  // Enhanced theme system
  currentTheme: ThemeVariant;
  setCurrentTheme: (theme: ThemeVariant) => void;
  customSettings: ThemeState['customSettings'];
  updateCustomSettings: (settings: Partial<ThemeState['customSettings']>) => void;
  previewMode: boolean;
  previewTheme?: ThemeVariant;
  
  // Convenience properties
  shouldReduceMotion: boolean;
  shouldUseHighContrast: boolean;
  fontSize: string;
  colorBlindSupport: string;
  
  // Utility methods
  getThemeClasses: () => string;
  getAnimationDuration: (baseMs?: number) => number;
  getThemeColors: () => any;
};

const initialState: EnhancedThemeProviderState = {
  // Legacy compatibility
  theme: 'system',
  setTheme: () => null,
  
  // Enhanced theme system
  currentTheme: 'sanctuary',
  setCurrentTheme: () => null,
  customSettings: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    colorBlindSupport: 'none',
  },
  updateCustomSettings: () => null,
  previewMode: false,
  previewTheme: undefined,
  
  // Convenience properties
  shouldReduceMotion: false,
  shouldUseHighContrast: false,
  fontSize: 'medium',
  colorBlindSupport: 'none',
  
  // Utility methods
  getThemeClasses: () => '',
  getAnimationDuration: () => 300,
  getThemeColors: () => ({}),
};

const EnhancedThemeProviderContext = createContext<EnhancedThemeProviderState>(initialState);

export function EnhancedThemeProvider({
  children,
  defaultTheme = 'sanctuary',
  storageKey = 'sanctuary-theme',
  ...props
}: EnhancedThemeProviderProps) {
  const dispatch = useDispatch();
  const themeState = useSelector((state: RootState) => state.theme) as ThemeState;
  
  // Legacy theme state for backward compatibility
  const [legacyTheme, setLegacyTheme] = useState<LegacyTheme>('system');
  const [initialized, setInitialized] = useState(false);

  // Initialize Redux theme from localStorage only once
  useEffect(() => {
    if (!initialized) {
      dispatch(loadThemeFromStorage());
      setInitialized(true);
    }
  }, [dispatch, initialized]);

  // Handle legacy theme updates without circular dependency
  useEffect(() => {
    if (!initialized) return;
    
    const root = window.document.documentElement;
    
    // Remove old theme classes
    root.classList.remove('light', 'dark');
    
    // Handle legacy theme mapping
    if (legacyTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(legacyTheme);
    }
  }, [legacyTheme, initialized]);

  // Sync enhanced theme to document only when it changes
  useEffect(() => {
    if (themeState?.currentTheme) {
      document.documentElement.setAttribute('data-theme', themeState.currentTheme);
    }
  }, [themeState?.currentTheme]);
  // Enhanced theme provider value
  const value: EnhancedThemeProviderState = {
    // Legacy compatibility
    theme: legacyTheme,
    setTheme: (theme: LegacyTheme) => {
      localStorage.setItem(storageKey, theme);
      setLegacyTheme(theme);
    },
    
    // Enhanced theme system
    currentTheme: themeState?.currentTheme || 'sanctuary',
    setCurrentTheme: (theme: ThemeVariant) => {
      dispatch(setTheme(theme));
    },
    customSettings: themeState?.customSettings || {
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      colorBlindSupport: 'none',
    },
    updateCustomSettings: (settings) => {
      dispatch(setCustomSettings(settings));
    },
    previewMode: themeState?.previewMode || false,
    previewTheme: themeState?.previewTheme,
    
    // Convenience properties
    shouldReduceMotion: themeState?.customSettings?.reducedMotion || false,
    shouldUseHighContrast: themeState?.customSettings?.highContrast || false,
    fontSize: themeState?.customSettings?.fontSize || 'medium',
    colorBlindSupport: themeState?.customSettings?.colorBlindSupport || 'none',
    
    // Utility methods
    getThemeClasses: () => {
      const classes = [`theme-${themeState?.currentTheme || 'sanctuary'}`];
      if (themeState?.customSettings?.highContrast) classes.push('high-contrast');
      if (themeState?.customSettings?.reducedMotion) classes.push('reduced-motion');
      if (themeState?.customSettings?.colorBlindSupport !== 'none') {
        classes.push(`colorblind-${themeState?.customSettings?.colorBlindSupport}`);
      }
      return classes.join(' ');
    },
    
    getAnimationDuration: (baseMs: number = 300) => 
      themeState?.customSettings?.reducedMotion ? Math.min(baseMs / 3, 100) : baseMs,
    
    getThemeColors: () => {
      const themes = {
        sanctuary: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          background: 'var(--color-background)',
          surface: 'var(--color-card)',
          text: 'var(--color-foreground)',
        },
        daytime: {
          primary: '#4fc3f7',
          secondary: '#fff176', 
          accent: '#aed581',
          background: '#f0f8ff',
          surface: 'rgba(255, 255, 255, 0.98)',
          text: '#1565c0',
        },
        night: {
          primary: '#8b5cf6',
          secondary: '#a78bfa',
          accent: '#c084fc',
          background: '#0f0f23',
          surface: 'rgba(30, 30, 50, 0.95)',
          text: '#e2e8f0',
        },
        'purple-haze': {
          primary: '#d946ef',
          secondary: '#f472b6',
          accent: '#a855f7',
          background: '#1a0b2e',
          surface: 'rgba(45, 25, 70, 0.9)',
          text: '#fbbf24',
        },
        'cosmic-purple': {
          primary: '#7c3aed',
          secondary: '#a855f7',
          accent: '#c084fc',
          background: '#0c0a1e',
          surface: 'rgba(30, 25, 60, 0.95)',
          text: '#e879f9',
        }
      };
      return themes[themeState?.currentTheme || 'sanctuary'] || themes.sanctuary;
    },
  };

  return (
    <EnhancedThemeProviderContext.Provider value={value} {...props}>
      {children}
    </EnhancedThemeProviderContext.Provider>
  );
}

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeProviderContext);

  if (context === undefined)
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');

  return context;
};

// Enhanced theme hook with full Redux integration and convenience methods
export const useAdvancedTheme = () => {
  const context = useEnhancedTheme();
  const dispatch = useDispatch();
  const themeState = useSelector((state: RootState) => state.theme) as ThemeState;
  
  return {
    ...context,
    themeState,
    dispatch,
    
    // Convenience methods
    isNightTheme: context.currentTheme === 'night' || context.currentTheme === 'cosmic-purple',
    isDayTheme: context.currentTheme === 'daytime',
    isSanctuaryTheme: context.currentTheme === 'sanctuary',
    isPurpleTheme: context.currentTheme === 'purple-haze' || context.currentTheme === 'cosmic-purple',
    
    // Accessibility helpers
    shouldReduceMotion: context.customSettings.reducedMotion,
    shouldUseHighContrast: context.customSettings.highContrast,
    fontSize: context.customSettings.fontSize,
    colorBlindSupport: context.customSettings.colorBlindSupport,
    
    // Theme utilities
    getThemeColors: () => {
      const themes = {
        sanctuary: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          background: 'var(--color-background)',
          surface: 'var(--color-card)',
          text: 'var(--color-foreground)',
        },
        daytime: {
          primary: '#4fc3f7',
          secondary: '#fff176', 
          accent: '#aed581',
          background: '#f0f8ff',
          surface: 'rgba(255, 255, 255, 0.98)',
          text: '#1565c0',
        },
        night: {
          primary: '#8b5cf6',
          secondary: '#a78bfa',
          accent: '#c084fc',
          background: '#0f0f23',
          surface: 'rgba(30, 30, 50, 0.95)',
          text: '#e2e8f0',
        },
        'purple-haze': {
          primary: '#d946ef',
          secondary: '#f472b6',
          accent: '#a855f7',
          background: '#1a0b2e',
          surface: 'rgba(45, 25, 70, 0.9)',
          text: '#fbbf24',
        },
        'cosmic-purple': {
          primary: '#7c3aed',
          secondary: '#a855f7',
          accent: '#c084fc',
          background: '#0c0a1e',
          surface: 'rgba(30, 25, 60, 0.95)',
          text: '#e879f9',
        }
      };
      return themes[context.currentTheme] || themes.sanctuary;
    },
    
    // Animation helpers
    getAnimationDuration: (baseMs: number = 300) => 
      context.customSettings.reducedMotion ? Math.min(baseMs / 3, 100) : baseMs,
    
    // CSS class helpers
    getThemeClasses: () => {
      const classes = [`theme-${context.currentTheme}`];
      if (context.customSettings.highContrast) classes.push('high-contrast');
      if (context.customSettings.reducedMotion) classes.push('reduced-motion');
      if (context.customSettings.colorBlindSupport !== 'none') {
        classes.push(`colorblind-${context.customSettings.colorBlindSupport}`);
      }
      return classes.join(' ');
    },
  };
};
