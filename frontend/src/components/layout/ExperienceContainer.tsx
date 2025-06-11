import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface ExperienceContainerProps {
  children: React.ReactNode
}

export function ExperienceContainer({ children }: ExperienceContainerProps) {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui)
  const { theme, neurodivergentMode } = useTheme()

  return (
    <div className={cn(
      "h-full overflow-hidden transition-all duration-300",
      "bg-sanctuary-bg text-foreground",
      neurodivergentMode && "px-1"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Theme-specific background gradients */}
        <div className={cn(
          "absolute inset-0 opacity-30",
          theme === 'sanctuary' && "sanctuary-gradient",
          theme === 'daytime' && "daytime-gradient",
          theme === 'night' && "night-gradient",
          theme === 'purple-haze' && "purple-haze-gradient",
          theme === 'cosmic-purple' && "cosmic-purple-gradient"
        )} />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
