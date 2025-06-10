# 🏗️ Detailed Design 1: Core Foundation & Theme System

**Project:** Podplay Sanctuary Enhanced AI Model Friends Chat  
**Scope:** Core Foundation, Layout, Navigation, Theme System, Settings  
**Backend Port:** 5001 (Flask backend already running)  
**Frontend Port:** 3000 (Vite React)  

---

## 🎯 Backend Integration Specifications

### **API Base Configuration**
```typescript
const API_CONFIG = {
  BASE_URL: 'http://localhost:5001',
  WEBSOCKET_URL: 'ws://localhost:5001',
  ENDPOINTS: {
    HEALTH: '/api/health',
    THEMES: '/api/themes',
    USER_PREFERENCES: '/api/user/preferences',
    SYSTEM_STATUS: '/api/system/status'
  }
};
```

### **Environment Variables Integration**
```typescript
// Frontend .env integration
VITE_API_BASE_URL=http://localhost:5001
VITE_WS_BASE_URL=ws://localhost:5001
VITE_THEME_STORAGE_KEY=sanctuary_theme_prefs
VITE_ACCESSIBILITY_KEY=sanctuary_accessibility
```

---

## 🎨 Enhanced Theme System Design

### **Theme Variants (5 Total)**
```typescript
interface ThemeVariant {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  backgrounds: BackgroundOptions;
  animations: AnimationSettings;
}

const THEME_VARIANTS = {
  sanctuary: {
    id: 'sanctuary',
    name: 'Sanctuary Forest',
    description: 'Calming forest greens with nature-inspired gradients',
    colors: {
      primary: 'linear-gradient(135deg, #2D5A3D 0%, #4A7C59 100%)',
      secondary: 'linear-gradient(135deg, #5D8A6B 0%, #7BA185 100%)',
      accent: 'linear-gradient(135deg, #8FBC8F 0%, #98FB98 100%)',
      background: '#F8FDF9',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#2C3E2F'
    }
  },
  
  daytime: {
    id: 'daytime',
    name: 'Bright Daytime',
    description: 'Energizing daylight with sky blues and sunshine yellows',
    colors: {
      primary: 'linear-gradient(135deg, #87CEEB 0%, #4FC3F7 100%)',
      secondary: 'linear-gradient(135deg, #FFE082 0%, #FFF176 100%)',
      accent: 'linear-gradient(135deg, #81C784 0%, #AED581 100%)',
      background: '#F0F8FF',
      surface: 'rgba(255, 255, 255, 0.98)',
      text: '#1565C0'
    }
  },
  
  night: {
    id: 'night',
    name: 'Night Mode',
    description: 'Deep night blues with silver accents for low-light comfort',
    colors: {
      primary: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)',
      secondary: 'linear-gradient(135deg, #415A77 0%, #778DA9 100%)',
      accent: 'linear-gradient(135deg, #B0C4DE 0%, #E0E6ED 100%)',
      background: '#0A0E27',
      surface: 'rgba(15, 25, 45, 0.95)',
      text: '#E0E6ED'
    }
  },
  
  purple_haze: {
    id: 'purple_haze',
    name: 'Purple Haze',
    description: 'Mystical purple gradients with cosmic energy',
    colors: {
      primary: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%)',
      secondary: 'linear-gradient(135deg, #7B1FA2 0%, #8E24AA 100%)',
      accent: 'linear-gradient(135deg, #CE93D8 0%, #F8BBD9 100%)',
      background: 'linear-gradient(135deg, #1A0033 0%, #2D1B47 100%)',
      surface: 'rgba(74, 20, 140, 0.15)',
      text: '#E1BEE7'
    }
  },
  
  cosmic_purple: {
    id: 'cosmic_purple',
    name: 'Cosmic Purple',
    description: 'Deep space purples with nebula-inspired gradients',
    colors: {
      primary: 'linear-gradient(135deg, #1A0033 0%, #330066 100%)',
      secondary: 'linear-gradient(135deg, #4B0082 0%, #663399 100%)',
      accent: 'linear-gradient(135deg, #9932CC 0%, #DA70D6 100%)',
      background: 'linear-gradient(135deg, #0A0015 0%, #1A0033 50%, #2D1B47 100%)',
      surface: 'rgba(75, 0, 130, 0.2)',
      text: '#DDA0DD'
    }
  }
};
```

