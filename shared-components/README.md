# Podplay Sanctuary Component Library

A comprehensive, neurodivergent-friendly component library designed for the Podplay Sanctuary - an AI-powered development platform built with accessibility and sensory considerations in mind.

## 🎉 Integration Complete

**All components from `new-features/new-components/` have been successfully migrated and integrated!**

✅ 9 new components with TypeScript interfaces  
✅ Complete accessibility pattern implementation  
✅ Scout UI variants (2, 3, 4) with AI-powered workspaces  
✅ Chat system with auto-scroll functionality  
✅ PodplaySanctuaryHub fully updated and integrated  
✅ Comprehensive documentation and examples  

## 🌟 Features

- **Neurodivergent-Friendly Design**: All components are designed with ADHD, autism, and sensory sensitivities in mind
- **Accessibility First**: WCAG compliant with reduced motion options and high contrast support
- **Calming Aesthetics**: Soothing animations and gentle visual effects
- **AI-Powered Discovery**: Integrated with mem0.ai for intelligent component suggestions
- **TypeScript Support**: Full type safety and IntelliSense support
- **Tailwind CSS**: Utility-first styling with custom sanctuary themes

## 📦 Installation

```bash
npm install @podplay/sanctuary-components
```

## 🎨 Component Categories

### Effects Components
- **AuroraBackground**: Mesmerizing aurora-like animated backgrounds
- **BackgroundGradientAnimation**: Dynamic fluid gradient animations  
- **SplashCursor**: Interactive fluid simulation cursor effects
- **ImmersiveLoader**: Magical loading with Mama Bear animations
- **LivingSanctuaryBackground**: Multi-layer interactive sanctuary environments

### UI Components
- **GlowingEffect**: Interactive glowing border effects
- **MessageLoading**: Accessible loading animation for chat interfaces
- **ScrollArea**: Enhanced scrollable areas with neurodivergent-friendly features
- **ResizablePanel**: Panel system with enhanced handles and keyboard navigation
- **ChatInput**: Enhanced textarea with accessibility features
- **ChatMessageList**: Auto-scrolling message container
- **ExpandableChat**: Floating chat interface with accessibility support
- **ChatBubble**: Message bubbles with clear visual hierarchy
- **Button**: Accessible button with multiple variants
- **Input**: Enhanced input fields with neurodivergent support
- **Card**: Flexible container components

### Workspace Components
- **ScoutUI2**: AI-powered interface generation workspace
- **ScoutUI3**: Multi-platform social content generation studio  
- **ScoutUI4**: Advanced project management workspace with AI tools

### Sanctuary Components
- **SanctuaryLayout**: Main layout with navigation and service monitoring
- **PodplaySanctuaryHub**: Complete component showcase and testing interface

### Hooks
- **useAutoScroll**: Auto-scroll functionality for chat interfaces

## 🚀 Quick Start

```tsx
import { SanctuaryLayout, AuroraBackground, GlowingEffect } from '@podplay/sanctuary-components';

function App() {
  return (
    <SanctuaryLayout currentPage="Home">
      <AuroraBackground>
        <div className="relative">
          <GlowingEffect disabled={false} />
          <h1>Welcome to Your Sanctuary</h1>
        </div>
      </AuroraBackground>
    </SanctuaryLayout>
  );
}
```

## 🧠 AI-Powered Component Discovery

This library integrates with mem0.ai to provide intelligent component suggestions:

```tsx
import { 
  COMPONENT_REGISTRY, 
  searchComponentsByTags,
  getNeurodivergentFriendlyComponents 
} from '@podplay/sanctuary-components';

// Find calming components
const calmingComponents = searchComponentsByTags(['calming', 'sanctuary']);

// Get all neurodivergent-friendly components
const accessibleComponents = getNeurodivergentFriendlyComponents();
```

## ♿ Accessibility Features

Every component includes:
- Reduced motion options for vestibular sensitivities
- High contrast mode support
- Screen reader compatibility
- Keyboard navigation support
- Sensory-friendly defaults
- Cognitive load reduction features

## 🎯 Neurodivergent Considerations

- **ADHD**: Reduced visual clutter, clear focus indicators
- **Autism**: Predictable interactions, sensory-friendly defaults
- **Sensory Processing**: Gentle animations, optional effects
- **Cognitive Load**: Clear labeling, consistent patterns

## 🌈 Theming

Built-in sanctuary themes:
- **Sanctuary**: Calming purples and blues
- **Aurora**: Northern lights inspired
- **Gradient**: Flowing color transitions

## 📱 Responsive Design

All components are mobile-first and work seamlessly across devices with touch-friendly interactions.

## 🤝 Contributing

This library is designed for and by the neurodivergent community. Contributions that improve accessibility and user experience are always welcome.

## 📄 License

MIT License - Built with 💜 for the sanctuary community.
