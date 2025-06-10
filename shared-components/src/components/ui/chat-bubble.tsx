"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { motion } from "framer-motion"

interface ChatBubbleProps {
  variant?: "sent" | "received"
  layout?: "default" | "ai"
  className?: string
  children: React.ReactNode
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

function ChatBubble({
  variant = "received",
  layout = "default",
  className,
  children,
  reducedMotion = false,
  neurodivergentMode = false,
}: ChatBubbleProps) {
  const motionConfig = reducedMotion 
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.1 }
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: neurodivergentMode ? 0.5 : 0.3,
          ease: "easeOut"
        }
      };

  return (
    <motion.div
      {...motionConfig}
      className={cn(
        "flex items-start gap-2 mb-4",
        variant === "sent" && "flex-row-reverse",
        neurodivergentMode && "mb-6", // More spacing for neurodivergent mode
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

interface ChatBubbleMessageProps {
  variant?: "sent" | "received"
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

function ChatBubbleMessage({
  variant = "received",
  isLoading,
  className,
  children,
  reducedMotion = false,
  neurodivergentMode = false,
}: ChatBubbleMessageProps) {
  // Enhanced contrast for neurodivergent mode
  const bubbleStyle = neurodivergentMode
    ? variant === "sent" 
      ? "bg-primary text-primary-foreground border-2 border-primary/20" 
      : "bg-muted border-2 border-muted-foreground/20"
    : variant === "sent" 
      ? "bg-primary text-primary-foreground" 
      : "bg-muted";

  return (
    <div
      className={cn(
        "rounded-lg p-3 max-w-[80%]",
        bubbleStyle,
        neurodivergentMode && "text-base leading-relaxed", // Better readability
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading reducedMotion={reducedMotion} />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
  neurodivergentMode?: boolean
}

function ChatBubbleAvatar({
  src,
  fallback = "AI",
  className,
  neurodivergentMode = false,
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn(
      "h-8 w-8", 
      neurodivergentMode && "h-10 w-10 ring-2 ring-primary/20", // Larger, more visible in ND mode
      className
    )}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

function ChatBubbleAction({
  icon,
  onClick,
  className,
  reducedMotion = false,
  neurodivergentMode = false,
}: ChatBubbleActionProps) {
  return (
    <Button
      variant="ghost"
      size={neurodivergentMode ? "sm" : "icon"}
      className={cn(
        "h-6 w-6",
        neurodivergentMode && "h-8 w-8 ring-1 ring-muted-foreground/20 hover:ring-primary/40",
        !reducedMotion && "hover:scale-110 transition-transform",
        className
      )}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

function ChatBubbleActionWrapper({
  className,
  children,
  neurodivergentMode = false,
}: {
  className?: string
  children: React.ReactNode
  neurodivergentMode?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-1 mt-2",
      neurodivergentMode && "gap-2 mt-3", // More spacing in ND mode
      className
    )}>
      {children}
    </div>
  )
}

// Simple loading component for chat messages
function MessageLoading({ reducedMotion = false }: { reducedMotion?: boolean }) {
  if (reducedMotion) {
    return <span className="text-muted-foreground">Typing...</span>
  }

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-muted-foreground rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAvatar,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
};

export type { ChatBubbleProps, ChatBubbleMessageProps, ChatBubbleAvatarProps, ChatBubbleActionProps };