### **Background Options System**
```typescript
interface BackgroundOption {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'pattern' | 'animated';
  value: string;
  preview: string;
}

const BACKGROUND_OPTIONS = {
  sanctuary: [
    {
      id: 'forest_gradient',
      name: 'Forest Gradient',
      type: 'gradient',
      value: 'linear-gradient(135deg, #F8FDF9 0%, #E8F5E8 50%, #D4F1D4 100%)'
    },
    {
      id: 'nature_pattern',
      name: 'Subtle Nature Pattern',
      type: 'pattern',
      value: 'url("data:image/svg+xml,%3Csvg...leaves pattern...")'
    }
  ],
  daytime: [
    {
      id: 'sky_gradient',
      name: 'Sky Gradient',
      type: 'gradient',
      value: 'linear-gradient(to bottom, #87CEEB 0%, #F0F8FF 50%, #FFF8DC 100%)'
    },
    {
      id: 'cloud_pattern',
      name: 'Floating Clouds',
      type: 'animated',
      value: 'animated-clouds-background'
    }
  ],
  night: [
    {
      id: 'starfield',
      name: 'Starfield',
      type: 'animated',
      value: 'animated-stars-background'
    },
    {
      id: 'deep_night',
      name: 'Deep Night',
      type: 'gradient',
      value: 'linear-gradient(to bottom, #0A0E27 0%, #1B263B 50%, #0D1B2A 100%)'
    }
  ],
  purple_haze: [
    {
      id: 'purple_mist',
      name: 'Purple Mist',
      type: 'animated',
      value: 'animated-purple-mist'
    },
    {
      id: 'haze_gradient',
      name: 'Haze Gradient',
      type: 'gradient',
      value: 'linear-gradient(45deg, #1A0033 0%, #4A148C 25%, #7B1FA2 50%, #4A148C 75%, #1A0033 100%)'
    }
  ],
  cosmic_purple: [
    {
      id: 'nebula',
      name: 'Cosmic Nebula',
      type: 'animated',
      value: 'animated-nebula-background'
    },
    {
      id: 'deep_space',
      name: 'Deep Space',
      type: 'gradient',
      value: 'radial-gradient(ellipse at center, #330066 0%, #1A0033 50%, #0A0015 100%)'
    }
  ]
};
```

---

## 🎨 Experience 1: Theme Customization Page

### **Component Structure**
```typescript
// /frontend/src/experiences/ThemeCustomization/index.tsx
interface ThemeCustomizationProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  userPreferences: ThemePreferences;
  onPreferenceUpdate: (prefs: Partial<ThemePreferences>) => void;
}
```

### **User Flow**
1. **Theme Selection Grid** - Visual preview cards for each theme
2. **Background Customization** - Choose from gradient/pattern/animated options
3. **Accessibility Controls** - High contrast, reduced motion, font size
4. **Live Preview** - Real-time preview of changes
5. **Save & Apply** - Persist preferences and apply globally

### **UI Components**

#### **ThemePreviewCard**
```typescript
interface ThemePreviewCardProps {
  theme: ThemeVariant;
  isSelected: boolean;
  onSelect: () => void;
  showLivePreview: boolean;
}

// Features:
// - Animated hover effects showing theme colors
// - Live preview of navigation and cards in theme
// - Selection indicator with smooth transitions
// - Theme name and description overlay
```

#### **BackgroundSelector**
```typescript
interface BackgroundSelectorProps {
  themeId: string;
  backgrounds: BackgroundOption[];
  selectedBackground: string;
  onBackgroundChange: (backgroundId: string) => void;
}

// Features:
// - Grid of background previews
// - Animated background samples
// - Custom gradient creator
// - Upload custom background option
```

#### **AccessibilityPanel**
```typescript
interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onSettingChange: (key: string, value: any) => void;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
}
```

#### **LivePreviewPanel**
```typescript
interface LivePreviewPanelProps {
  previewTheme: ThemeVariant;
  previewBackground: BackgroundOption;
  previewComponents: ComponentPreview[];
}

// Features:
// - Mini versions of key UI components
// - Navigation bar preview
// - Chat message previews
// - Button and form element samples
// - Real-time updates as user changes settings
```

---

## 🏗️ Experience 2: Enhanced Application Layout

### **Main Layout Component**
```typescript
// /frontend/src/components/layout/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  currentTheme: ThemeVariant;
  systemStatus: SystemStatus;
}
```

