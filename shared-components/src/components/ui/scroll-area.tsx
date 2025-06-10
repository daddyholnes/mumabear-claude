// filepath: shared-components/src/components/ui/scroll-area.tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "../../utils/cn"

interface ScrollAreaProps 
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

interface ScrollBarProps 
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  neurodivergentMode?: boolean
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, reducedMotion = false, neurodivergentMode = false, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden",
      neurodivergentMode && "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className={cn(
      "h-full w-full rounded-[inherit]",
      neurodivergentMode && "scroll-smooth"
    )}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar neurodivergentMode={neurodivergentMode} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", neurodivergentMode = false, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        cn(
          "h-full border-l border-l-transparent p-[1px]",
          neurodivergentMode ? "w-4" : "w-2.5" // Wider scrollbar for neurodivergent users
        ),
      orientation === "horizontal" &&
        cn(
          "flex-col border-t border-t-transparent p-[1px]",
          neurodivergentMode ? "h-4" : "h-2.5" // Taller scrollbar for neurodivergent users
        ),
      neurodivergentMode && "hover:bg-muted/50 focus-visible:bg-muted/50",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className={cn(
        "relative flex-1 rounded-full bg-border",
        neurodivergentMode && [
          "bg-border/80 hover:bg-border transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        ]
      )} 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
export type { ScrollAreaProps, ScrollBarProps }
