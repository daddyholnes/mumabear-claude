import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Settings, 
  Palette, 
  Layout, 
  Sparkles, 
  Zap,
  Search,
  Brain,
  Video,
  Gamepad2,
  MonitorPlay
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

// Import all background components
import { AuroraBackground } from './effects/AuroraBackground';
import { BackgroundGradientAnimation } from './effects/BackgroundGradientAnimation';
import { LivingSanctuaryBackground } from './effects/LivingSanctuaryBackground';
import { GlowingEffect } from './ui/GlowingEffect';

// Import specialized UI components
import ScoutUI1 from './scout/ScoutUI1';
import { ScoutUI2 } from './scout-ui/ScoutUI2';
import { ScoutUI3 } from './scout-ui/ScoutUI3';  
import { ScoutUI4 } from './scout-ui/ScoutUI4';

import LiveStudio1 from './live-studio/LiveStudio1';
import LiveStudio2 from './live-studio/LiveStudio2';
import LiveStudio3 from './live-studio/LiveStudio3';
import LiveStudio4 from './live-studio/LiveStudio4';
import LiveStudio5 from './live-studio/LiveStudio5';
import LiveStudio6 from './live-studio/LiveStudio6';

import DeepResearch from './research/DeepResearch';
import DeepResearch2 from './research/DeepResearch2';

import MiniApps1 from './mini-apps/MiniApps1';
import MiniApps2 from './mini-apps/MiniApps2';

// Import additional utility components
import { AnimatedList } from './ui/animated-list';
import { ExpandableChat } from './ui/expandable-chat';
import { ChatBubble } from './ui/chat-bubble';

// Import newly migrated UI components
import { MessageLoading } from './ui/message-loading';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { ChatInput } from './ui/chat-input';
import { ChatMessageList } from './ui/chat-message-list';

interface ComponentOption {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  props?: {
    reducedMotion?: boolean;
    neurodivergentMode?: boolean;
    className?: string;
    [key: string]: any;
  };
}

interface BackgroundOption {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  props?: {
    reducedMotion?: boolean;
    interactive?: boolean;
    colorScheme?: string;
    [key: string]: any;
  };
}

interface SanctuarySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  calmMode: boolean;
  neurodivergentMode: boolean;
  theme: 'light' | 'dark' | 'system';
}