### **Collapsible Sidebar Design**
```typescript
// /frontend/src/components/layout/Sidebar.tsx
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPath: string;
  navigationItems: NavigationItem[];
  userProfile: UserProfile;
  systemHealth: SystemHealth;
}

// Features:
// - Smooth collapse/expand animations (300ms ease-in-out)
// - Hover tooltips when collapsed
// - Category groupings with dividers
// - Active item highlighting with theme colors
// - User profile section at bottom
// - System status indicators
// - Search functionality for large navigation
```

### **Navigation Structure**
```typescript
const NAVIGATION_STRUCTURE = {
  core: [
    {
      id: 'home',
      label: 'Sanctuary Home',
      icon: HomeIcon,
      path: '/',
      description: 'Main dashboard and overview'
    },
    {
      id: 'chat',
      label: 'Main Chat',
      icon: ChatBubbleIcon,
      path: '/chat',
      description: 'Primary AI conversation interface'
    }
  ],
  ai_systems: [
    {
      id: 'scout',
      label: 'Enhanced Scout',
      icon: SearchIcon,
      path: '/scout',
      badge: { text: 'v2.5', type: 'success' },
      description: 'Multi-model AI orchestration'
    },
    {
      id: 'agents',
      label: 'Agent Workbench',
      icon: RobotIcon,
      path: '/agents',
      isNew: true,
      description: 'Create and manage AI agents'
    }
  ],
  customization: [
    {
      id: 'themes',
      label: 'Theme Studio',
      icon: PaletteIcon,
      path: '/themes',
      isNew: true,
      description: 'Customize appearance and themes'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      path: '/settings',
      description: 'Application preferences'
    }
  ]
};
```

### **Header Component**
```typescript
// /frontend/src/components/layout/Header.tsx
interface HeaderProps {
  currentExperience: string;
  breadcrumbs: Breadcrumb[];
  systemStatus: SystemStatus;
  userProfile: UserProfile;
  onThemeToggle: () => void;
  onNotificationClick: () => void;
}

// Features:
// - Dynamic breadcrumb navigation
// - System health indicator (green/yellow/red dot)
// - Quick theme switcher dropdown
// - Notification center icon with badge
// - User avatar with dropdown menu
// - Search functionality
```

---

## ⚙️ Experience 3: Enhanced Settings Page

### **Settings Page Structure**
```typescript
// /frontend/src/experiences/Settings/index.tsx
interface SettingsPageProps {
  userPreferences: UserPreferences;
  systemConfiguration: SystemConfiguration;
  onPreferenceUpdate: (category: string, key: string, value: any) => void;
  onSystemUpdate: (key: string, value: any) => void;
}
```

### **Settings Categories**
```typescript
const SETTINGS_CATEGORIES = {
  appearance: {
    id: 'appearance',
    label: 'Appearance & Themes',
    icon: PaletteIcon,
    component: AppearanceSettings
  },
  accessibility: {
    id: 'accessibility',
    label: 'Accessibility',
    icon: AccessibilityIcon,
    component: AccessibilitySettings
  },
  ai_preferences: {
    id: 'ai_preferences',
    label: 'AI Model Preferences',
    icon: BrainIcon,
    component: AIPreferencesSettings
  },
  performance: {
    id: 'performance',
    label: 'Performance & Optimization',
    icon: SpeedIcon,
    component: PerformanceSettings
  },
  privacy: {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: ShieldIcon,
    component: PrivacySettings
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    icon: BellIcon,
    component: NotificationSettings
  },
  advanced: {
    id: 'advanced',
    label: 'Advanced Settings',
    icon: TerminalIcon,
    component: AdvancedSettings
  }
};
```

### **Appearance Settings Component**
```typescript
interface AppearanceSettingsProps {
  currentTheme: string;
  customBackgrounds: BackgroundOption[];
  animationPreferences: AnimationPreferences;
  onThemeChange: (themeId: string) => void;
  onBackgroundChange: (backgroundId: string) => void;
  onAnimationUpdate: (prefs: AnimationPreferences) => void;
}

// Features:
// - Theme selection with live preview
// - Custom background upload and management
// - Animation speed controls (none, slow, normal, fast)
// - Color customization for accessibility
// - Font family and size preferences
// - Layout density options (compact, comfortable, spacious)
```

