# AuroraBackground Component

A mesmerizing aurora-like animated background perfect for sanctuary environments and calming interfaces.

## Features
- Ethereal flowing light effects
- Customizable gradient masks
- Neurodivergent-friendly with reduced motion support
- Smooth CSS animations
- Dark/light mode compatible

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display over the aurora background |
| `showRadialGradient` | `boolean` | `true` | Whether to show the radial gradient mask |
| `className` | `string` | - | Additional CSS classes |

## Usage Examples

### Basic Usage
```tsx
import { AuroraBackground } from '@podplay/sanctuary-components';

<AuroraBackground>
  <div className="text-center">
    <h1>Welcome to the Sanctuary</h1>
    <p>A calming space for focus and creativity</p>
  </div>
</AuroraBackground>
```

### Without Radial Gradient
```tsx
<AuroraBackground showRadialGradient={false}>
  <YourContent />
</AuroraBackground>
```

### With Custom Styling
```tsx
<AuroraBackground className="min-h-[50vh] rounded-lg">
  <div className="p-8">
    <h2>Custom Height Aurora</h2>
  </div>
</AuroraBackground>
```

## Accessibility

- ✅ Reduced motion support via CSS `prefers-reduced-motion`
- ✅ Sensory-friendly default settings
- ✅ Compatible with screen readers
- ✅ High contrast mode support

## Design Considerations

This component is specifically designed for neurodivergent users:
- **ADHD**: Gentle, non-distracting animation
- **Autism**: Predictable, consistent visual patterns
- **Sensory Processing**: Soft, flowing movements without harsh transitions
- **Anxiety**: Calming color palette and smooth motion

## CSS Variables

The component uses CSS custom properties for theming:
- `--white`: Light mode colors
- `--black`: Dark mode colors
- `--blue-500`, `--indigo-300`, etc.: Aurora color palette

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Gracefully degrades to static gradient in older browsers.
