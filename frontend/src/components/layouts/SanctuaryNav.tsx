import { motion } from 'framer-motion'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'main-chat', label: 'Main Chat', emoji: '💬' },
  { id: 'scout-workflow', label: 'Scout Workflow', emoji: '🧭' },
  { id: 'enhanced-scout', label: 'Enhanced Scout', emoji: '⚡' },
  { id: 'dev-workspaces', label: 'Dev Workspaces', emoji: '💻' },
  { id: 'multi-modal-chat', label: 'Multi-Modal Chat', emoji: '🎭' },
  { id: 'mcp-marketplace', label: 'MCP Marketplace', emoji: '🤖' },
  { id: 'mini-apps', label: 'Mini Apps', emoji: '🌐' },
  { id: 'computer-use', label: 'Computer Use', emoji: '🖥️' },
  { id: 'live-api-studio', label: 'Live API Studio', emoji: '🚀' },
]

const SanctuaryNav = () => {
  const { activeExperience, setActiveExperience } = useSanctuaryStore()

  return (
    <nav className="flex flex-col gap-2 px-3 py-4">
      {navItems.map(item => (
        <motion.button
          key={item.id}
          onClick={() => setActiveExperience(item.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
            activeExperience === item.id 
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" 
              : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
          )}
        >
          <span className="text-lg flex-shrink-0">{item.emoji}</span>
          <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
          
          {/* Active indicator */}
          {activeExperience === item.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 w-1 h-8 bg-purple-400 rounded-r-full"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
      
      {/* Settings at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-700/50">
        <motion.button
          onClick={() => setActiveExperience('settings')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 w-full",
            activeExperience === 'settings'
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" 
              : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
          )}
        >
          <span className="text-lg flex-shrink-0">⚙️</span>
          <span className="font-medium text-sm whitespace-nowrap">Settings</span>
        </motion.button>
      </div>
    </nav>
  )
}

export default SanctuaryNav