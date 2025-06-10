// Theme management for multi-theme UI hub
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    text: string;
  };
  effects: {
    blur: boolean;
    particles: boolean;
    animations: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
  };
}

const themes: Record<string, ThemeConfig> = {
  sanctuary: {
    id: 'sanctuary',
    name: 'Sanctuary',
    colors: {
      primary: 'from-purple-900 via-blue-900 to-indigo-900',
      secondary: 'from-purple-600 to-blue-600',
      background: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
      accent: 'text-purple-300',
      text: 'text-white',
    },
    effects: {
      blur: true,
      particles: true,
      animations: true,
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
    },
  },
  daytime: {
    id: 'daytime',
    name: 'Daytime',
    colors: {
      primary: 'from-blue-400 via-cyan-400 to-teal-400',
      secondary: 'from-blue-300 to-cyan-300',
      background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
      accent: 'text-blue-600',
      text: 'text-gray-800',
    },
    effects: {
      blur: true,
      particles: false,
      animations: true,
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
    },
  },
  night: {
    id: 'night',
    name: 'Night',
    colors: {
      primary: 'from-gray-800 via-gray-900 to-black',
      secondary: 'from-gray-700 to-gray-800',
      background: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
      accent: 'text-gray-300',
      text: 'text-white',
    },
    effects: {
      blur: true,
      particles: false,
      animations: true,
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
    },
  },
  purpleHaze: {
    id: 'purpleHaze',
    name: 'Purple Haze',
    colors: {
      primary: 'from-purple-800 via-pink-700 to-purple-900',
      secondary: 'from-purple-500 to-pink-500',
      background: 'bg-gradient-to-br from-purple-800 via-pink-800 to-purple-900',
      accent: 'text-pink-300',
      text: 'text-white',
    },
    effects: {
      blur: true,
      particles: true,
      animations: true,
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
    },
  },
  cosmicPurple: {
    id: 'cosmicPurple',
    name: 'Cosmic Purple',
    colors: {
      primary: 'from-indigo-900 via-purple-900 to-pink-900',
      secondary: 'from-indigo-600 to-purple-600',
      background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
      accent: 'text-indigo-300',
      text: 'text-white',
    },
    effects: {
      blur: true,
      particles: true,
      animations: true,
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
    },
  },
};

interface ThemeState {
  currentTheme: string;
  themes: Record<string, ThemeConfig>;
  customThemes: Record<string, ThemeConfig>;
}

const initialState: ThemeState = {
  currentTheme: 'sanctuary',
  themes,
  customThemes: {},
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload;
    },
    updateThemeAccessibility: (state, action: PayloadAction<{ themeId: string; accessibility: Partial<ThemeConfig['accessibility']> }>) => {
      const { themeId, accessibility } = action.payload;
      if (state.themes[themeId]) {
        state.themes[themeId].accessibility = { ...state.themes[themeId].accessibility, ...accessibility };
      }
    },
    updateThemeEffects: (state, action: PayloadAction<{ themeId: string; effects: Partial<ThemeConfig['effects']> }>) => {
      const { themeId, effects } = action.payload;
      if (state.themes[themeId]) {
        state.themes[themeId].effects = { ...state.themes[themeId].effects, ...effects };
      }
    },
    addCustomTheme: (state, action: PayloadAction<ThemeConfig>) => {
      state.customThemes[action.payload.id] = action.payload;
    },
  },
});

export const { setTheme, updateThemeAccessibility, updateThemeEffects, addCustomTheme } = themeSlice.actions;
export default themeSlice.reducer;
