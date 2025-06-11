import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RootState } from '@/store/store'
import { useTheme } from '@/contexts/ThemeContext'
import { cn, animations } from '@/lib/utils'

// UI Components
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'

// Icons
import { 
  Activity, 
  Zap, 
  Users, 
  Bot, 
  MessageCircle, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Database,
  Cpu,
} from 'lucide-react'

export function SanctuaryHome() {
  const { theme, neurodivergentMode, reducedMotion } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Mock data for demonstration
  const systemStats = {
    aiModelsActive: 8,
    tasksCompleted: 247,
    activeUsers: 3,
    systemHealth: 98,
    responseTime: 850,
    uptime: '15d 8h 23m',
  }

  const recentActivities = [
    {
      id: '1',
      type: 'ai',
      message: 'Scout Gemini-Pro completed 3 analysis tasks',
      timestamp: new Date(Date.now() - 300000),
      status: 'success',
    },
    {
      id: '2',
      type: 'user',
      message: 'New collaborative workspace created: "Project Alpha"',
      timestamp: new Date(Date.now() - 600000),
      status: 'info',
    },
    {
      id: '3',
      type: 'system',
      message: 'MCP tool "Advanced Analytics" installed successfully',
      timestamp: new Date(Date.now() - 900000),
      status: 'success',
    },
    {
      id: '4',
      type: 'integration',
      message: 'API rate limit optimization applied',
      timestamp: new Date(Date.now() - 1200000),
      status: 'info',
    },
  ]

  const quickActions = [
    {
      id: 'chat',
      title: 'Start Chat',
      description: 'Begin conversation with Mama Bear',
      icon: MessageCircle,
      color: 'bg-blue-500',
      action: () => console.log('Open chat'),
    },
    {
      id: 'scout',
      title: 'Scout Tasks',
      description: 'View AI model orchestration',
      icon: Zap,
      color: 'bg-purple-500',
      action: () => console.log('Open scout'),
    },
    {
      id: 'workspace',
      title: 'Workspaces',
      description: 'Manage collaborative spaces',
      icon: Users,
      color: 'bg-green-500',
      action: () => console.log('Open workspaces'),
    },
    {
      id: 'agents',
      title: 'Agent Builder',
      description: 'Create custom AI agents',
      icon: Bot,
      color: 'bg-orange-500',
      action: () => console.log('Open agent builder'),
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai': return Zap
      case 'user': return Users
      case 'system': return Cpu
      case 'integration': return Globe
      default: return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-blue-500'
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          {...(reducedMotion ? {} : animations.slideDown)}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className={cn(
              "h-8 w-8 text-primary",
              neurodivergentMode && "h-10 w-10"
            )} />
            <h1 className={cn(
              "text-4xl font-bold text-foreground",
              neurodivergentMode && "text-5xl"
            )}>
              Welcome to Podplay Sanctuary
            </h1>
          </div>
          
          <p className={cn(
            "text-xl text-muted-foreground max-w-2xl mx-auto",
            neurodivergentMode && "text-2xl leading-relaxed"
          )}>
            Your AI-powered multi-experience hub for creativity, collaboration, and innovation
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </motion.div>

        {/* System Overview Cards */}
        <motion.div
          {...(reducedMotion ? {} : animations.slideUp)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className={cn(neurodivergentMode && "border-2")}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-purple-500" />
                <div>
                  <p className={cn(
                    "text-2xl font-bold",
                    neurodivergentMode && "text-3xl"
                  )}>
                    {systemStats.aiModelsActive}
                  </p>
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    neurodivergentMode && "text-base"
                  )}>
                    AI Models Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(neurodivergentMode && "border-2")}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-green-500" />
                <div>
                  <p className={cn(
                    "text-2xl font-bold",
                    neurodivergentMode && "text-3xl"
                  )}>
                    {systemStats.tasksCompleted}
                  </p>
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    neurodivergentMode && "text-base"
                  )}>
                    Tasks Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(neurodivergentMode && "border-2")}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className={cn(
                    "text-2xl font-bold",
                    neurodivergentMode && "text-3xl"
                  )}>
                    {systemStats.activeUsers}
                  </p>
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    neurodivergentMode && "text-base"
                  )}>
                    Active Sessions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(neurodivergentMode && "border-2")}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-orange-500" />
                <div>
                  <p className={cn(
                    "text-2xl font-bold",
                    neurodivergentMode && "text-3xl"
                  )}>
                    {systemStats.systemHealth}%
                  </p>
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    neurodivergentMode && "text-base"
                  )}>
                    System Health
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          {...(reducedMotion ? {} : animations.slideUp)}
          transition={reducedMotion ? {} : { delay: 0.1 }}
        >
          <Card className={cn(neurodivergentMode && "border-2")}>
            <CardHeader>
              <CardTitle className={cn(
                neurodivergentMode && "text-xl"
              )}>
                Quick Actions
              </CardTitle>
              <CardDescription className={cn(
                neurodivergentMode && "text-base"
              )}>
                Jump into your most-used experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map(action => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      onClick={action.action}
                      className={cn(
                        "h-auto p-4 flex flex-col items-center space-y-2",
                        "hover:bg-accent hover:text-accent-foreground",
                        neurodivergentMode && "p-6 space-y-3"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        action.color,
                        neurodivergentMode && "w-16 h-16"
                      )}>
                        <Icon className={cn(
                          "h-6 w-6 text-white",
                          neurodivergentMode && "h-8 w-8"
                        )} />
                      </div>
                      <div className="text-center">
                        <p className={cn(
                          "font-medium",
                          neurodivergentMode && "text-lg"
                        )}>
                          {action.title}
                        </p>
                        <p className={cn(
                          "text-xs text-muted-foreground",
                          neurodivergentMode && "text-sm"
                        )}>
                          {action.description}
                        </p>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          {...(reducedMotion ? {} : animations.slideUp)}
          transition={reducedMotion ? {} : { delay: 0.2 }}
        >
          <Card className={cn(neurodivergentMode && "border-2")}>
            <CardHeader>
              <CardTitle className={cn(
                neurodivergentMode && "text-xl"
              )}>
                Recent Activity
              </CardTitle>
              <CardDescription className={cn(
                neurodivergentMode && "text-base"
              )}>
                Latest updates from across your sanctuary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {recentActivities.map(activity => {
                    const Icon = getActivityIcon(activity.type)
                    return (
                      <div
                        key={activity.id}
                        className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg bg-muted/50",
                          neurodivergentMode && "p-4"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 mt-0.5 shrink-0",
                          getStatusColor(activity.status),
                          neurodivergentMode && "h-6 w-6"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium",
                            neurodivergentMode && "text-base"
                          )}>
                            {activity.message}
                          </p>
                          <p className={cn(
                            "text-xs text-muted-foreground",
                            neurodivergentMode && "text-sm"
                          )}>
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={activity.status === 'success' ? 'default' : 'secondary'}
                          className={cn(
                            "capitalize",
                            neurodivergentMode && "px-3 py-1"
                          )}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>        </motion.div>
      </div>
    </div>
  )
}

export default SanctuaryHome
