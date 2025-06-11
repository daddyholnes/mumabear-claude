// filepath: shared-components/src/components/ui/sheet.tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"

interface SheetProps extends React.ComponentProps<typeof SheetPrimitive.Root> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface SheetOverlayProps 
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, reducedMotion = false, neurodivergentMode = false, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      !reducedMotion && [
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      ],
      neurodivergentMode && "bg-black/60", // Less intense overlay for neurodivergent users
      className,
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t", 
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
)

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ 
  side = "right", 
  className, 
  children, 
  reducedMotion = false, 
  neurodivergentMode = false,
  ...props 
}, ref) => (
  <SheetPortal>
    <SheetOverlay reducedMotion={reducedMotion} neurodivergentMode={neurodivergentMode} />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        sheetVariants({ side }),
        !reducedMotion && [
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", 
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        ],
        neurodivergentMode && [
          "p-8", // More padding for neurodivergent users
          "border-2", // Thicker border for better definition
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        ],
        className
      )}
      onEscapeKeyDown={(e) => {
        // Longer delay before closing for neurodivergent users
        if (neurodivergentMode) {
          e.preventDefault()
          setTimeout(() => {
            // Find the close button and trigger it
            const closeButton = document.querySelector('[data-radix-collection-item]')
            if (closeButton && 'click' in closeButton) {
              (closeButton as HTMLElement).click()
            }
          }, 300)
        }
      }}
      {...props}
    >
      {children}
      <SheetPrimitive.Close 
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
          "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none data-[state=open]:bg-secondary",
          neurodivergentMode && [
            "right-6 top-6", // Better positioning for neurodivergent users
            "h-6 w-6 p-1", // Larger close button
            "hover:bg-destructive/10 focus:bg-destructive/10"
          ]
        )}
      >
        <X className={cn("h-4 w-4", neurodivergentMode && "h-5 w-5")} />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { neurodivergentMode?: boolean }
>(({ className, neurodivergentMode = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      neurodivergentMode && "space-y-4", // More spacing for neurodivergent users
      className,
    )}
    {...props}
  />
))
SheetHeader.displayName = "SheetHeader"

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { neurodivergentMode?: boolean }
>(({ className, neurodivergentMode = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      neurodivergentMode && "space-y-4 sm:space-y-0 sm:space-x-4", // More spacing
      className,
    )}
    {...props}
  />
))
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> & { neurodivergentMode?: boolean }
>(({ className, neurodivergentMode = false, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold text-foreground",
      neurodivergentMode && "text-xl leading-relaxed", // Larger, more relaxed typography
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> & { neurodivergentMode?: boolean }
>(({ className, neurodivergentMode = false, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      neurodivergentMode && "text-base leading-relaxed", // Larger, more readable text
      className
    )}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

export type { SheetProps, SheetContentProps, SheetOverlayProps }
