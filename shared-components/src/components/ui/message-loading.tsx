// filepath: shared-components/src/components/ui/message-loading.tsx
"use client"

import * as React from "react"
import { cn } from "../../utils/cn"

interface MessageLoadingProps extends React.SVGProps<SVGSVGElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  size?: 'sm' | 'md' | 'lg'
}

const MessageLoading = React.forwardRef<SVGSVGElement, MessageLoadingProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false,
    size = 'md',
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8"
    }

    const neurodivergentSizes = {
      sm: "w-5 h-5",
      md: "w-7 h-7",
      lg: "w-10 h-10"
    }

    const currentSize = neurodivergentMode ? neurodivergentSizes[size] : sizeClasses[size]

    // Animation duration - slower for neurodivergent mode and reduced motion
    const animationDuration = reducedMotion ? "1.2s" : neurodivergentMode ? "0.8s" : "0.6s"
    const beginDelay1 = reducedMotion ? "0.15s" : "0.1s"
    const beginDelay2 = reducedMotion ? "0.3s" : "0.2s"

    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "text-foreground",
          currentSize,
          neurodivergentMode && "opacity-80", // Slightly reduce intensity for neurodivergent users
          className
        )}
        role="img"
        aria-label="Loading message"
        {...props}
      >
        <circle cx="4" cy="12" r={neurodivergentMode ? "2.5" : "2"} fill="currentColor">
          {!reducedMotion && (
            <animate
              id="spinner_qFRN"
              begin={`0;spinner_OcgL.end+0.25s`}
              attributeName="cy"
              calcMode="spline"
              dur={animationDuration}
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="12" cy="12" r={neurodivergentMode ? "2.5" : "2"} fill="currentColor">
          {!reducedMotion && (
            <animate
              begin={`spinner_qFRN.begin+${beginDelay1}`}
              attributeName="cy"
              calcMode="spline"
              dur={animationDuration}
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="20" cy="12" r={neurodivergentMode ? "2.5" : "2"} fill="currentColor">
          {!reducedMotion && (
            <animate
              id="spinner_OcgL"
              begin={`spinner_qFRN.begin+${beginDelay2}`}
              attributeName="cy"
              calcMode="spline"
              dur={animationDuration}
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>
    )
  }
)

MessageLoading.displayName = "MessageLoading"

export { MessageLoading }
export type { MessageLoadingProps }