### **AI Preferences Settings**
```typescript
interface AIPreferencesSettingsProps {
  modelPreferences: ModelPreferences;
  conversationSettings: ConversationSettings;
  memorySettings: MemorySettings;
  onModelPreferenceUpdate: (prefs: ModelPreferences) => void;
  onConversationUpdate: (settings: ConversationSettings) => void;
  onMemoryUpdate: (settings: MemorySettings) => void;
}

interface ModelPreferences {
  defaultModel: string;
  fallbackModel: string;
  responseStyle: 'concise' | 'detailed' | 'conversational' | 'technical';
  creativityLevel: number; // 0.0 - 1.0
  maxTokens: number;
  temperature: number;
}

// Features:
// - Default model selection with capabilities overview
// - Response style preferences with examples
// - Creativity and temperature sliders with explanations
// - Memory retention preferences
// - Context window management
// - Auto-optimization toggle
```

---

## 🏠 Experience 4: Sanctuary Home Dashboard

### **Dashboard Structure**
```typescript
// /frontend/src/experiences/SanctuaryHome/index.tsx
interface SanctuaryHomeProps {
  user: User;
  systemMetrics: SystemMetrics;
  recentActivity: ActivityItem[];
  quickActions: QuickAction[];
  weatherData: WeatherData; // For theme mood matching
  timeOfDay: TimeOfDay;
}
```

### **Dashboard Widgets**

#### **Welcome Widget**
```typescript
interface WelcomeWidgetProps {
  user: User;
  timeOfDay: TimeOfDay;
  weatherMood: string;
  mamaBearGreeting: string;
}

// Features:
// - Dynamic greeting based on time and weather
// - Mama Bear avatar with contextual mood
// - Personalized message based on recent activity
// - Quick stats (conversations today, agents created, etc.)
```

#### **System Health Widget**
```typescript
interface SystemHealthWidgetProps {
  overallHealth: HealthStatus;
  serviceStatuses: ServiceStatus[];
  recentAlerts: Alert[];
  onHealthDetailClick: () => void;
}

// Features:
// - Overall system health indicator
// - Individual service status (Scout, Router, Agents, etc.)
// - Recent alerts and warnings
// - Quick actions for common issues
// - Performance metrics summary
```

#### **Quick Actions Widget**
```typescript
interface QuickActionsWidgetProps {
  actions: QuickAction[];
  recentlyUsed: string[];
  onActionClick: (actionId: string) => void;
}

const QUICK_ACTIONS = [
  {
    id: 'new_chat',
    label: 'Start New Chat',
    icon: ChatIcon,
    path: '/chat',
    shortcut: 'Ctrl+N'
  },
  {
    id: 'create_agent',
    label: 'Create Agent',
    icon: RobotIcon,
    path: '/agents/create',
    shortcut: 'Ctrl+A'
  },
  {
    id: 'analyze_task',
    label: 'Analyze Task',
    icon: AnalyzeIcon,
    path: '/router/analyze',
    shortcut: 'Ctrl+T'
  },
  {
    id: 'customize_theme',
    label: 'Customize Theme',
    icon: PaletteIcon,
    path: '/themes',
    shortcut: 'Ctrl+Shift+T'
  }
];
```

#### **Recent Activity Widget**
```typescript
interface RecentActivityWidgetProps {
  activities: ActivityItem[];
  showAvatars: boolean;
  onActivityClick: (activityId: string) => void;
  onViewAllClick: () => void;
}

interface ActivityItem {
  id: string;
  type: 'chat' | 'agent_created' | 'task_routed' | 'theme_changed' | 'system_event';
  title: string;
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
  avatar?: string;
}
```

---

## 🔧 Technical Implementation Specifications

### **State Management Structure**
```typescript
// Global state using Redux Toolkit
interface RootState {
  theme: ThemeState;
  layout: LayoutState;
  settings: SettingsState;
  user: UserState;
  system: SystemState;
}

interface ThemeState {
  currentTheme: string;
  customSettings: ThemeCustomSettings;
  backgroundSettings: BackgroundSettings;
  accessibilitySettings: AccessibilitySettings;
  previewMode: boolean;
}

interface LayoutState {
  sidebarCollapsed: boolean;
  currentExperience: string;
  breadcrumbs: Breadcrumb[];
  notifications: Notification[];
}
```

