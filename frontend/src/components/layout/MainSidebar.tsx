import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RootState } from '@/store/store'
import { toggleSidebarCollapsed, setSidebarOpen } from '@/store/slices/uiSlice'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Experience } from '../PodplaySanctuaryHub'

// UI Components
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

// Icons
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Search,
  Filter,
  Sparkles,
} from 'lucide-react'

interface MainSidebarProps {
  experiences: Experience[]
  currentExperience: string
  onExperienceChange: (experienceId: string) => void
}

export function MainSidebar({ experiences, currentExperience, onExperienceChange }: MainSidebarProps) {
  const dispatch = useDispatch()
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui)
  const { theme, neurodivergentMode, reducedMotion } = useTheme()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter experiences based on search and category
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || exp.category === selectedCategory
    return matchesSearch && matchesCategory && !exp.disabled
  })

  // Group experiences by category
  const categorizedExperiences = filteredExperiences.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = []
    }
    acc[exp.category].push(exp)
    return acc
  }, {} as Record<string, Experience[]>)

  const categories = [
    { id: 'core', name: 'Core', color: 'bg-blue-500' },
    { id: 'ai', name: 'AI', color: 'bg-purple-500' },
    { id: 'workspace', name: 'Workspace', color: 'bg-green-500' },
    { id: 'integration', name: 'Integration', color: 'bg-orange-500' },
    { id: 'settings', name: 'Settings', color: 'bg-gray-500' },
  ]

  const handleToggleCollapsed = () => {
    dispatch(toggleSidebarCollapsed())
  }

  const handleCloseSidebar = () => {
    dispatch(setSidebarOpen(false))
  }

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-80'

  return (
    <TooltipProvider>
      <motion.aside
        initial={reducedMotion ? {} : { x: -320 }}
        animate={reducedMotion ? {} : { x: 0 }}
        exit={reducedMotion ? {} : { x: -320 }}
        transition={reducedMotion ? {} : { duration: 0.3 }}
        className={cn(
          sidebarWidth,
          "bg-sanctuary-surface border-r border-sanctuary-border transition-all duration-300 flex flex-col",
          neurodivergentMode && "border-r-2"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-sanctuary-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />                <h1 className={cn(
                  "font-bold text-sanctuary-text",
                  neurodivergentMode ? "text-lg" : "text-base"
                )}>
                  Sanctuary
                </h1>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleCollapsed}
                    className={cn(
                      "p-2",
                      neurodivergentMode && "h-10 w-10"
                    )}
                  >
                    {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                </TooltipContent>
              </Tooltip>
              
              {!sidebarCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseSidebar}
                      className={cn(
                        "p-2",
                        neurodivergentMode && "h-10 w-10"
                      )}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close sidebar</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          {!sidebarCollapsed && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2 bg-sanctuary-bg border border-sanctuary-border rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    neurodivergentMode && "py-3 text-base"
                  )}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="h-7 px-2 text-xs"
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <div className={cn("w-2 h-2 rounded-full mr-1", category.color)} />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Experience List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {sidebarCollapsed ? (
              // Collapsed view - icons only
              <div className="space-y-2">
                {filteredExperiences.map(experience => {
                  const Icon = experience.icon
                  const isActive = experience.id === currentExperience
                  
                  return (
                    <Tooltip key={experience.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          onClick={() => onExperienceChange(experience.id)}
                          className={cn(
                            "w-full p-3 h-12 justify-center",
                            neurodivergentMode && "h-14"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5",
                            neurodivergentMode && "h-6 w-6"
                          )} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div>
                          <div className="font-medium">{experience.name}</div>
                          <div className="text-sm text-muted-foreground">{experience.description}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ) : (
              // Expanded view - full experience cards
              <div className="space-y-1">
                {Object.entries(categorizedExperiences).map(([categoryId, categoryExperiences]) => {
                  const category = categories.find(c => c.id === categoryId)
                  
                  return (
                    <div key={categoryId}>
                      <div className="flex items-center space-x-2 px-2 py-2 mb-2">
                        <div className={cn("w-2 h-2 rounded-full", category?.color)} />
                        <span className={cn(
                          "text-sm font-medium text-muted-foreground uppercase tracking-wide",
                          neurodivergentMode && "text-base"
                        )}>
                          {category?.name}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        {categoryExperiences.map(experience => {
                          const Icon = experience.icon
                          const isActive = experience.id === currentExperience
                          
                          return (
                            <Button
                              key={experience.id}
                              variant={isActive ? "default" : "ghost"}
                              onClick={() => onExperienceChange(experience.id)}
                              className={cn(
                                "w-full justify-start p-3 h-auto",
                                neurodivergentMode && "p-4"
                              )}
                            >
                              <div className="flex items-start space-x-3 w-full">
                                <Icon className={cn(
                                  "h-5 w-5 mt-0.5 shrink-0",
                                  neurodivergentMode && "h-6 w-6"
                                )} />
                                <div className="text-left space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className={cn(
                                      "font-medium",
                                      neurodivergentMode && "text-base"
                                    )}>
                                      {experience.name}
                                    </span>
                                    {experience.beta && (
                                      <Badge variant="secondary" className="text-xs">Beta</Badge>
                                    )}
                                  </div>
                                  <p className={cn(
                                    "text-sm text-muted-foreground",
                                    neurodivergentMode && "text-base leading-relaxed"
                                  )}>
                                    {experience.description}
                                  </p>
                                </div>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-sanctuary-border">
            <div className="text-center">
              <p className={cn(
                "text-sm text-muted-foreground",
                neurodivergentMode && "text-base"
              )}>
                Podplay Sanctuary v1.0
              </p>
              <p className={cn(
                "text-xs text-muted-foreground",
                neurodivergentMode && "text-sm"
              )}>
                {filteredExperiences.length} experiences available
              </p>
            </div>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  )
}
