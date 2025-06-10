import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import SanctuaryLayout from '@/components/layouts/SanctuaryLayout'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import ScoutWorkflow from './experiences/ScoutWorkflow'
import EnhancedScoutWorkflow from './experiences/EnhancedScoutWorkflow'
import SanctuaryHome from './experiences/SanctuaryHome'
import DevWorkspaces from './experiences/DevWorkspaces'
import MCPMarketplace from './experiences/MCPMarketplace'
import LiveAPIStudio from './experiences/LiveAPIStudio'
import MultiModalChat from './experiences/MultiModalChat'
import ComputerUse from './experiences/ComputerUse'
import MiniAppsHub from './experiences/MiniAppsHub'
import Settings from './experiences/Settings'
import MainChat from './experiences/MainChat'

function App() {
  const { activeExperience } = useSanctuaryStore()

  const renderExperience = () => {
    switch (activeExperience) {
      case 'home':
        return <SanctuaryHome />
      case 'main-chat':
        return <MainChat />
      case 'scout-workflow':
        return <ScoutWorkflow />
      case 'enhanced-scout':
        return <EnhancedScoutWorkflow />
      case 'dev-workspaces':
        return <DevWorkspaces />
      case 'multi-modal-chat':
        return <MultiModalChat />
      case 'mcp-marketplace':
        return <MCPMarketplace />
      case 'mini-apps':
        return <MiniAppsHub />
      case 'computer-use':
        return <ComputerUse />
      case 'live-api-studio':
        return <LiveAPIStudio />
      case 'settings':
        return <Settings />
      default:
        return <SanctuaryHome />
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SanctuaryLayout>
        {renderExperience()}
      </SanctuaryLayout>
      <Toaster />
    </ThemeProvider>
  )
}

export default App