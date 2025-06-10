"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../utils/cn"

interface TooltipProviderProps 
  extends React.ComponentProps<typeof TooltipPrimitive.Provider> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface TooltipContentProps 
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

const TooltipProvider = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Provider>,
  TooltipProviderProps
>(({ 
  delayDuration = 0, 
  reducedMotion = false, 
  neurodivergentMode = false, 
  ...props 
}, ref) => {
  // Longer delay for neurodivergent users to avoid overwhelming tooltips
  const adjustedDelay = neurodivergentMode ? Math.max(delayDuration, 500) : delayDuration

  return (
    <TooltipPrimitive.Provider
      delayDuration={adjustedDelay}
      {...props}
    />
  )
})
TooltipProvider.displayName = TooltipPrimitive.Provider.displayName

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ 
  className, 
  sideOffset = 4, 
  reducedMotion = false, 
  neurodivergentMode = false, 
  ...props 
}, ref) => {
  const animationClasses = reducedMotion 
    ? ""
    : "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"

  const contentStyles = neurodivergentMode
    ? "z-50 overflow-hidden rounded-lg border-2 bg-popover px-4 py-2.5 text-sm text-popover-foreground shadow-lg max-w-xs"
    : "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        contentStyles,
        animationClasses,
        // Enhanced readability for neurodivergent users
        neurodivergentMode && "leading-relaxed font-medium",
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}

export type {
  TooltipProviderProps,
  TooltipContentProps,
}
