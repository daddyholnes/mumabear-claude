"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "../../utils/cn"

interface AvatarProps 
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

interface AvatarImageProps 
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface AvatarFallbackProps 
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ 
  className, 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme = 'system',
  ...props 
}, ref) => {
  const avatarStyles = neurodivergentMode
    ? "relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-border"
    : "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        avatarStyles,
        neurodivergentMode && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ 
  className, 
  reducedMotion = false, 
  neurodivergentMode = false, 
  ...props 
}, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover",
      !reducedMotion && "transition-opacity duration-200",
      className
    )}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ 
  className, 
  reducedMotion = false, 
  neurodivergentMode = false, 
  ...props 
}, ref) => {
  const fallbackStyles = neurodivergentMode
    ? "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium"
    : "flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium"

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        fallbackStyles,
        !reducedMotion && "transition-colors duration-200",
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps }