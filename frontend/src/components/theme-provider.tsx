import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores';
import { setTheme, setCustomSettings, loadThemeFromStorage, ThemeState } from '@/stores/slices/themeSlice';
import type { ThemeVariant } from '@/stores/slices/themeSlice';

// Backward compatibility types
type LegacyTheme = 'dark' | 'light' | 'system';

// Enhanced theme provider types
type ExtendedTheme = ThemeVariant | LegacyTheme;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ExtendedTheme;
  storageKey?: string;
};

type ThemeProviderState = {
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
};

const initialState: ThemeProviderState = {
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
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const dispatch = useDispatch();
  const themeState = useSelector((state: RootState) => state.theme);
  
  // Legacy theme state for backward compatibility
  const [legacyTheme, setLegacyTheme] = useState<LegacyTheme>(
    () => (localStorage.getItem(storageKey) as LegacyTheme) || (defaultTheme as LegacyTheme) || 'system'
  );

  // Initialize Redux theme from localStorage
  useEffect(() => {
    dispatch(loadThemeFromStorage());
  }, [dispatch]);

  // Sync legacy theme with Redux theme
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme classes
    root.classList.remove('light', 'dark');
    
    // Handle legacy theme mapping
    if (legacyTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      
      // Map to enhanced theme
      const enhancedTheme = systemTheme === 'dark' ? 'night' : 'daytime';
      if (themeState.currentTheme !== enhancedTheme) {
        dispatch(setTheme(enhancedTheme));
      }
    } else {
      root.classList.add(legacyTheme);
      
      // Map legacy to enhanced theme
      const enhancedTheme = legacyTheme === 'dark' ? 'night' : 'daytime';
      if (themeState.currentTheme !== enhancedTheme) {
        dispatch(setTheme(enhancedTheme));
      }
    }
  }, [legacyTheme, themeState.currentTheme, dispatch]);

  // Enhanced theme provider value
  const value: ThemeProviderState = {
    // Legacy compatibility
    theme: legacyTheme,
    setTheme: (theme: LegacyTheme) => {
      localStorage.setItem(storageKey, theme);
      setLegacyTheme(theme);
    },
    
    // Enhanced theme system
    currentTheme: themeState.currentTheme,
    setCurrentTheme: (theme: ThemeVariant) => {
      dispatch(setTheme(theme));
    },
    customSettings: themeState.customSettings,
    updateCustomSettings: (settings) => {
      dispatch(setCustomSettings(settings));
    },
    previewMode: themeState.previewMode,
    previewTheme: themeState.previewTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// Enhanced theme hook with full Redux integration
export const useEnhancedTheme = () => {
  const context = useTheme();
  const dispatch = useDispatch();
  const themeState = useSelector((state: RootState) => state.theme);
  
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
  };
};