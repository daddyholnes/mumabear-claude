import { cn } from "../../utils/cn";
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    theme = 'system',
    ...props 
  }, ref) => {
    const animationClass = reducedMotion 
      ? "" 
      : "animate-pulse"

    const skeletonStyles = neurodivergentMode
      ? "rounded-lg bg-muted/40 border border-border/30"
      : "rounded-md bg-primary/10"

    return (
      <div
        ref={ref}
        className={cn(
          animationClass,
          skeletonStyles,
          // Gentler animation for neurodivergent users
          neurodivergentMode && !reducedMotion && "animate-pulse-slow",
          className
        )}
        role="status"
        aria-label="Loading..."
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
export type { SkeletonProps }
