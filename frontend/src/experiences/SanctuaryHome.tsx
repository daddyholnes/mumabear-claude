import { motion } from 'framer-motion'
import { 
  Sparkles, Brain, Code, MessageSquare, Zap, 
  Globe, Settings, Monitor, ArrowRight, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSanctuaryStore, experienceConfig } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'

export default function SanctuaryHome() {
  const { setCurrentExperience, effectLevel, theme } = useSanctuaryStore()

  const quickActions = [
    {
      title: 'Start Chatting',
      description: 'Begin a conversation with Mama Bear',
      icon: MessageSquare,
      action: () => setCurrentExperience('main-chat'),
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      title: 'Scout Workflow',
      description: 'From idea to production in minutes',
      icon: Zap,
      action: () => setCurrentExperience('scout-workflow'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Dev Workspace',
      description: 'Cloud development environment',
      icon: Code,
      action: () => setCurrentExperience('dev-workspaces'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'MCP Tools',
      description: 'Browse and install AI tools',
      icon: Globe,
      action: () => setCurrentExperience('mcp-marketplace'),
      gradient: 'from-violet-500 to-purple-500',
    },
  ]

  const recentActivity = [
    { title: 'Built a React component', time: '2 hours ago', type: 'code' },
    { title: 'Searched MCP marketplace', time: '4 hours ago', type: 'explore' },
    { title: 'Chat with Research Bear', time: '1 day ago', type: 'chat' },
    { title: 'Deployed to production', time: '2 days ago', type: 'deploy' },
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
      className="min-h-screen p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center space-y-6"
          variants={itemVariants}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: effectLevel === 'full' ? 1.05 : 1 }}
          >
            <h1 className={cn(
              "text-6xl font-bold bg-gradient-to-r from-primary-400 via-blue-400 to-purple-400 bg-clip-text text-transparent",
              effectLevel === 'full' && "text-glow"
            )}>
              Welcome to Your Sanctuary
            </h1>
            
            {effectLevel === 'full' && (
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your neurodivergent-friendly AI development environment where creativity meets technology. 
            Let Mama Bear guide you through every step of your journey.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Brain className="w-4 h-4 mr-2" />
              ADHD Optimized
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Powered
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Monitor className="w-4 h-4 mr-2" />
              Cloud Native
            </Badge>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={itemVariants}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ 
                scale: effectLevel === 'full' ? 1.05 : 1.02,
                y: effectLevel === 'full' ? -5 : -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={cn(
                "cursor-pointer transition-all duration-300 group overflow-hidden",
                effectLevel === 'full' && "hover-glow"
              )}>
                <CardHeader className="pb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
                    action.gradient
                  )}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary-500/10"
                    onClick={action.action}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
                
                {effectLevel === 'full' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-blue-500/5"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          {/* System Status */}
          <Card className={cn(
            effectLevel === 'full' && "glass"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mama Bear</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Online
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Scrapybara</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Ready
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory (Mem0)</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Models</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  3 Connected
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className={cn(
            effectLevel === 'full' && "glass"
          )}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activity.type === 'code' && "bg-green-500",
                    activity.type === 'explore' && "bg-blue-500",
                    activity.type === 'chat' && "bg-purple-500",
                    activity.type === 'deploy' && "bg-orange-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className={cn(
            effectLevel === 'full' && "glass"
          )}>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                New to Podplay? Start here!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentExperience('main-chat')}
              >
                <Play className="w-4 h-4 mr-2" />
                Take the Tour
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentExperience('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize Sanctuary
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentExperience('mcp-marketplace')}
              >
                <Globe className="w-4 h-4 mr-2" />
                Explore Tools
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="text-center space-y-6"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold">What Makes Podplay Special?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Neurodivergent First</h3>
              <p className="text-muted-foreground">
                Designed for ADHD minds with sensory-friendly interfaces and cognitive load optimization
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                From idea to deployed application in minutes with our Scout workflow system
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">AI Native</h3>
              <p className="text-muted-foreground">
                Multiple AI models working together with persistent memory and learning capabilities
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}