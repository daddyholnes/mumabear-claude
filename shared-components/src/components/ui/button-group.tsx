"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, variant = "default", size = "default", disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex rounded-md shadow-sm",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        role="group"
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === Button) {
            const isFirst = index === 0
            const isLast = index === React.Children.count(children) - 1
            
            return React.cloneElement(child, {
              ...child.props,
              variant: child.props.variant || variant,
              size: child.props.size || size,
              disabled: child.props.disabled || disabled,
              className: cn(
                child.props.className,
                "relative focus:z-10",
                !isFirst && "ml-px rounded-l-none",
                !isLast && "rounded-r-none",
                variant === "outline" && !isFirst && "border-l-0"
              ),
            })
          }
          return child
        })}
      </div>
    )
  }
)

ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
