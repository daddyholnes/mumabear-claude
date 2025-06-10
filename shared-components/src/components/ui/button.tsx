import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'calm' | 'sanctuary';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
  reducedMotion?: boolean;
  neurodivergentMode?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false, 
    reducedMotion = false,
    neurodivergentMode = false,
    ...props 
  }, ref) => {
    const baseStyles = neurodivergentMode 
      ? 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]'
      : reducedMotion
      ? 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
      : 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      calm: 'bg-blue-50 text-blue-900 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-100 dark:hover:bg-blue-900',
      sanctuary: 'bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 hover:from-green-200 hover:to-blue-200 dark:from-green-900 dark:to-blue-900 dark:text-white'
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      xl: 'h-12 rounded-md px-10 text-base',
      icon: 'h-10 w-10'
    };

    const classes = clsx(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      return React.cloneElement(props.children as React.ReactElement, {
        className: classes,
        ref,
        ...props
      });
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
