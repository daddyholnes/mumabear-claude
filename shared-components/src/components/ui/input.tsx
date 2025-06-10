import { cn } from "../../utils/cn";
import * as React from "react";

interface InputProps extends React.ComponentProps<"input"> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    reducedMotion = false,
    neurodivergentMode = false,
    theme = 'system',
    ...props
  }, ref) => {
    // Enhanced styles for neurodivergent users
    const baseStyles = neurodivergentMode
      ? "flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base"
      : "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"

    const focusStyles = neurodivergentMode
      ? "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-primary/25"
      : "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"

    const transitionStyles = reducedMotion 
      ? "" 
      : "transition-shadow"

    return (
      <input
        type={type}
        className={cn(
          baseStyles,
          "text-foreground shadow-sm shadow-black/5",
          transitionStyles,
          "placeholder:text-muted-foreground/70",
          focusStyles,
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Enhanced accessibility for file inputs
          type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          type === "file" &&
            "p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",
          // Neurodivergent-friendly focus indicators
          neurodivergentMode && "focus:bg-accent/10",
          className,
        )}
        ref={ref}
        aria-invalid={props['aria-invalid']}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
