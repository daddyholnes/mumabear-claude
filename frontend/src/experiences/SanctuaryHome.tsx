import { motion } from 'framer-motion'
import { 
  Sparkles, Brain, Code, MessageSquare, Zap, 
  Globe, Settings, Monitor, ArrowRight, Play,
  Activity, Heart, Cpu, Wifi, Database,
  TrendingUp, Clock, Star, Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { useEnhancedTheme } from '@/components/sanctuary-theme-provider'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function SanctuaryHome() {
  const { setActiveExperience, effectLevel, theme } = useSanctuaryStore()
  const enhancedTheme = useEnhancedTheme()
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 89
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Simulate system metrics updates
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(20, Math.min(70, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(60, Math.min(100, prev.network + (Math.random() - 0.5) * 15))
      }))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getMoodBasedEmoji = () => {
    switch (enhancedTheme.currentTheme) {
      case 'sanctuary': return '🌿'
      case 'daytime': return '☀️'
      case 'night': return '🌙'
      case 'purple-haze': return '🔮'
      case 'cosmic-purple': return '✨'
      default: return '🏡'
    }
  }
  const quickActions = [
    {
      title: 'Start Chatting',
      description: 'Begin a conversation with Mama Bear',
      icon: MessageSquare,
      action: () => setActiveExperience('main-chat'),
      gradient: 'from-purple-500 to-blue-500',
      badge: 'New Messages',
      count: 3
    },
    {
      title: 'Scout Workflow',
      description: 'From idea to production in minutes',
      icon: Zap,
      action: () => setActiveExperience('scout-workflow'),
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Hot',
      count: null
    },
    {
      title: 'Dev Workspace',
      description: 'Cloud development environment',
      icon: Code,
      action: () => setActiveExperience('dev-workspaces'),
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Active',
      count: 2
    },
    {
      title: 'MCP Tools',
      description: 'Browse and install AI tools',
      icon: Globe,
      action: () => setActiveExperience('mcp-marketplace'),
      gradient: 'from-violet-500 to-purple-500',
      badge: 'Explore',
      count: null
    },
  ]

  const systemStatus = [
    { 
      name: 'Mama Bear', 
      status: 'online', 
      icon: Heart, 
      description: '7 variants ready',
      uptime: '99.9%'
    },
    { 
      name: 'Gemini Orchestra', 
      status: 'active', 
      icon: Brain, 
      description: '50+ models connected',
      uptime: '99.7%'
    },
    { 
      name: 'Scrapybara', 
      status: 'ready', 
      icon: Activity, 
      description: 'Web automation ready',
      uptime: '99.5%'
    },
    { 
      name: 'Memory System', 
      status: 'synced', 
      icon: Database, 
      description: 'Mem0 + ChromaDB',
      uptime: '99.8%'
    },
  ]

  const recentActivity = [
    { 
      title: 'Built React Dashboard', 
      time: '2 hours ago', 
      type: 'code',
      user: 'Scout AI',
      importance: 'high'
    },
    { 
      title: 'Deployed to Vercel', 
      time: '3 hours ago', 
      type: 'deploy',
      user: 'Deployment Bot',
      importance: 'medium'
    },
    { 
      title: 'AI Model Training Complete', 
      time: '4 hours ago', 
      type: 'ai',
      user: 'Gemini-Pro',
      importance: 'high'
    },
    { 
      title: 'Database Backup Completed', 
      time: '6 hours ago', 
      type: 'system',
      user: 'System',
      importance: 'low'
    },
    { 
      title: 'New MCP Server Installed', 
      time: '1 day ago', 
      type: 'tool',
      user: 'Package Manager',
      importance: 'medium'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }
  return (
    <motion.div
      className={cn(
        "min-h-screen p-6 transition-all duration-500",
        enhancedTheme.getThemeClasses()
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Hero Section */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-border/50"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: enhancedTheme.shouldReduceMotion ? 1 : 1.02 }}
              >
                <span className="text-4xl">{getMoodBasedEmoji()}</span>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {getGreeting()}!
                  </h1>
                  <p className="text-muted-foreground">
                    Welcome back to your Sanctuary
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="secondary" className="gap-2">
                  <Brain className="w-3 h-3" />
                  ADHD Optimized
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Clock className="w-3 h-3" />
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Badge>
              </div>
            </div>

            <div className="hidden lg:block">
              <ThemeSwitcher variant="compact" />
            </div>
          </div>

          {/* System Health Bar */}
          <div className="mt-6 p-4 bg-card/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">System Health</h3>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                All Systems Operational
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>CPU</span>
                  <span>{systemMetrics.cpu}%</span>
                </div>
                <Progress value={systemMetrics.cpu} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Memory</span>
                  <span>{systemMetrics.memory}%</span>
                </div>
                <Progress value={systemMetrics.memory} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Storage</span>
                  <span>{systemMetrics.disk}%</span>
                </div>
                <Progress value={systemMetrics.disk} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Network</span>
                  <span>{systemMetrics.network}%</span>
                </div>
                <Progress value={systemMetrics.network} className="h-1" />
              </div>
            </div>
          </div>
        </motion.div>        {/* Enhanced Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveExperience('settings')}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Customize
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ 
                  scale: enhancedTheme.shouldReduceMotion ? 1 : 1.02,
                  y: enhancedTheme.shouldReduceMotion ? 0 : -2
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: enhancedTheme.getAnimationDuration(200) }}
              >
                <Card className={cn(
                  "cursor-pointer transition-all duration-300 group overflow-hidden relative",
                  "hover:shadow-lg hover:border-primary/50",
                  enhancedTheme.shouldUseHighContrast && "border-2"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
                        action.gradient
                      )}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {action.count && (
                        <Badge variant="secondary" className="text-xs">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="text-sm">{action.description}</CardDescription>
                    
                    {action.badge && (
                      <Badge variant="outline" className="w-fit mt-2">
                        {action.badge}
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-primary/10 transition-colors"
                      onClick={action.action}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                  
                  {!enhancedTheme.shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>        {/* Enhanced Status Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          {/* System Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                System Status
                <Badge variant="secondary" className="ml-auto">
                  4/4 Online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={service.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <service.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{service.name}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        service.status === 'online' && "bg-green-500/20 text-green-400",
                        service.status === 'active' && "bg-blue-500/20 text-blue-400",
                        service.status === 'ready' && "bg-orange-500/20 text-orange-400",
                        service.status === 'synced' && "bg-purple-500/20 text-purple-400"
                      )}
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">
                    {service.description} • Uptime: {service.uptime}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  whileHover={{ x: enhancedTheme.shouldReduceMotion ? 0 : 2 }}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    activity.type === 'code' && "bg-green-500",
                    activity.type === 'deploy' && "bg-blue-500",
                    activity.type === 'ai' && "bg-purple-500",
                    activity.type === 'system' && "bg-gray-500",
                    activity.type === 'tool' && "bg-orange-500"
                  )} />
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs ml-2",
                          activity.importance === 'high' && "border-red-500/50 text-red-400",
                          activity.importance === 'medium' && "border-yellow-500/50 text-yellow-400",
                          activity.importance === 'low' && "border-gray-500/50 text-gray-400"
                        )}
                      >
                        {activity.importance}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>        {/* Enhanced Feature Highlights */}
        <motion.div
          className="space-y-8"
          variants={itemVariants}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">What Makes Podplay Special?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built from the ground up for neurodivergent minds, with cutting-edge AI and cloud-native architecture
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="text-center space-y-4 group"
              whileHover={{ y: enhancedTheme.shouldReduceMotion ? 0 : -4 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Neurodivergent First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Designed for ADHD minds with sensory-friendly interfaces, cognitive load optimization, 
                and customizable accessibility features that adapt to your needs
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                <span>ADHD · Autism · Focus Support</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center space-y-4 group"
              whileHover={{ y: enhancedTheme.shouldReduceMotion ? 0 : -4 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                From idea to deployed application in minutes with our Scout workflow system, 
                powered by AI automation and intelligent code generation
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>5min Deploy · Auto-Scale · Zero Config</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center space-y-4 group"
              whileHover={{ y: enhancedTheme.shouldReduceMotion ? 0 : -4 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">AI Native</h3>
              <p className="text-muted-foreground leading-relaxed">
                50+ AI models working together with persistent memory, learning capabilities, 
                and the Gemini Orchestra for intelligent task orchestration
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Cpu className="w-4 h-4" />
                <span>50+ Models · Memory · Learning</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div
          className="text-center space-y-6 p-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-border/50"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Ready to get started?</h3>
            <p className="text-muted-foreground">
              Choose your adventure or let Mama Bear guide you through the onboarding
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => setActiveExperience('main-chat')}
              className="gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Chat with Mama Bear
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => setActiveExperience('scout-workflow')}
              className="gap-2"
            >
              <Zap className="w-5 h-5" />
              Try Scout Workflow
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}