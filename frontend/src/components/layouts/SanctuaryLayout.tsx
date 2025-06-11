import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain } from 'lucide-react'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import SanctuaryNav from './SanctuaryNav'
import AuroraBackground from '../effects/AuroraBackground'
import UniversalMamaBearWidget from '../specialized/UniversalMamaBearWidget'

interface SanctuaryLayoutProps {
  children: React.ReactNode
}

export default function SanctuaryLayout({ children }: SanctuaryLayoutProps) {
  const {
    sidebarCollapsed,
    autoHideSidebar,
    effectLevel,
    theme,
    mamaBearVisible,
    setSidebarCollapsed,
    setMamaBearVisible
  } = useSanctuaryStore()

  const [mouseNearSidebar, setMouseNearSidebar] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-hide sidebar logic - Fixed
  useEffect(() => {
    if (!autoHideSidebar) return

    let hideTimer: NodeJS.Timeout | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const isNearLeft = e.clientX < 80
      setMouseNearSidebar(isNearLeft)
      
      // Clear existing timer
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      
      if (isNearLeft && sidebarCollapsed) {
        setSidebarCollapsed(false)
      } else if (!isNearLeft && !isHovered && !sidebarCollapsed && e.clientX > 300) {
        // Set new timer to hide sidebar
        hideTimer = setTimeout(() => {
          setSidebarCollapsed(true)
        }, 1500)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [autoHideSidebar, sidebarCollapsed, isHovered, setSidebarCollapsed])

  const layoutVariants = {
    expanded: {
      marginLeft: 280,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    },
    collapsed: {
      marginLeft: 80,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const containerClass = `
    min-h-screen relative overflow-hidden
    ${effectLevel === 'full' ? 'splash-cursor' : ''}
    theme-${theme}
  `.trim()

  return (
    <div className={containerClass}>
      {/* Background Effects */}
      <AnimatePresence>
        {effectLevel === 'full' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <AuroraBackground>
              <div className="absolute inset-0" />
            </AuroraBackground>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor Effects - Temporarily disabled for performance */}
      {/* {effectLevel === 'full' && <SplashCursor />} */}

      {/* Navigation Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        variants={{
          expanded: { x: 0 },
          collapsed: { x: 0 }
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <SanctuaryNav />
      </motion.div>

      {/* Main Content Area */}
      <motion.main
        className="relative z-10"
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        variants={layoutVariants}
        style={{
          minHeight: '100vh',
          background: effectLevel === 'none' 
            ? 'var(--color-background)' 
            : 'transparent'
        }}
      >
        {/* Glass Content Container */}
        <motion.div
          className={`
            min-h-screen
            ${effectLevel !== 'none' ? 'glass' : 'bg-background'}
            ${effectLevel === 'full' ? 'backdrop-blur-xl' : ''}
          `.trim()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </motion.main>

      {/* Persistent Mama Bear Icon */}
      <AnimatePresence>
        {!mamaBearVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={() => setMamaBearVisible(true)}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mama Bear Widget */}
      <AnimatePresence>
        {mamaBearVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-40"
          >
            <UniversalMamaBearWidget />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Particles - Reduced for performance */}
      {effectLevel === 'full' && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-500 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}      {/* Performance Overlay for Debugging - Temporarily disabled 
      {process.env.NODE_ENV === 'development' && 
       typeof window !== 'undefined' && 
       !window.navigator.userAgent.includes('HeadlessChrome') && (
        <motion.div
          className="fixed bottom-4 left-4 z-50 glass p-3 rounded-lg text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div>Theme: {theme}</div>
          <div>Effects: {effectLevel}</div>
          <div>Sidebar: {sidebarCollapsed ? 'collapsed' : 'expanded'}</div>
          <div>Auto-hide: {autoHideSidebar ? 'on' : 'off'}</div>
        </motion.div>
      )}
      */}
    </div>
  )
}