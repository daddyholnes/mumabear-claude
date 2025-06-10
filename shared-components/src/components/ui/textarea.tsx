import * as React from "react"
import { cn } from "../../utils/cn"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    reducedMotion = false,
    neurodivergentMode = false,
    theme = 'system',
    ...props
  }, ref) => {
    // Enhanced styles for neurodivergent users
    const baseStyles = neurodivergentMode
      ? "flex min-h-[100px] w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base"
      : "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"

    const focusStyles = neurodivergentMode
      ? "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-primary/25"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

    const transitionStyles = reducedMotion 
      ? "" 
      : "transition-colors"

    return (
      <textarea
        className={cn(
          baseStyles,
          "ring-offset-background",
          "placeholder:text-muted-foreground",
          focusStyles,
          transitionStyles,
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Enhanced line height for neurodivergent users
          neurodivergentMode && "leading-relaxed resize-y",
          // Focus background for better visibility
          neurodivergentMode && "focus:bg-accent/5",
          className
        )}
        ref={ref}
        aria-invalid={props['aria-invalid']}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaProps }
