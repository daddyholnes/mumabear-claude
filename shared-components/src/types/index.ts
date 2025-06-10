/**
 * Component metadata for documentation and discovery
 */
export interface ComponentMeta {
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  props?: Record<string, any>;
  examples?: ComponentExample[];
  accessibility?: AccessibilityFeatures;
  neurodivergentFriendly?: boolean;
}

/**
 * Component categories for organization
 */
export type ComponentCategory = 
  | "effects" 
  | "ui" 
  | "sanctuary" 
  | "layout" 
  | "navigation" 
  | "interaction"
  | "accessibility";

/**
 * Component usage examples
 */
export interface ComponentExample {
  title: string;
  description: string;
  code: string;
  preview?: string;
}

/**
 * Accessibility features for neurodivergent users
 */
export interface AccessibilityFeatures {
  reducedMotion?: boolean;
  highContrast?: boolean;
  screenReader?: boolean;
  keyboardNavigation?: boolean;
  sensoryFriendly?: boolean;
  cognitiveSupport?: boolean;
}

/**
 * Service status for sanctuary components
 */
export interface ServiceStatus {
  name: string;
  status: 'active' | 'inactive' | 'loading';
  endpoint: string;
  description?: string;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  effects?: {
    aurora?: boolean;
    gradient?: boolean;
    glow?: boolean;
  };
}
