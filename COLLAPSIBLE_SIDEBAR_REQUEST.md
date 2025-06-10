# 🧭 Collapsible Sidebar Navigation System - Build Request

**Project:** Podplay Sanctuary Navigation System  
**Date:** June 10, 2025  
**Priority:** HIGH - Foundation Component  
**Complexity:** Medium  

---

## 🎯 Overview

Build a sophisticated collapsible sidebar navigation that adapts between **full text mode** and **icon-only mode**, providing seamless navigation across all Podplay Sanctuary experiences.

---

## 📋 Core Requirements

### **Navigation States**
```typescript
interface SidebarState {
  expanded: boolean     // true = words + icons, false = icons only
  width: {
    expanded: "280px"
    collapsed: "80px"
  }
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
}
```

### **Navigation Items**
```typescript
interface NavigationItem {
  id: string
  icon: string          // Unicode emoji or icon
  label: string         // Full text (shown when expanded)
  route: string         // React Router path
  badge?: number        // Optional notification count
  isActive?: boolean    // Current page indicator
  subItems?: NavigationItem[]  // Optional nested items
}

const navigationItems: NavigationItem[] = [
  { id: "home", icon: "🏠", label: "Sanctuary Home", route: "/", },
  { id: "chat", icon: "💬", label: "Main Chat", route: "/chat" },
  { id: "multimodal", icon: "🎨", label: "MultiModal Chat", route: "/multimodal" },
  { id: "scout", icon: "🎯", label: "Scout Workflow", route: "/scout" },
  { id: "enhanced-scout", icon: "⭐", label: "Enhanced Scout", route: "/enhanced-scout" },
  { id: "computer-use", icon: "💻", label: "Computer Use", route: "/computer-use" },
  { id: "dev-workspaces", icon: "🛠️", label: "Dev Workspaces", route: "/dev-workspaces" },
  { id: "live-api", icon: "⚡", label: "Live API Studio", route: "/live-api" },
  { id: "mcp-marketplace", icon: "🏪", label: "MCP Marketplace", route: "/mcp-marketplace" },
  { id: "mini-apps", icon: "📱", label: "Mini Apps", route: "/mini-apps" },
  { id: "mini-apps-hub", icon: "🌟", label: "Mini Apps Hub", route: "/mini-apps-hub" },
  { id: "agents", icon: "🤖", label: "Agent Workbench", route: "/agents" },
  { id: "execution", icon: "⚡", label: "Code Execution", route: "/execution" },
  { id: "analytics", icon: "📊", label: "Analytics", route: "/analytics" },
  { id: "settings", icon: "⚙️", label: "Settings", route: "/settings" }
]
```

---

## 🎨 Visual Design

### **Expanded State (280px width)**
```css
.sidebar-expanded {
  width: 280px;
  background: linear-gradient(180deg, 
    var(--sanctuary-bg-card) 0%, 
    var(--sanctuary-bg-secondary) 100%);
  border-right: 1px solid var(--sanctuary-border);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **Collapsed State (80px width)**
```css
.sidebar-collapsed {
  width: 80px;
  /* Same styling but icons only */
  overflow: hidden;
}

.sidebar-collapsed .nav-label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-collapsed .nav-icon {
  margin: 0 auto;
}
```

### **Header Section**
```css
.sidebar-header {
  height: 80px;
  background: var(--sanctuary-primary);
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
}

.logo-expanded {
  color: white;
  font-size: 18px;
  font-weight: 700;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.logo-collapsed {
  opacity: 0;
  position: absolute;
}

.sidebar-collapsed .logo-expanded {
  opacity: 0;
}

.sidebar-collapsed .logo-collapsed {
  opacity: 1;
  font-size: 24px;
  text-align: center;
  width: 100%;
}

.toggle-button {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: var(--sanctuary-primary);
  border: 2px solid var(--sanctuary-bg-card);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  transition: all 0.3s ease;
}

.toggle-button:hover {
  background: var(--sanctuary-secondary);
  transform: translateY(-50%) scale(1.1);
}
```

### **Navigation Section**
```css
.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: var(--sanctuary-text-primary);
  text-decoration: none;
}

.nav-item:hover {
  background: var(--sanctuary-bg-secondary);
  transform: translateX(4px);
}

.nav-item.active {
  background: var(--sanctuary-accent);
  color: var(--sanctuary-text-primary);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--sanctuary-primary);
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  font-size: 20px;
  margin-right: 16px;
  transition: all 0.3s ease;
  min-width: 20px;
  text-align: center;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 1;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.nav-badge {
  background: var(--sanctuary-error);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
  min-width: 18px;
  text-align: center;
  opacity: 1;
  transition: all 0.3s ease;
}

/* Collapsed State Overrides */
.sidebar-collapsed .nav-item {
  padding: 12px;
  margin: 4px 8px;
  justify-content: center;
}

.sidebar-collapsed .nav-icon {
  margin-right: 0;
  font-size: 22px;
}

.sidebar-collapsed .nav-label,
.sidebar-collapsed .nav-badge {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
```

### **Footer Section**
```css
.sidebar-footer {
  height: 120px;
  padding: 20px;
  border-top: 1px solid var(--sanctuary-border);
  background: var(--sanctuary-bg-card);
}

.mama-bear-widget {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.mama-bear-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--sanctuary-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  animation: mama-bear-breathing 3s ease-in-out infinite;
}

.mama-bear-status {
  flex: 1;
  opacity: 1;
  transition: all 0.3s ease;
}

.mama-bear-status h4 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--sanctuary-text-primary);
}

