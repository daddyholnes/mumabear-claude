"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../../utils/cn"

interface SeparatorProps 
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({
  className,
  orientation = "horizontal",
  decorative = true,
  reducedMotion = false,
  neurodivergentMode = false,
  theme = 'system',
  ...props
}, ref) => {
  // Enhanced visibility for neurodivergent users
  const separatorStyles = neurodivergentMode
    ? "shrink-0 bg-border/60 border-border/30"
    : "shrink-0 bg-border"

  const thickness = neurodivergentMode 
    ? (orientation === "horizontal" ? "h-[2px] w-full" : "h-full w-[2px]")
    : (orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]")

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorStyles,
        thickness,
        // Add subtle border for better definition in neurodivergent mode
        neurodivergentMode && "border-t border-b",
        className
      )}
      {...props}
    />
  )
})
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
export type { SeparatorProps }
