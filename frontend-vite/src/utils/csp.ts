/**
 * Content Security Policy utilities for Podplay Sanctuary
 * Handles different CSP configurations for development vs production
 */

export const CSP_POLICIES = {
  development: {
    'default-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", "blob:", "data:"],
    'style-src': ["'self'", "'unsafe-inline'", "blob:", "data:", "https:"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'font-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "ws:", "wss:", "http:", "https:"],
    'media-src': ["'self'", "data:", "https:", "blob:"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },
  
  production: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "blob:", "data:"],
    'style-src': ["'self'", "'unsafe-inline'", "https:", "blob:"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'font-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https:", "wss:"],
    'media-src': ["'self'", "data:", "https:", "blob:"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true
  }
};

/**
 * Generate CSP header string based on environment
 */
export function generateCSPHeader(environment: 'development' | 'production' = 'development'): string {
  const policy = CSP_POLICIES[environment];
  
  return Object.entries(policy)
    .map(([directive, sources]) => {
      if (typeof sources === 'boolean') {
        return sources ? directive : '';
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
}

/**
 * Apply CSP meta tag to document head
 */
export function applyCSP(environment: 'development' | 'production' = 'development'): void {
  // Remove existing CSP meta tag if any
  const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCSP) {
    existingCSP.remove();
  }
  
  // Create new CSP meta tag
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = generateCSPHeader(environment);
  
  document.head.appendChild(meta);
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
}

/**
 * Initialize CSP based on current environment
 */
export function initializeCSP(): void {
  const environment = isDevelopment() ? 'development' : 'production';
  applyCSP(environment);
  
  console.log(`🔒 CSP initialized for ${environment} environment`);
}
