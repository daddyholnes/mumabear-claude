import { ComponentMeta } from "./types";

/**
 * Component Registry for Podplay Sanctuary
 * This registry provides structured metadata for mem0.ai RAG integration
 * Enables AI-powered component discovery and code generation
 */
export const COMPONENT_REGISTRY: ComponentMeta[] = [
  {
    name: "AuroraBackground",
    description: "A mesmerizing aurora-like animated background perfect for sanctuary environments and calming interfaces. Creates flowing, ethereal light effects.",
    category: "effects",
    tags: ["background", "animation", "aurora", "calming", "immersive", "sanctuary"],
    neurodivergentFriendly: true,
    accessibility: {
      reducedMotion: true,
      sensoryFriendly: true,
      cognitiveSupport: true
    },
    props: {
      children: "ReactNode - Content to display over the aurora background",
      showRadialGradient: "boolean - Whether to show the radial gradient mask (default: true)",
      className: "string - Additional CSS classes"
    },
    examples: [
      {
        title: "Basic Aurora Background",
        description: "Simple aurora background with content overlay",
        code: `<AuroraBackground>
  <div className="text-center">
    <h1>Welcome to the Sanctuary</h1>
    <p>A calming space for focus and creativity</p>
  </div>
</AuroraBackground>`
      },
      {
        title: "Aurora with Custom Styling",
        description: "Aurora background with custom classes and no radial gradient",
        code: `<AuroraBackground 
  showRadialGradient={false}
  className="min-h-[50vh]"
>
  <YourContent />
</AuroraBackground>`
      }
    ]
  },
  {
    name: "BackgroundGradientAnimation",
    description: "Dynamic animated gradient background that creates fluid, morphing gradients perfect for immersive sanctuary environments. Includes interactive mouse-following gradient.",
    category: "effects",
    tags: ["background", "gradient", "animation", "interactive", "fluid", "immersive"],
    neurodivergentFriendly: true,
    accessibility: {
      reducedMotion: false,
      sensoryFriendly: false,
      cognitiveSupport: true
    },
    props: {
      gradientBackgroundStart: "string - Starting gradient color (default: 'rgb(108, 0, 162)')",
      gradientBackgroundEnd: "string - Ending gradient color (default: 'rgb(0, 17, 82)')",
      firstColor: "string - First animated gradient color in RGB format (default: '18, 113, 255')",
      secondColor: "string - Second animated gradient color in RGB format (default: '221, 74, 255')",
      interactive: "boolean - Enable mouse-following interactive gradient (default: true)",
      children: "ReactNode - Content to display over the background"
    },
    examples: [
      {
        title: "Interactive Gradient Background",
        description: "Full-screen gradient with mouse interaction",
        code: `<BackgroundGradientAnimation interactive={true}>
  <div className="flex items-center justify-center h-screen">
    <h1>Interactive Sanctuary</h1>
  </div>
</BackgroundGradientAnimation>`
      },
      {
        title: "Custom Color Gradient",
        description: "Gradient with sanctuary-themed colors",
        code: `<BackgroundGradientAnimation
  gradientBackgroundStart="rgb(75, 0, 130)"
  gradientBackgroundEnd="rgb(25, 25, 112)"
  firstColor="138, 43, 226"
  secondColor="147, 0, 211"
  interactive={false}
>
  <YourContent />
</BackgroundGradientAnimation>`
      }
    ]
  },
  {
    name: "SplashCursor",
    description: "Interactive fluid simulation cursor effect that creates beautiful, flowing liquid-like effects following mouse movement. Perfect for creating an immersive, calming interaction experience.",
    category: "effects",
    tags: ["cursor", "fluid", "interactive", "animation", "webgl", "immersive"],
    neurodivergentFriendly: true,
    accessibility: {
      reducedMotion: false,
      sensoryFriendly: true,
      cognitiveSupport: false
    },
    props: {
      SPLAT_RADIUS: "number - Size of cursor splash effect (default: 0.2)",
      SPLAT_FORCE: "number - Force of cursor interaction (default: 6000)",
      DENSITY_DISSIPATION: "number - How quickly density fades (default: 3.5)",
      VELOCITY_DISSIPATION: "number - How quickly velocity fades (default: 2)"
    },
    examples: [
      {
        title: "Basic Splash Cursor",
        description: "Default fluid cursor effect",
        code: `<SplashCursor />`
      },
      {
        title: "Gentle Splash Cursor",
        description: "Softer, more subtle cursor effect for sensitive users",
        code: `<SplashCursor
  SPLAT_FORCE={3000}
  DENSITY_DISSIPATION={5.0}
  VELOCITY_DISSIPATION={3}
/>`
      }
    ]
  },
  {
    name: "GlowingEffect",
    description: "Interactive glowing border effect that creates a smooth, flowing glow following mouse movement around elements. Perfect for highlighting interactive elements in a calming, accessible way.",
    category: "ui",
    tags: ["glow", "interactive", "border", "highlight", "accessibility", "focus"],
    neurodivergentFriendly: true,
    accessibility: {
      reducedMotion: true,
      sensoryFriendly: true,
      cognitiveSupport: true,
      keyboardNavigation: true
    },
    props: {
      blur: "number - Blur intensity for the glow effect",
      proximity: "number - Distance threshold for activation",
      spread: "number - Angular spread of the glow effect",
      variant: "'default' | 'white' - Color variant",
      disabled: "boolean - Whether the effect is disabled (default: true)",
      borderWidth: "number - Width of the glowing border (default: 1)"
    },
    examples: [
      {
        title: "Glowing Button",
        description: "Interactive button with glow effect",
        code: `<div className="relative">
  <GlowingEffect disabled={false} />
  <button className="px-6 py-3 bg-purple-600 rounded-lg">
    Sanctuary Button
  </button>
</div>`
      },
      {
        title: "Glowing Card",
        description: "Card component with subtle glow interaction",
        code: `<div className="relative p-6 bg-black/20 rounded-xl">
  <GlowingEffect disabled={false} blur={2} spread={15} />
  <h3>Memory Palace</h3>
  <p>Your AI-powered memory system</p>
</div>`
      }
    ]
  },
  {
    name: "SanctuaryLayout",
    description: "Main layout component for the Podplay Sanctuary providing navigation, service status monitoring, and theme switching. Designed specifically for neurodivergent users with accessibility in mind.",
    category: "sanctuary",
    tags: ["layout", "navigation", "sanctuary", "accessibility", "neurodivergent", "theme"],
    neurodivergentFriendly: true,
    accessibility: {
      reducedMotion: true,
      highContrast: true,
      screenReader: true,
      keyboardNavigation: true,
      sensoryFriendly: true,
      cognitiveSupport: true
    },
    props: {
      children: "ReactNode - Page content to render",
      currentPage: "string - Currently active page name (default: 'Home')"
    },
    examples: [
      {
        title: "Basic Sanctuary Layout",
        description: "Standard layout for sanctuary pages",
        code: `<SanctuaryLayout currentPage="Memory Palace">
  <div className="space-y-6">
    <h1>Welcome to Memory Palace</h1>
    <p>Your personal AI-powered memory system</p>
  </div>
</SanctuaryLayout>`
      },
      {
        title: "Home Page Layout",
        description: "Layout for the sanctuary home page",
        code: `<SanctuaryLayout currentPage="Home">
  <div className="text-center space-y-8">
    <h1 className="text-4xl font-bold">Welcome to Your Sanctuary</h1>
    <p className="text-xl">A safe space designed for neurodivergent minds</p>
  </div>
</SanctuaryLayout>`
      }
    ]
  }
];

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ComponentMeta["category"]): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter(component => component.category === category);
}

/**
 * Search components by tags
 */
export function searchComponentsByTags(tags: string[]): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter(component => 
    tags.some(tag => component.tags.includes(tag))
  );
}

/**
 * Get neurodivergent-friendly components
 */
export function getNeurodivergentFriendlyComponents(): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter(component => component.neurodivergentFriendly);
}

/**
 * Get components with specific accessibility features
 */
export function getAccessibleComponents(feature: keyof ComponentMeta["accessibility"]): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter(component => 
    component.accessibility?.[feature] === true
  );
}
