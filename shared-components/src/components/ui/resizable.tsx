// filepath: shared-components/src/components/ui/resizable.tsx
"use client"

import * as React from "react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "../../utils/cn"

interface ResizablePanelGroupProps 
  extends React.ComponentProps<typeof PanelGroup> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

interface ResizablePanelProps 
  extends React.ComponentProps<typeof Panel> {
  neurodivergentMode?: boolean
}

interface ResizableHandleProps 
  extends React.ComponentProps<typeof PanelResizeHandle> {
  neurodivergentMode?: boolean
  withHandle?: boolean
}

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof PanelGroup>,
  ResizablePanelGroupProps
>(({ 
  className, 
  reducedMotion = false, 
  neurodivergentMode = false,
  ...props 
}, ref) => (
  <PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      neurodivergentMode && "gap-2", // Add gap between panels for better visual separation
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof Panel>,
  ResizablePanelProps
>(({ className, neurodivergentMode = false, ...props }, ref) => (
  <Panel
    ref={ref}
    className={cn(
      neurodivergentMode && [
        "border border-border/50 rounded-md", // Add border for better definition
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      ],
      className
    )}
    {...props}
  />
))
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof PanelResizeHandle>,
  ResizableHandleProps
>(({ 
  className, 
  neurodivergentMode = false, 
  withHandle = false,
  ...props 
}, ref) => (
  <PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      neurodivergentMode && [
        "w-1 bg-border/60", // Wider handle for easier interaction
        "hover:bg-border transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[panel-group-direction=vertical]:h-1"
      ],
      className
    )}
    {...props}
    {...(ref ? { ref } : {})}
  >
    {withHandle && (
      <div 
        className={cn(
          "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border",
          neurodivergentMode && [
            "h-6 w-4", // Larger handle for neurodivergent users
            "border-2 border-border/80",
            "hover:bg-accent hover:text-accent-foreground transition-colors"
          ]
        )}
      >
        <svg
          className={cn(
            "h-2.5 w-2.5",
            neurodivergentMode && "h-3 w-3"
          )}
          fill="currentColor"
          viewBox="0 0 6 6"
        >
          <circle cx="1" cy="1" r="1" />
          <circle cx="1" cy="3" r="1" />
          <circle cx="1" cy="5" r="1" />
          <circle cx="3" cy="1" r="1" />
          <circle cx="3" cy="3" r="1" />
          <circle cx="3" cy="5" r="1" />
        </svg>
      </div>
    )}
  </PanelResizeHandle>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
export type { ResizablePanelGroupProps, ResizablePanelProps, ResizableHandleProps }
