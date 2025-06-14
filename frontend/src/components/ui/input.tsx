import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-sanctuary-border bg-sanctuary-bg px-3 py-2 text-sm text-sanctuary-text ring-offset-sanctuary-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sanctuary-text/50 focus:outline-none focus:ring-2 focus:ring-sanctuary-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
