# SanctuaryLayout Component

The main layout component for Podplay Sanctuary, providing navigation, service status monitoring, and theme switching. Designed specifically for neurodivergent users with accessibility in mind.

## Features
- 7-page sanctuary navigation system
- Real-time service status monitoring
- Dynamic theme switching (Sanctuary, Aurora, Gradient)
- Collapsible sidebar navigation
- Service health indicators with visual status
- Responsive design with mobile-friendly interactions

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Page content to render |
| `currentPage` | `string` | `'Home'` | Currently active page name |

## Sanctuary Pages

The layout includes navigation for these sanctuary areas:

1. **🏠 Home** - Welcome to your sanctuary
2. **🧠 Memory Palace** - Your AI-powered memory system
3. **🎨 Creation Studio** - Build and design with AI
4. **📚 Learning Hub** - Structured learning paths
5. **🌸 Sensory Garden** - Calming sensory experiences
6. **💫 Connection Center** - AI companions and chat
7. **⚙️ Control Center** - Settings and customization

## Service Monitoring

Automatically monitors these backend services:
- **Memory Manager** - Mem0 integration status
- **Theme Manager** - Theme switching service
- **Scrapybara Manager** - Web scraping capabilities
- **Mama Bear Agent** - AI assistant availability

## Usage Examples

### Basic Layout
```tsx
import { SanctuaryLayout } from '@podplay/sanctuary-components';

<SanctuaryLayout currentPage="Memory Palace">
  <div className="space-y-6">
    <h1>Welcome to Memory Palace</h1>
    <p>Your personal AI-powered memory system</p>
  </div>
</SanctuaryLayout>
```

### Home Page
```tsx
<SanctuaryLayout currentPage="Home">
  <div className="text-center space-y-8">
    <h1 className="text-4xl font-bold">Welcome to Your Sanctuary</h1>
    <p className="text-xl">A safe space designed for neurodivergent minds</p>
  </div>
</SanctuaryLayout>
```

### With Custom Content
```tsx
<SanctuaryLayout currentPage="Creation Studio">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <CreationPanel />
    <PreviewPanel />
  </div>
</SanctuaryLayout>
```

## Theme System

Three built-in themes:
- **Sanctuary**: Default calming purple/blue theme
- **Aurora**: Dynamic aurora background
- **Gradient**: Animated gradient background

Users can switch themes via the header dropdown.

## Service Status Indicators

Visual status indicators show service health:
- 🟢 **Green (Pulsing)**: Service active and healthy
- 🔴 **Red**: Service inactive or unreachable  
- 🟡 **Yellow (Spinning)**: Service loading/connecting

## Accessibility Features

- ✅ **Screen Reader**: Semantic HTML and ARIA labels
- ✅ **Keyboard Navigation**: Full keyboard accessibility
- ✅ **High Contrast**: Theme-aware contrast ratios
- ✅ **Reduced Motion**: Respects user motion preferences
- ✅ **Focus Management**: Clear focus indicators
- ✅ **Mobile Friendly**: Touch-optimized interactions

## Neurodivergent Considerations

**ADHD Support:**
- Clear visual hierarchy
- Minimal cognitive load
- Consistent navigation patterns
- Status indicators for system awareness

**Autism Support:**
- Predictable interface behavior
- Consistent interaction patterns
- Visual feedback for all actions
- Reduced sensory overwhelm

**Sensory Considerations:**
- Gentle animations
- Soothing color palette
- Optional motion reduction
- Comfortable spacing and typography

## Backend Integration

Expects these API endpoints:
- `GET /api/memory/status` - Memory Manager status
- `GET /api/theme/status` - Theme Manager status  
- `GET /api/scrape/status` - Scrapybara Manager status
- `GET /api/agent/status` - Mama Bear Agent status

Each should return: `{ "status": "active" | "inactive" }`

## Responsive Behavior

- **Desktop**: Sidebar navigation always available
- **Tablet**: Collapsible sidebar with overlay
- **Mobile**: Full-screen overlay navigation
- **Touch**: Optimized touch targets (44px minimum)

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 13+
- Edge 79+
