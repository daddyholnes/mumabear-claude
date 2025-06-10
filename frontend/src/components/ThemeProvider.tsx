// ThemeProvider component for managing theme context
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentTheme, themes } = useSelector((state: RootState) => state.theme);
  const theme = themes[currentTheme];

  if (!theme) {
    return <div>{children}</div>;
  }

  return (
    <div 
      className={`min-h-screen ${theme.colors.background} transition-all duration-500`}
      style={{
        filter: theme.accessibility.highContrast ? 'contrast(150%)' : 'none',
        fontSize: theme.accessibility.largeText ? '1.125rem' : '1rem',
      }}
    >
      {theme.effects.particles && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Particle effect background */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default ThemeProvider;
