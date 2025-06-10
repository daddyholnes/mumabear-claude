// filepath: shared-components/src/hooks/use-auto-scroll.ts
"use client"

import * as React from "react"

interface UseAutoScrollProps {
  smooth?: boolean
  content?: React.ReactNode
}

interface UseAutoScrollReturn {
  scrollRef: React.RefObject<HTMLDivElement>
  isAtBottom: boolean
  autoScrollEnabled: boolean
  scrollToBottom: () => void
  disableAutoScroll: () => void
}

export function useAutoScroll({ 
  smooth = false, 
  content 
}: UseAutoScrollProps): UseAutoScrollReturn {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [autoScrollEnabled, setAutoScrollEnabled] = React.useState(true)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      const element = scrollRef.current
      element.scrollTo({
        top: element.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
      setIsAtBottom(true)
      setAutoScrollEnabled(true)
    }
  }, [smooth])

  const disableAutoScroll = React.useCallback(() => {
    setAutoScrollEnabled(false)
    // Re-enable auto scroll after a delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setAutoScrollEnabled(true)
    }, 3000) // Re-enable after 3 seconds of inactivity
  }, [])

  const checkScrollPosition = React.useCallback(() => {
    if (!scrollRef.current) return
    
    const element = scrollRef.current
    const threshold = 50 // pixels from bottom
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= threshold
    
    setIsAtBottom(atBottom)
    
    if (!atBottom && autoScrollEnabled) {
      setAutoScrollEnabled(false)
    }
  }, [autoScrollEnabled])

  // Auto-scroll when content changes and auto-scroll is enabled
  React.useEffect(() => {
    if (autoScrollEnabled && isAtBottom) {
      scrollToBottom()
    }
  }, [content, autoScrollEnabled, isAtBottom, scrollToBottom])

  // Set up scroll event listener
  React.useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      checkScrollPosition()
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check
    checkScrollPosition()

    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [checkScrollPosition])

  return {
    scrollRef,
    isAtBottom,
    autoScrollEnabled,
    scrollToBottom,
    disableAutoScroll
  }
}
