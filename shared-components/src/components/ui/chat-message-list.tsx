// filepath: shared-components/src/components/ui/chat-message-list.tsx
"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"
import { Button } from "./button"
import { useAutoScroll } from "../../hooks/use-auto-scroll"
import { cn } from "../../utils/cn"

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  smooth?: boolean
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ 
    className, 
    children, 
    reducedMotion = false,
    neurodivergentMode = false,
    smooth = false, 
    ...props 
  }, _ref) => {
    const {
      scrollRef,
      isAtBottom,
      autoScrollEnabled,
      scrollToBottom,
      disableAutoScroll,
    } = useAutoScroll({
      smooth: smooth && !reducedMotion, // Respect reduced motion preference
      content: children,
    })

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "flex flex-col w-full h-full p-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border",
            neurodivergentMode && [
              "p-6", // More padding for neurodivergent users
              "scroll-smooth", // Smooth scrolling for better UX
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            ],
            className
          )}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          {...props}
        >
          <div 
            className={cn(
              "flex flex-col gap-6",
              neurodivergentMode && "gap-8" // More spacing for neurodivergent users
            )}
          >
            {children}
          </div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom()
            }}
            size="icon"
            variant="outline"
            className={cn(
              "absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md",
              "hover:shadow-lg transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              neurodivergentMode && [
                "bottom-4 left-1/2", // Better positioning for neurodivergent users
                "h-12 w-12", // Larger button for easier interaction
                "border-2 border-border/80", // Thicker border for better definition
                "hover:bg-accent/10 hover:border-accent/60"
              ],
              !reducedMotion && "animate-bounce" // Only animate if motion is not reduced
            )}
            aria-label="Scroll to bottom of chat"
          >
            <ArrowDown 
              className={cn(
                "h-4 w-4",
                neurodivergentMode && "h-5 w-5" // Larger icon for neurodivergent users
              )} 
            />
          </Button>
        )}
      </div>
    )
  }
)

ChatMessageList.displayName = "ChatMessageList"

export { ChatMessageList }
export type { ChatMessageListProps }
