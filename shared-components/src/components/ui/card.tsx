import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    theme = 'system',
    ...props 
  }, ref) => {
    const cardStyles = neurodivergentMode 
      ? "rounded-lg border-2 bg-card text-card-foreground shadow-sm"
      : "rounded-lg border bg-card text-card-foreground shadow-sm"

    return (
      <div
        ref={ref}
        className={cn(
          cardStyles,
          neurodivergentMode && "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
          className
        )}
        {...props}
      />
    )
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    ...props 
  }, ref) => {
    const spacing = neurodivergentMode ? "space-y-2" : "space-y-1.5"
    const padding = neurodivergentMode ? "p-8" : "p-6"

    return (
      <div
        ref={ref}
        className={cn("flex flex-col", spacing, padding, className)}
        {...props}
      />
    )
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    ...props 
  }, ref) => {
    const titleStyles = neurodivergentMode
      ? "text-xl font-semibold leading-relaxed tracking-normal"
      : "text-2xl font-semibold leading-none tracking-tight"

    return (
      <h3
        ref={ref}
        className={cn(titleStyles, className)}
        {...props}
      />
    )
  }
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    ...props 
  }, ref) => {
    const descriptionStyles = neurodivergentMode
      ? "text-sm text-muted-foreground leading-relaxed"
      : "text-sm text-muted-foreground"

    return (
      <p
        ref={ref}
        className={cn(descriptionStyles, className)}
        {...props}
      />
    )
  }
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    ...props 
  }, ref) => {
    const padding = neurodivergentMode ? "p-8 pt-0" : "p-6 pt-0"

    return (
      <div 
        ref={ref} 
        className={cn(padding, className)} 
        {...props} 
      />
    )
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ 
    className, 
    reducedMotion = false, 
    neurodivergentMode = false, 
    ...props 
  }, ref) => {
    const padding = neurodivergentMode ? "p-8 pt-0" : "p-6 pt-0"
    const spacing = neurodivergentMode ? "gap-3" : "gap-2"

    return (
      <div
        ref={ref}
        className={cn("flex items-center", padding, spacing, className)}
        {...props}
      />
    )
  }
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
};