.mama-bear-status p {
  margin: 4px 0 0;
  font-size: 10px;
  color: var(--sanctuary-text-secondary);
}

.sidebar-collapsed .mama-bear-status {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-collapsed .mama-bear-widget {
  justify-content: center;
}
```

---

## 🎮 Interactive Behaviors

### **Hover Tooltips (Collapsed Mode)**
```tsx
interface TooltipProps {
  text: string;
  children: React.ReactNode;
  isVisible: boolean;
}

const NavTooltip: React.FC<TooltipProps> = ({ text, children, isVisible }) => (
  <div className="nav-tooltip-container">
    {children}
    {isVisible && (
      <div className="nav-tooltip">
        {text}
        <div className="tooltip-arrow" />
      </div>
    )}
  </div>
);
```

```css
.nav-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: var(--sanctuary-bg-card);
  color: var(--sanctuary-text-primary);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--sanctuary-border);
  z-index: 1000;
  margin-left: 12px;
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease-out forwards;
}

.tooltip-arrow {
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid var(--sanctuary-bg-card);
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}
```

### **Toggle Animation**
```css
@keyframes sidebarExpand {
  from {
    width: 80px;
  }
  to {
    width: 280px;
  }
}

@keyframes sidebarCollapse {
  from {
    width: 280px;
  }
  to {
    width: 80px;
  }
}

.sidebar-expanding {
  animation: sidebarExpand 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.sidebar-collapsing {
  animation: sidebarCollapse 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

---

## 📱 Responsive Behavior

### **Mobile Adaptations**
```css
/* Mobile (768px and below) */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    z-index: 1000;
    width: 280px !important; /* Always full width on mobile */
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .sidebar-overlay.visible {
    opacity: 1;
  }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .sidebar-collapsed {
    width: 70px;
  }
}
```

---

## 🛠️ Implementation Requirements

### **React Component Structure**
```tsx
interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  currentRoute: string;
  navigationItems: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isExpanded, 
  onToggle, 
  currentRoute, 
  navigationItems 
}) => {
  // Component implementation
};

// Usage
<Sidebar
  isExpanded={sidebarExpanded}
  onToggle={() => setSidebarExpanded(!sidebarExpanded)}
  currentRoute={location.pathname}
  navigationItems={navigationItems}
/>
```

### **State Management**
```tsx
// Context for sidebar state
interface SidebarContextType {
  isExpanded: boolean;
  toggle: () => void;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

// Custom hook
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};
```

### **Local Storage Persistence**
```tsx
// Remember user preference
const useSidebarPersistence = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  return [isExpanded, setIsExpanded] as const;
};
```

---

## 🎯 Key Features

### **1. Smooth Transitions**
- ✅ Width animation (280px ↔ 80px)
- ✅ Label fade in/out
- ✅ Icon repositioning
- ✅ Tooltip appearance in collapsed mode

### **2. Active State Management**
- ✅ Current page highlighting
- ✅ Visual indicator (left border)
- ✅ Icon/label styling changes

### **3. Accessibility**
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus management
- ✅ ARIA labels for icons

### **4. Performance**
- ✅ Smooth 60fps animations
- ✅ Minimal re-renders
- ✅ Efficient state management
- ✅ CSS-based transitions

### **5. User Experience**
- ✅ Hover tooltips in collapsed mode
- ✅ Consistent spacing and alignment
- ✅ Mama Bear status widget
- ✅ Badge notifications support

---

## 🧪 Testing Requirements

### **Visual Tests**
- [ ] Expanded → Collapsed transition
- [ ] Collapsed → Expanded transition  
- [ ] Active state highlighting
- [ ] Hover effects and tooltips
- [ ] Mobile overlay behavior
- [ ] Theme switching compatibility

### **Interaction Tests**
- [ ] Toggle button functionality
- [ ] Navigation link clicks
- [ ] Keyboard navigation
- [ ] Mobile swipe gestures
- [ ] Persistence across page reloads

### **Responsive Tests**
- [ ] Desktop (1024px+)
- [ ] Tablet (768px-1024px)
- [ ] Mobile (320px-768px)
- [ ] Large screens (1440px+)

---

## 📦 Deliverables

1. **`Sidebar.tsx`** - Main component
2. **`SidebarContext.tsx`** - State management
3. **`sidebar.css`** - Styling and animations
4. **`navigation.types.ts`** - TypeScript interfaces
5. **`useSidebar.hook.ts`** - Custom hook
6. **`Sidebar.test.tsx`** - Component tests
7. **`Sidebar.stories.tsx`** - Storybook stories

---

## 🎉 Success Criteria

✅ **Smooth Performance**: 60fps animations, no jank  
✅ **Pixel Perfect**: Matches design specifications exactly  
✅ **Fully Responsive**: Works on all device sizes  
✅ **Accessible**: Keyboard + screen reader support  
✅ **Persistent**: Remembers user preference  
✅ **Maintainable**: Clean, documented code  

---

*"Navigation should feel effortless and intuitive. Users should always know where they are and where they can go next."*

🧭 **Navigation Status: READY TO BUILD** ✅
