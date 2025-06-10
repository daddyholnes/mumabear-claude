// filepath: shared-components/src/components/ui/chat-input.tsx
"use client"

import * as React from "react"
import { Textarea } from "./textarea"
import { cn } from "../../utils/cn"

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({
    className,
    reducedMotion = false,
    neurodivergentMode = false,
    ...props
  }, ref) => (
    <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      reducedMotion={reducedMotion}
      neurodivergentMode={neurodivergentMode}
      className={cn(
        "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        "w-full rounded-md flex items-center h-16 resize-none",
        "border border-input shadow-sm transition-colors",
        neurodivergentMode && [
          "max-h-16 h-20 px-6 py-4", // Larger input area for neurodivergent users
          "text-base leading-relaxed", // Better typography
          "border-2 border-input/80", // Thicker border for better definition
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:border-input/60 transition-all duration-200"
        ],
        className,
      )}
      {...props}
    />
  ),
)
ChatInput.displayName = "ChatInput"

export { ChatInput }
export type { ChatInputProps }
