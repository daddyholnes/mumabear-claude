import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeVariant = 'sanctuary' | 'daytime' | 'night' | 'purple-haze' | 'cosmic-purple'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
}

export interface ThemeState {
  currentTheme: ThemeVariant
  customSettings: {
    highContrast: boolean
    reducedMotion: boolean
    fontSize: 'small' | 'medium' | 'large' | 'extra-large'
    colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  }
  backgroundSettings: {
    type: 'gradient' | 'pattern' | 'animated'
    customBackground?: string
  }
  previewMode: boolean
  previewTheme?: ThemeVariant
}

const initialState: ThemeState = {
  currentTheme: 'sanctuary',
  customSettings: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    colorBlindSupport: 'none',
  },
  backgroundSettings: {
    type: 'gradient',
  },
  previewMode: false,
}

export const themeDefinitions: Record<ThemeVariant, ThemeColors> = {
  sanctuary: {
    primary: 'linear-gradient(135deg, #2D5A3D 0%, #4A7C59 100%)',
    secondary: 'linear-gradient(135deg, #5D8A6B 0%, #7BA185 100%)',
    accent: 'linear-gradient(135deg, #8FBC8F 0%, #98FB98 100%)',
    background: '#F8FDF9',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#2C3E2F',
  },
  daytime: {
    primary: 'linear-gradient(135deg, #87CEEB 0%, #4FC3F7 100%)',
    secondary: 'linear-gradient(135deg, #FFE082 0%, #FFF176 100%)',
    accent: 'linear-gradient(135deg, #81C784 0%, #AED581 100%)',
    background: '#F0F8FF',
    surface: 'rgba(255, 255, 255, 0.98)',
    text: '#1565C0',
  },
  night: {
    primary: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)',
    secondary: 'linear-gradient(135deg, #415A77 0%, #778DA9 100%)',
    accent: 'linear-gradient(135deg, #B0C4DE 0%, #E0E6ED 100%)',
    background: '#0A0E27',
    surface: 'rgba(15, 25, 45, 0.95)',
    text: '#E0E6ED',
  },
  'purple-haze': {
    primary: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%)',
    secondary: 'linear-gradient(135deg, #7B1FA2 0%, #8E24AA 100%)',
    accent: 'linear-gradient(135deg, #CE93D8 0%, #F8BBD9 100%)',
    background: 'linear-gradient(135deg, #1A0033 0%, #2D1B47 100%)',
    surface: 'rgba(74, 20, 140, 0.15)',
    text: '#E1BEE7',
  },
  'cosmic-purple': {
    primary: 'linear-gradient(135deg, #1A0033 0%, #330066 100%)',
    secondary: 'linear-gradient(135deg, #4B0082 0%, #663399 100%)',
    accent: 'linear-gradient(135deg, #9932CC 0%, #DA70D6 100%)',
    background: 'linear-gradient(135deg, #0A0015 0%, #1A0033 50%, #2D1B47 100%)',
    surface: 'rgba(75, 0, 130, 0.2)',
    text: '#DDA0DD',
  },
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeVariant>) => {
      state.currentTheme = action.payload
      state.previewMode = false
      state.previewTheme = undefined
      
      // Apply theme to document root
      document.documentElement.setAttribute('data-theme', action.payload)
      localStorage.setItem('sanctuary-theme', action.payload)
    },
    
    setCustomSettings: (state, action: PayloadAction<Partial<typeof initialState.customSettings>>) => {
      state.customSettings = { ...state.customSettings, ...action.payload }
      localStorage.setItem('sanctuary-theme-settings', JSON.stringify(state.customSettings))
    },
    
    setBackgroundSettings: (state, action: PayloadAction<Partial<typeof initialState.backgroundSettings>>) => {
      state.backgroundSettings = { ...state.backgroundSettings, ...action.payload }
    },
    
    startPreview: (state, action: PayloadAction<ThemeVariant>) => {
      state.previewMode = true
      state.previewTheme = action.payload
      document.documentElement.setAttribute('data-theme', action.payload)
    },
    
    stopPreview: (state) => {
      state.previewMode = false
      state.previewTheme = undefined
      document.documentElement.setAttribute('data-theme', state.currentTheme)
    },
    
    loadThemeFromStorage: (state) => {
      const savedTheme = localStorage.getItem('sanctuary-theme') as ThemeVariant
      const savedSettings = localStorage.getItem('sanctuary-theme-settings')
      
      if (savedTheme && themeDefinitions[savedTheme]) {
        state.currentTheme = savedTheme
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
      
      if (savedSettings) {
        try {
          state.customSettings = { ...state.customSettings, ...JSON.parse(savedSettings) }
        } catch (e) {
          console.warn('Failed to parse saved theme settings')
        }
      }
    },
  },
})

export const { 
  setTheme, 
  setCustomSettings, 
  setBackgroundSettings, 
  startPreview, 
  stopPreview, 
  loadThemeFromStorage 
} = themeSlice.actions

export default themeSlice.reducer