export const PodplaySanctuaryHub: React.FC = () => {
  // State for current selections
  const [selectedBackground, setSelectedBackground] = useState('aurora');
  const [selectedMainComponent, setSelectedMainComponent] = useState('scout-ui-2');
  const [selectedSideComponent, setSideComponent] = useState('expandable-chat');
  const [customSettings, setCustomSettings] = useState<SanctuarySettings>({
    reducedMotion: false,
    highContrast: false,
    calmMode: true,
    neurodivergentMode: true,
    theme: 'system'
  });

  // Background options
  const backgroundOptions: BackgroundOption[] = [
    {
      id: 'aurora',
      name: 'Aurora Sanctuary',
      description: 'Calming aurora effects perfect for focus',
      component: AuroraBackground,
      props: { showRadialGradient: true }
    },
    {
      id: 'gradient',
      name: 'Dynamic Gradient',
      description: 'Interactive flowing gradients',
      component: BackgroundGradientAnimation,
      props: { interactive: true }
    },
    {
      id: 'living-sanctuary',
      name: 'Living Sanctuary',
      description: 'Multi-layered interactive sanctuary environment',
      component: LivingSanctuaryBackground,
      props: { 
        interactive: true,
        colorScheme: 'sanctuary',
        reducedMotion: customSettings.reducedMotion 
      }
    },
    {
      id: 'plain',
      name: 'Minimal',
      description: 'Clean, distraction-free background',
      component: ({ children }: { children: React.ReactNode }) => 
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {children}
        </div>
    }
  ];

  // Main component options
  const mainComponentOptions: ComponentOption[] = [
    {
      id: 'scout-ui-1',
      name: 'Scout UI Classic',
      category: 'Workspace',
      description: 'Original Scout interface with task management',
      icon: Layout,
      component: ScoutUI1,
      props: { userName: 'Scout User' }
    },
    {
      id: 'scout-ui-2',
      name: 'Scout UI AI Generator',
      category: 'Workspace',
      description: 'AI-powered interface generation workspace with step-by-step progress',
      icon: Zap,
      component: ScoutUI2,
      props: { 
        reducedMotion: false,
        neurodivergentMode: true
      }
    },
    {
      id: 'scout-ui-3',
      name: 'Scout UI Content Studio',
      category: 'Workspace', 
      description: 'Multi-platform social content generation studio with analytics',
      icon: Settings,
      component: ScoutUI3,
      props: {
        reducedMotion: false,
        neurodivergentMode: true
      }
    },
    {
      id: 'scout-ui-4',
      name: 'Scout UI Project Manager',
      category: 'Workspace',
      description: 'Advanced project management workspace with AI tools integration',
      icon: Sparkles,
      component: ScoutUI4,
      props: {
        reducedMotion: false,
        neurodivergentMode: true
      }
    },
    {
      id: 'chat-interface',
      name: 'Chat Interface Demo',
      category: 'Communication',
      description: 'Complete chat interface with auto-scroll and accessibility features',
      icon: Brain,
      component: () => (
        <div className="h-full flex flex-col p-4 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-lg shadow-lg flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Sanctuary Chat Interface</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Neurodivergent-friendly chat with auto-scroll</p>
            </div>
            <ChatMessageList className="flex-1 p-4" />
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <ChatInput 
                placeholder="Type your message..."
                neurodivergentMode={true}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resizable-layout',
      name: 'Resizable Layout Demo',
      category: 'Layout',
      description: 'Resizable panels with enhanced accessibility and keyboard navigation',
      icon: Layout,
      component: () => (
        <div className="h-full p-4">
          <div className="h-full rounded-lg border bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full p-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Sidebar Panel</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="p-2 bg-white/50 rounded border">
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Main Content Panel</h3>
                <MessageLoading size="md" className="mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  This demonstrates a responsive layout system with enhanced accessibility features.
                  The actual resizable panels would use the ResizablePanelGroup component.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'live-studio-1',
      name: 'Live Studio Basic',
      category: 'Collaboration',
      description: 'Real-time collaboration interface',
      icon: Video,
      component: LiveStudio1
    },
    {
      id: 'live-studio-2',
      name: 'Live Studio Advanced',
      category: 'Collaboration',
      description: 'Advanced live collaboration tools',
      icon: MonitorPlay,
      component: LiveStudio2
    },
    {
      id: 'live-studio-3',
      name: 'Live Studio Pro',
      category: 'Collaboration',
      description: 'Professional streaming and collaboration',
      icon: Video,
      component: LiveStudio3
    },
    {
      id: 'deep-research-1',
      name: 'Deep Research Hub',
      category: 'Research',
      description: 'Comprehensive research interface',
      icon: Brain,
      component: DeepResearch
    },
    {
      id: 'deep-research-2',
      name: 'Research Assistant',
      category: 'Research',
      description: 'AI-powered research companion',
      icon: Search,
      component: DeepResearch2
    },
    {
      id: 'mini-apps-1',
      name: 'Mini Apps Hub',
      category: 'Platform',
      description: 'Integrated mini-applications ecosystem',
      icon: Gamepad2,
      component: MiniApps1
    },
    {
      id: 'mini-apps-2',
      name: 'App Manager',
      category: 'Platform',
      description: 'Advanced app management system',
      icon: Layout,
      component: MiniApps2
    }
  ];

  // Side component options (chat, notifications, etc.)
  const sideComponentOptions: ComponentOption[] = [
    {
      id: 'expandable-chat',
      name: 'Mama Bear Chat',
      category: 'AI Assistant',
      description: 'Expandable AI companion chat with accessibility features',
      icon: Brain,
      component: ExpandableChat,
      props: { 
        position: 'bottom-right', 
        size: 'lg',
        reducedMotion: false,
        neurodivergentMode: true
      }
    },
    {
      id: 'chat-bubble',
      name: 'Quick Chat',
      category: 'AI Assistant',
      description: 'Minimal chat bubble interface with clear visual hierarchy',
      icon: Brain,
      component: ChatBubble,
      props: {
        variant: 'received',
        layout: 'ai'
      }
    },
    {
      id: 'message-loading',
      name: 'Message Loading',
      category: 'Feedback',
      description: 'Accessible loading animation for chat interfaces',
      icon: Sparkles,
      component: () => (
        <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-lg">
          <h4 className="font-medium mb-2">Loading States Demo</h4>
          <div className="space-y-3">
            <MessageLoading size="sm" />
            <MessageLoading size="md" />
            <MessageLoading size="lg" neurodivergentMode={true} />
          </div>
        </div>
      )
    },
    {
      id: 'animated-notifications',
      name: 'Live Notifications',
      category: 'Feedback',
      description: 'Animated notification system with gentle transitions',
      icon: Sparkles,
      component: AnimatedList,
      props: { 
        delay: 2000,
        reducedMotion: false
      }
    }
  ];

  // Get current components
  const currentBackground = backgroundOptions.find(bg => bg.id === selectedBackground);
  const currentMainComponent = mainComponentOptions.find(comp => comp.id === selectedMainComponent);
  const currentSideComponent = sideComponentOptions.find(comp => comp.id === selectedSideComponent);

  const BackgroundComponent = currentBackground?.component || AuroraBackground;
  const MainComponent = currentMainComponent?.component || ScoutUI1;
  const SideComponent = currentSideComponent?.component || ExpandableChat;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <BackgroundComponent 
        {...(currentBackground?.props || {})}
      >        {/* Control Panel */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 z-50"
        >
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Background Selector */}
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose Background" />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundOptions.map((bg) => (
                      <SelectItem key={bg.id} value={bg.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{bg.name}</span>
                          <span className="text-sm text-gray-500">{bg.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Main Component Selector */}
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-blue-600" />
                <Select value={selectedMainComponent} onValueChange={setSelectedMainComponent}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Choose Interface" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainComponentOptions.map((comp) => {
                      const IconComponent = comp.icon;
                      return (
                        <SelectItem key={comp.id} value={comp.id}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="font-medium">{comp.name}</span>
                              <span className="text-sm text-gray-500">{comp.description}</span>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {comp.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Side Component Selector */}
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                <Select value={selectedSideComponent} onValueChange={setSideComponent}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose Assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    {sideComponentOptions.map((comp) => {
                      const IconComponent = comp.icon;
                      return (
                        <SelectItem key={comp.id} value={comp.id}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="font-medium">{comp.name}</span>
                              <span className="text-sm text-gray-500">{comp.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-amber-600" />
                <Select 
                  value={customSettings.theme} 
                  onValueChange={(value: string) => {
                    const theme = value as 'light' | 'dark' | 'system';
                    setCustomSettings(prev => ({ ...prev, theme }));
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Accessibility Quick Settings */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={customSettings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCustomSettings(prev => ({ 
                    ...prev, 
                    reducedMotion: !prev.reducedMotion
                  }))}
                >
                  🐌 Motion
                </Button>
                <Button
                  variant={customSettings.calmMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCustomSettings(prev => ({ 
                    ...prev, 
                    calmMode: !prev.calmMode 
                  }))}
                >
                  Calm Mode
                </Button>
                <Button
                  variant={customSettings.neurodivergentMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCustomSettings(prev => ({ 
                    ...prev, 
                    neurodivergentMode: !prev.neurodivergentMode 
                  }))}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  ND Mode
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Interface */}
        <div className="pt-24 h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMainComponent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: customSettings.reducedMotion ? 0.1 : 0.3 }}
              className="h-full"
            >
              <MainComponent 
                {...(currentMainComponent?.props || {})}
                reducedMotion={customSettings.reducedMotion}
                neurodivergentMode={customSettings.neurodivergentMode}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Component (Chat/Assistant) */}
        <AnimatePresence>
          <motion.div
            key={selectedSideComponent}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: customSettings.reducedMotion ? 0.1 : 0.3 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <SideComponent 
              {...(currentSideComponent?.props || {})}
              reducedMotion={customSettings.reducedMotion}
              neurodivergentMode={customSettings.neurodivergentMode}
            />
          </motion.div>
        </AnimatePresence>
      </BackgroundComponent>
    </div>
  );
};
