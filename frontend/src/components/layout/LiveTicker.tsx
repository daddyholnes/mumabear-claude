import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '@/store/store'
import { setLiveTickerVisible, addNotification } from '@/store/slices/uiSlice'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// UI Components
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'

// Icons
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  Globe, 
  Users, 
  Zap,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
} from 'lucide-react'

interface TickerItem {
  id: string
  type: 'system' | 'ai' | 'user' | 'security' | 'performance'
  severity: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: Date
  source: string
  count?: number
}

export function LiveTicker() {
  const dispatch = useDispatch()
  const { liveTickerPosition } = useSelector((state: RootState) => state.ui)
  const { system } = useSelector((state: RootState) => state)
  const { theme, neurodivergentMode, reducedMotion } = useTheme()
  
  const [expanded, setExpanded] = useState(false)
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])

  // Mock real-time updates for demonstration
  useEffect(() => {
    const mockUpdates: TickerItem[] = [
      {
        id: '1',
        type: 'ai',
        severity: 'success',
        message: 'Mama Bear variant "Creative" is now active',
        timestamp: new Date(),
        source: 'AI Engine',
      },
      {
        id: '2',
        type: 'system',
        severity: 'info',
        message: 'Scout Model Gemini-Pro processing 3 tasks',
        timestamp: new Date(Date.now() - 30000),
        source: 'Scout Orchestra',
        count: 3,
      },
      {
        id: '3',
        type: 'user',
        severity: 'info',
        message: 'New collaborative workspace created',
        timestamp: new Date(Date.now() - 60000),
        source: 'Workspace Manager',
      },
      {
        id: '4',
        type: 'performance',
        severity: 'warning',
        message: 'High memory usage detected (85%)',
        timestamp: new Date(Date.now() - 120000),
        source: 'System Monitor',
      },
    ]

    setTickerItems(mockUpdates)

    // Simulate live updates
    const interval = setInterval(() => {
      const newUpdate: TickerItem = {
        id: Date.now().toString(),
        type: ['system', 'ai', 'user', 'performance'][Math.floor(Math.random() * 4)] as any,
        severity: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)] as any,
        message: `Live update at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        source: 'Live Monitor',
      }

      setTickerItems(prev => [newUpdate, ...prev.slice(0, 9)]) // Keep last 10 items
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: TickerItem['type']) => {
    switch (type) {
      case 'system': return Cpu
      case 'ai': return Zap
      case 'user': return Users
      case 'security': return AlertCircle
      case 'performance': return Activity
      default: return Globe
    }
  }

  const getSeverityColor = (severity: TickerItem['severity']) => {
    switch (severity) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-blue-500'
    }
  }

  const handleClose = () => {
    dispatch(setLiveTickerVisible(false))
  }

  const positionClasses = liveTickerPosition === 'top' 
    ? 'top-0 border-b' 
    : 'bottom-0 border-t'

  return (
    <motion.div
      initial={reducedMotion ? {} : { y: liveTickerPosition === 'top' ? -48 : 48 }}
      animate={reducedMotion ? {} : { y: 0 }}
      exit={reducedMotion ? {} : { y: liveTickerPosition === 'top' ? -48 : 48 }}
      transition={reducedMotion ? {} : { duration: 0.3 }}
      className={cn(
        "fixed left-0 right-0 z-40 bg-sanctuary-surface/95 backdrop-blur-sm border-sanctuary-border",
        positionClasses,
        expanded ? "h-auto" : "h-12",
        neurodivergentMode && "border-2"
      )}
    >
      {/* Collapsed Header */}
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className={cn(
              "h-4 w-4 text-primary animate-pulse",
              neurodivergentMode && "h-5 w-5"
            )} />
            <span className={cn(
              "text-sm font-medium",
              neurodivergentMode && "text-base"
            )}>
              Live Status
            </span>
          </div>

          {/* Current Status Indicators */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className={cn(
                "text-xs text-muted-foreground",
                neurodivergentMode && "text-sm"
              )}>
                System Healthy
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span className={cn(
                "text-xs text-muted-foreground",
                neurodivergentMode && "text-sm"
              )}>
                8 AI Models Active
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-purple-500" />
              <span className={cn(
                "text-xs text-muted-foreground",
                neurodivergentMode && "text-sm"
              )}>
                2 Active Sessions
              </span>
            </div>
          </div>

          {/* Scrolling Ticker */}
          {!expanded && tickerItems.length > 0 && (
            <div className="flex-1 overflow-hidden">
              <motion.div
                animate={{ x: [-200, -2000] }}
                transition={{ 
                  duration: 30, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="flex items-center space-x-8 whitespace-nowrap"
              >
                {tickerItems.slice(0, 3).map(item => {
                  const Icon = getIcon(item.type)
                  return (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Icon className={cn(
                        "h-3 w-3",
                        getSeverityColor(item.severity)
                      )} />
                      <span className={cn(
                        "text-xs",
                        neurodivergentMode && "text-sm"
                      )}>
                        {item.message}
                      </span>
                      {item.count && (
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </motion.div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "h-8 px-2",
              neurodivergentMode && "h-10 px-3"
            )}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className={cn(
              "h-8 px-2",
              neurodivergentMode && "h-10 px-3"
            )}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={reducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={reducedMotion ? {} : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={reducedMotion ? {} : { duration: 0.2 }}
            className="border-t border-sanctuary-border overflow-hidden"
          >
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* System Metrics */}
                <div className="space-y-2">
                  <h4 className={cn(
                    "font-medium text-sm",
                    neurodivergentMode && "text-base"
                  )}>
                    System Metrics
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Memory</span>
                      <span>6.2GB / 16GB</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Active Connections</span>
                      <span>24</span>
                    </div>
                  </div>
                </div>

                {/* AI Status */}
                <div className="space-y-2">
                  <h4 className={cn(
                    "font-medium text-sm",
                    neurodivergentMode && "text-base"
                  )}>
                    AI Models
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Active Models</span>
                      <span>8 / 8</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Tasks Queued</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Avg Response</span>
                      <span>850ms</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-2">
                  <h4 className={cn(
                    "font-medium text-sm",
                    neurodivergentMode && "text-base"
                  )}>
                    Recent Activity
                  </h4>
                  <ScrollArea className="h-20">
                    <div className="space-y-1">
                      {tickerItems.slice(0, 5).map(item => {
                        const Icon = getIcon(item.type)
                        return (
                          <div key={item.id} className="flex items-center space-x-2 text-xs">
                            <Icon className={cn(
                              "h-3 w-3 shrink-0",
                              getSeverityColor(item.severity)
                            )} />
                            <span className="truncate">{item.message}</span>
                            <span className="text-muted-foreground shrink-0">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