### **API Integration Patterns**
```typescript
// Theme API endpoints
const themeAPI = createApi({
  reducerPath: 'themeAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/themes/'
  }),
  tagTypes: ['Theme', 'UserPreferences'],
  endpoints: (builder) => ({
    getThemes: builder.query<ThemeVariant[], void>({
      query: () => 'list',
      providesTags: ['Theme']
    }),
    getUserPreferences: builder.query<UserPreferences, string>({
      query: (userId) => `preferences/${userId}`,
      providesTags: ['UserPreferences']
    }),
    updateUserPreferences: builder.mutation<void, { userId: string; preferences: Partial<UserPreferences> }>({
      query: ({ userId, preferences }) => ({
        url: `preferences/${userId}`,
        method: 'PUT',
        body: preferences
      }),
      invalidatesTags: ['UserPreferences']
    }),
    uploadCustomBackground: builder.mutation<BackgroundOption, FormData>({
      query: (formData) => ({
        url: 'backgrounds/upload',
        method: 'POST',
        body: formData
      })
    })
  })
});
```

### **Theme Context Provider**
```typescript
// Theme context for global theme management
interface ThemeContextValue {
  currentTheme: ThemeVariant;
  setTheme: (themeId: string) => void;
  customSettings: ThemeCustomSettings;
  updateCustomSettings: (settings: Partial<ThemeCustomSettings>) => void;
  accessibilitySettings: AccessibilitySettings;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  previewTheme: (themeId: string) => void;
  exitPreview: () => void;
  isPreviewMode: boolean;
}

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(THEME_VARIANTS.sanctuary);
  const [customSettings, setCustomSettings] = useState<ThemeCustomSettings>({});
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    colorBlindSupport: 'none',
    keyboardNavigation: true,
    screenReaderOptimized: false
  });
  
  // Implementation details...
};
```

---

## 📱 Responsive Design Specifications

### **Breakpoint System**
```css
:root {
  --breakpoint-xs: 320px;   /* Mobile portrait */
  --breakpoint-sm: 576px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet portrait */
  --breakpoint-lg: 992px;   /* Tablet landscape */
  --breakpoint-xl: 1200px;  /* Desktop */
  --breakpoint-xxl: 1400px; /* Large desktop */
}
```

### **Layout Adaptations**
```typescript
// Mobile adaptations for each experience
const RESPONSIVE_LAYOUTS = {
  sidebar: {
    xs: 'overlay',      // Overlay on mobile
    sm: 'overlay',      // Overlay on small screens
    md: 'collapsed',    // Collapsed on tablet
    lg: 'expanded',     // Expanded on desktop
    xl: 'expanded'      // Expanded on large desktop
  },
  
  dashboard_widgets: {
    xs: 'single_column',    // Stack vertically
    sm: 'single_column',    // Stack vertically
    md: 'two_column',       // 2 columns
    lg: 'three_column',     // 3 columns
    xl: 'four_column'       // 4 columns
  },
  
  theme_preview: {
    xs: 'carousel',         // Swipeable carousel
    sm: 'carousel',         // Swipeable carousel
    md: 'grid_2x2',         // 2x2 grid
    lg: 'grid_3x2',         // 3x2 grid
    xl: 'grid_5x1'          // 5x1 grid
  }
};
```

---

## 🚀 File Structure

