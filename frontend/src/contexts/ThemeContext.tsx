import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme, themes } from '../lib/utils'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  availableThemes: readonly Theme[]
  isNeurodivergentMode: boolean
  setNeurodivergentMode: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'sanctuary' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('podplay-theme')
    return (stored && themes.includes(stored as Theme)) ? stored as Theme : defaultTheme
  })

  const [isNeurodivergentMode, setNeurodivergentMode] = useState(() => {
    return localStorage.getItem('podplay-neurodivergent-mode') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('podplay-theme', theme)
    
    // Remove all theme classes
    const root = document.documentElement
    themes.forEach(t => root.classList.remove(`theme-${t}`))
    
    // Add current theme class (except for default 'sanctuary')
    if (theme !== 'sanctuary') {
      root.classList.add(`theme-${theme}`)
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('podplay-neurodivergent-mode', isNeurodivergentMode.toString())
    
    const root = document.documentElement
    if (isNeurodivergentMode) {
      root.classList.add('neurodivergent-mode')
    } else {
      root.classList.remove('neurodivergent-mode')
    }
  }, [isNeurodivergentMode])

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    availableThemes: themes,
    isNeurodivergentMode,
    setNeurodivergentMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
