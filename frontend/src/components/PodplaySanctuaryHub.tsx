import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '@/store/store'
import { setCurrentExperience } from '@/store/slices/uiSlice'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// Layout components
import { MainSidebar } from './layout/MainSidebar'
import { LiveTicker } from './layout/LiveTicker'
import { ExpandableChatWidget } from './layout/ExpandableChatWidget'
import { ExperienceContainer } from './layout/ExperienceContainer'

// Experience components
import SanctuaryHome from './experiences/SanctuaryHome'
import MamaBearChat from './experiences/MamaBearChat'
import ScoutOrchestration from './experiences/ScoutOrchestration'
import AgentWorkbench from './experiences/AgentWorkbench'
// TODO: Import remaining experiences as they are created
// import CollaborativeWorkspaces from './experiences/CollaborativeWorkspaces'
// import MCPMarketplace from './experiences/MCPMarketplace'
// import MiniAppsHub from './experiences/MiniAppsHub'
// import CUAWorkbench from './experiences/CUAWorkbench'
// import DeepResearchLibrary from './experiences/DeepResearchLibrary'
// import LiveAPIStudio from './experiences/LiveAPIStudio'
// import IntegrationWorkbench from './experiences/IntegrationWorkbench'
// import ThemeCustomization from './experiences/ThemeCustomization'
// import Settings from './experiences/Settings'

// Placeholder components for experiences not yet implemented
const PlaceholderExperience = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full bg-gradient-to-br from-sanctuary-bg via-sanctuary-surface to-sanctuary-accent/10">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-sanctuary-text mb-4">{name}</h2>
      <p className="text-sanctuary-text/70">Coming soon...</p>
    </div>
  </div>
)

// Icons
import { 
  Home,
  MessageCircle,
  Zap,
  Bot,
  Users,
  Store,
  Grid3X3,
  Globe,
  BookOpen,
  Code,
  Settings as SettingsIcon,
  Palette,
  Network,
} from 'lucide-react'

export interface Experience {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<any>
  category: 'core' | 'ai' | 'workspace' | 'integration' | 'settings'
  beta?: boolean
  disabled?: boolean
}

const experiences: Experience[] = [
  {
    id: 'home',
    name: 'Sanctuary Home',
    description: 'Welcome dashboard with system overview and quick actions',
    icon: Home,
    component: SanctuaryHome,
    category: 'core',
  },
  {
    id: 'mama-bear-chat',
    name: 'Mama Bear Chat',
    description: 'Enhanced chat with 7 AI variants and rich formatting',
    icon: MessageCircle,
    component: MamaBearChat,
    category: 'ai',
  },
  {
    id: 'scout-orchestration',
    name: 'Scout Orchestration',
    description: 'Visual representation of all 8 Gemini Scout models',
    icon: Zap,
    component: ScoutOrchestration,
    category: 'ai',
  },
  {
    id: 'agent-workbench',
    name: 'Agent Workbench',
    description: 'Create and manage self-improving AI agents',
    icon: Bot,
    component: AgentWorkbench,
    category: 'ai',
  },
  {
    id: 'collaborative-workspaces',
    name: 'Collaborative Workspaces',
    description: 'E2B and Scrapybara integration with real-time collaboration',
    icon: Users,
    component: () => <PlaceholderExperience name="Collaborative Workspaces" />,
    category: 'workspace',
  },  {
    id: 'mcp-marketplace',
    name: 'MCP Marketplace',
    description: 'Discover and install AI tools with Mama Bear assistance',
    icon: Store,
    component: () => <PlaceholderExperience name="MCP Marketplace" />,
    category: 'integration',
  },
  {
    id: 'mini-apps-hub',
    name: 'Mini Apps Hub',
    description: 'Embedded AI Studio, ChatGPT, Claude, Gmail, and more',
    icon: Grid3X3,
    component: () => <PlaceholderExperience name="Mini Apps Hub" />,
    category: 'workspace',
  },
  {
    id: 'cua-workbench',
    name: 'CUA Workbench',
    description: 'Complete browser control for Scrapybara automation',
    icon: Globe,
    component: () => <PlaceholderExperience name="CUA Workbench" />,
    category: 'workspace',
  },
  {
    id: 'deep-research',
    name: 'Deep Research Library',
    description: 'Collaborative research between Gemini 2.5 and Claude 3.5',
    icon: BookOpen,
    component: () => <PlaceholderExperience name="Deep Research Library" />,
    category: 'ai',
  },
  {
    id: 'live-api-studio',
    name: 'Live API Studio',
    description: 'Bidirectional communication with persistent memory',
    icon: Code,
    component: () => <PlaceholderExperience name="Live API Studio" />,
    category: 'integration',
  },  {
    id: 'integration-workbench',
    name: 'Integration Workbench',
    description: 'Create custom workflows and automation',
    icon: Network,
    component: () => <PlaceholderExperience name="Integration Workbench" />,
    category: 'integration',
  },
  {
    id: 'theme-customization',
    name: 'Theme Studio',
    description: 'Customize themes and create new ones',
    icon: Palette,
    component: () => <PlaceholderExperience name="Theme Studio" />,
    category: 'settings',
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System preferences and configuration',
    icon: SettingsIcon,
    component: () => <PlaceholderExperience name="Settings" />,
    category: 'settings',
  },
]

export function PodplaySanctuaryHub() {
  const dispatch = useDispatch()
  const { currentExperience, sidebarOpen, liveTickerVisible } = useSelector((state: RootState) => state.ui)
  const { theme, neurodivergentMode, reducedMotion } = useTheme()
  
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize the application
  useEffect(() => {
    // Set up any initialization logic here
    const initializeApp = async () => {
      try {
        // Initialize WebSocket connections
        // Load user preferences
        // Set up system monitoring
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize application:', error)
        setIsInitialized(true) // Still allow the app to load
      }
    }

    initializeApp()
  }, [])

  const currentExperienceData = experiences.find(exp => exp.id === currentExperience) || experiences[0]
  const CurrentExperience = currentExperienceData.component

  const handleExperienceChange = (experienceId: string) => {
    dispatch(setCurrentExperience(experienceId))
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sanctuary-bg">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-semibold text-foreground">Initializing Podplay Sanctuary...</h2>
          <p className="text-muted-foreground">Setting up your AI-powered workspace</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen bg-sanctuary-bg text-foreground transition-all duration-300",
      neurodivergentMode && "font-medium",
      `theme-${theme}`
    )}>
      {/* Live Ticker */}
      <AnimatePresence>
        {liveTickerVisible && <LiveTicker />}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Main Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <MainSidebar
              experiences={experiences}
              currentExperience={currentExperience}
              onExperienceChange={handleExperienceChange}
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 overflow-hidden transition-all duration-300",
          liveTickerVisible && "pt-12"
        )}>
          <ExperienceContainer>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExperience}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={reducedMotion ? {} : { opacity: 0, y: -20 }}
                transition={reducedMotion ? {} : { duration: 0.3 }}
                className="h-full"
              >
                <CurrentExperience />
              </motion.div>
            </AnimatePresence>
          </ExperienceContainer>
        </main>
      </div>

      {/* Expandable Chat Widget */}
      <ExpandableChatWidget />
    </div>
  )
}

export { experiences }