```
frontend/src/
├── experiences/
│   ├── SanctuaryHome/
│   │   ├── index.tsx                    # Main dashboard
│   │   ├── components/
│   │   │   ├── WelcomeWidget.tsx        # Greeting and overview
│   │   │   ├── SystemHealthWidget.tsx   # System status
│   │   │   ├── QuickActionsWidget.tsx   # Action shortcuts
│   │   │   ├── RecentActivityWidget.tsx # Activity feed
│   │   │   └── WeatherMoodWidget.tsx    # Weather-based mood
│   │   └── hooks/
│   │       ├── useDashboardData.tsx     # Dashboard data fetching
│   │       └── useSystemHealth.tsx      # Health monitoring
│   │
│   ├── ThemeCustomization/
│   │   ├── index.tsx                    # Main theme page
│   │   ├── components/
│   │   │   ├── ThemePreviewCard.tsx     # Theme selection cards
│   │   │   ├── BackgroundSelector.tsx   # Background options
│   │   │   ├── AccessibilityPanel.tsx   # Accessibility controls
│   │   │   ├── LivePreviewPanel.tsx     # Real-time preview
│   │   │   └── CustomGradientCreator.tsx # Custom gradient tool
│   │   └── hooks/
│   │       ├── useThemePreview.tsx      # Preview management
│   │       └── useCustomBackgrounds.tsx # Background handling
│   │
│   └── Settings/
│       ├── index.tsx                    # Main settings page
│       ├── components/
│       │   ├── SettingsCategory.tsx     # Category container
│       │   ├── AppearanceSettings.tsx   # Appearance preferences
│       │   ├── AccessibilitySettings.tsx # Accessibility options
│       │   ├── AIPreferencesSettings.tsx # AI model preferences
│       │   ├── PerformanceSettings.tsx  # Performance options
│       │   ├── PrivacySettings.tsx      # Privacy controls
│       │   └── AdvancedSettings.tsx     # Advanced options
│       └── hooks/
│           ├── useSettings.tsx          # Settings management
│           └── usePreferences.tsx       # User preferences
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx               # Main app container
│   │   ├── Sidebar.tsx                 # Collapsible navigation
│   │   ├── Header.tsx                  # Top navigation bar
│   │   └── Footer.tsx                  # Footer component
│   │
│   ├── ui/
│   │   ├── ThemeProvider.tsx           # Global theme context
│   │   ├── Button.tsx                  # Enhanced button system
│   │   ├── Card.tsx                    # Card components
│   │   ├── Badge.tsx                   # Status badges
│   │   ├── Switch.tsx                  # Toggle switches
│   │   ├── Slider.tsx                  # Range sliders
│   │   └── Modal.tsx                   # Modal dialogs
│   │
│   └── common/
│       ├── LoadingSpinner.tsx          # Loading states
│       ├── ErrorBoundary.tsx           # Error handling
│       ├── MamaBearAvatar.tsx          # Avatar component
│       └── StatusIndicator.tsx         # Health indicators
│
├── hooks/
│   ├── useTheme.tsx                    # Theme management
│   ├── useLocalStorage.tsx             # Local storage
│   ├── useResponsive.tsx               # Responsive utilities
│   └── useAccessibility.tsx            # Accessibility helpers
│
├── store/
│   ├── index.ts                        # Store configuration
│   ├── slices/
│   │   ├── themeSlice.ts              # Theme state
│   │   ├── layoutSlice.ts             # Layout state
│   │   ├── settingsSlice.ts           # Settings state
│   │   └── userSlice.ts               # User state
│   └── api/
│       ├── themeAPI.ts                # Theme endpoints
│       ├── settingsAPI.ts             # Settings endpoints
│       └── systemAPI.ts               # System endpoints
│
├── styles/
│   ├── themes/
│   │   ├── sanctuary.css              # Sanctuary theme
│   │   ├── daytime.css                # Daytime theme
│   │   ├── night.css                  # Night theme
│   │   ├── purple-haze.css            # Purple haze theme
│   │   └── cosmic-purple.css          # Cosmic purple theme
│   ├── animations/
│   │   ├── background-animations.css  # Background effects
│   │   ├── transition-animations.css  # Transitions
│   │   └── accessibility-animations.css # Accessible animations
│   └── globals.css                    # Global styles
│
└── types/
    ├── theme.types.ts                 # Theme interfaces
    ├── layout.types.ts                # Layout interfaces
    ├── settings.types.ts              # Settings interfaces
    └── api.types.ts                   # API interfaces
```

---

## ✅ Implementation Checklist

### **Phase 1: Theme System Foundation**
- [ ] Set up theme provider and context
- [ ] Implement 5 theme variants with CSS variables
- [ ] Create theme preview system
- [ ] Build background selector with animated options
- [ ] Add accessibility controls

### **Phase 2: Layout & Navigation**
- [ ] Build collapsible sidebar with smooth animations
- [ ] Implement responsive navigation system
- [ ] Create header with breadcrumbs and status indicators
- [ ] Add search functionality
- [ ] Integrate theme switcher

### **Phase 3: Settings Experience**
- [ ] Build categorized settings page
- [ ] Implement all settings components
- [ ] Add live preview for appearance changes
- [ ] Create preference persistence system
- [ ] Add import/export functionality

### **Phase 4: Dashboard Experience**
- [ ] Build widget-based dashboard
- [ ] Implement system health monitoring
- [ ] Create activity feed with real-time updates
- [ ] Add quick actions with keyboard shortcuts
- [ ] Integrate weather-mood matching

---

This detailed design provides complete specifications for implementing the core foundation with the enhanced theme system you requested. The next design document will cover the AI experiences (Agent Workbench, Execution Router, Enhanced Scout).
