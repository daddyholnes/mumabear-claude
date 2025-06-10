import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Rocket, Eye, Clock, CheckCircle, AlertCircle, 
  Loader2, Sparkles, Brain, Target, Zap, Activity, BarChart3,
  Cpu, Database, GitBranch, Globe, Monitor, Settings, RefreshCw,
  Play, Pause, Square, TrendingUp, Gauge, Users, Timer,
  ChevronRight, ChevronDown, ExternalLink, Copy, Download,
  AlertTriangle, Shield, Layers, Network, Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ModelStatus {
  id: string
  name: string
  tier: 'primary' | 'secondary' | 'fallback' | 'emergency'
  health_score: number
  quota_usage: {
    minute: string
    day: string
  }
  performance: {
    success_rate: number
    consecutive_errors: number
  }
  specialties: string[]
  is_healthy: boolean
  cooldown_until?: string
}

interface WorkflowStage {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  model_used?: string
  duration?: number
  completed_at?: string
}

interface WorkflowStatus {
  workflow_id: string
  status: 'planning' | 'environment' | 'coding' | 'testing' | 'deployment' | 'completed' | 'failed'
  progress: number
  stages: WorkflowStage[]
  metadata: {
    started_at: string
    models_used: string[]
    total_requests: number
    quota_switches: number
  }
  current_stage: string
}

interface OrchestrationStatus {
  active_workflows: number
  total_models: number
  healthy_models: number
  model_status: Record<string, ModelStatus>
  routing_preferences: Record<string, string[]>
}

const EnhancedScoutWorkflow = () => {
  const [projectDescription, setProjectDescription] = useState('')
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStatus | null>(null)
  const [orchestrationStatus, setOrchestrationStatus] = useState<OrchestrationStatus | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [showModelDetails, setShowModelDetails] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  
  // Refs for auto-scrolling and intervals
  const statusIntervalRef = useRef<NodeJS.Timeout>()
  const orchestrationIntervalRef = useRef<NodeJS.Timeout>()

  // Load orchestration status on mount
  useEffect(() => {
    loadOrchestrationStatus()
    
    if (autoRefresh) {
      orchestrationIntervalRef.current = setInterval(loadOrchestrationStatus, 5000)
    }
    
    return () => {
      if (orchestrationIntervalRef.current) {
        clearInterval(orchestrationIntervalRef.current)
      }
    }
  }, [autoRefresh])

  // Auto-refresh workflow status
  useEffect(() => {
    if (currentWorkflow && !['completed', 'failed'].includes(currentWorkflow.status)) {
      statusIntervalRef.current = setInterval(() => {
        loadWorkflowStatus(currentWorkflow.workflow_id)
      }, 3000)
    }
    
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
      }
    }
  }, [currentWorkflow])

  const loadOrchestrationStatus = async () => {
    try {
      const response = await fetch('/api/scout/orchestration/status')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrchestrationStatus(data.orchestration)
        }
      }
    } catch (error) {
      console.error('Failed to load orchestration status:', error)
    }
  }

  const loadWorkflowStatus = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/scout/workflow/status/${workflowId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCurrentWorkflow(data.workflow)
        }
      }
    } catch (error) {
      console.error('Failed to load workflow status:', error)
    }
  }

  const startWorkflow = async () => {
    if (!projectDescription.trim()) return
    
    setIsStarting(true)
    
    try {
      const response = await fetch('/api/scout/workflow/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: projectDescription,
          user_id: 'scout_user',
          preferences: {
            frontend: 'react',
            styling: 'tailwindcss',
            deployment: 'vercel'
          }
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Start monitoring the workflow
          setTimeout(() => {
            loadWorkflowStatus(data.workflow_id)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Failed to start workflow:', error)
    } finally {
      setIsStarting(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'primary': return 'bg-purple-500'
      case 'secondary': return 'bg-blue-500'
      case 'fallback': return 'bg-orange-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'planning': return <Target className="w-4 h-4" />
      case 'environment': return <Settings className="w-4 h-4" />
      case 'coding': return <Cpu className="w-4 h-4" />
      case 'testing': return <CheckCircle className="w-4 h-4" />
      case 'deployment': return <Rocket className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'running': return 'text-blue-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎯 Enhanced Scout Workflow
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Autonomous Full-Stack Development with 8 Gemini 2.5 Models
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn("", autoRefresh && "bg-green-100 dark:bg-green-900/20")}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", autoRefresh && "animate-spin")} />
              Auto Refresh
            </Button>
            
            <Dialog open={showModelDetails} onOpenChange={setShowModelDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  Model Status
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>🤖 Gemini Model Orchestration Status</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  {orchestrationStatus && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">
                              {orchestrationStatus.active_workflows}
                            </div>
                            <div className="text-sm text-gray-600">Active Workflows</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                              {orchestrationStatus.healthy_models}
                            </div>
                            <div className="text-sm text-gray-600">Healthy Models</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                              {orchestrationStatus.total_models}
                            </div>
                            <div className="text-sm text-gray-600">Total Models</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-3">
                        {Object.values(orchestrationStatus.model_status).map((model) => (
                          <Card key={model.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-3 h-3 rounded-full", model.is_healthy ? "bg-green-500" : "bg-red-500")} />
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-sm text-gray-600">
                                    <Badge variant="outline" className={getTierColor(model.tier)}>
                                      {model.tier}
                                    </Badge>
                                    <span className="ml-2">Health: {(model.health_score * 100).toFixed(0)}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right text-sm">
                                <div>Quota: {model.quota_usage.minute} / min</div>
                                <div className="text-gray-600">Success: {(model.performance.success_rate * 100).toFixed(0)}%</div>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {model.specialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Panel - Project Input */}
          <div className="w-1/3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-r">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your project in detail. For example: 'Build a modern todo app with React, Firebase backend, real-time updates, user authentication, and responsive design. Include drag-and-drop functionality and dark mode support.'"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                
                <Button 
                  onClick={startWorkflow}
                  disabled={!projectDescription.trim() || isStarting}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Scout...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start Enhanced Scout
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span>Estimated Duration: 3-8 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>8 Gemini 2.5 Models Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Autonomous Quota Management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Workflow Status */}
          <div className="flex-1 p-6">
            {currentWorkflow ? (
              <div className="space-y-6">
                {/* Workflow Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Workflow Progress
                      </span>
                      <Badge variant={currentWorkflow.status === 'completed' ? 'default' : 'secondary'}>
                        {currentWorkflow.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{Math.round(currentWorkflow.progress)}%</span>
                        </div>
                        <Progress value={currentWorkflow.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Started:</span>
                          <div className="font-medium">
                            {new Date(currentWorkflow.metadata.started_at).toLocaleTimeString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Models Used:</span>
                          <div className="font-medium">{currentWorkflow.metadata.models_used.length}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Workflow Stages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Development Stages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentWorkflow.stages.map((stage, index) => (
                        <motion.div
                          key={stage.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border",
                            stage.status === 'completed' && "bg-green-50 dark:bg-green-900/20 border-green-200",
                            stage.status === 'running' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200",
                            stage.status === 'failed' && "bg-red-50 dark:bg-red-900/20 border-red-200",
                            stage.status === 'pending' && "bg-gray-50 dark:bg-gray-800/20 border-gray-200"
                          )}
                        >
                          <div className={cn("flex items-center justify-center w-8 h-8 rounded-full", 
                            stage.status === 'completed' && "bg-green-500 text-white",
                            stage.status === 'running' && "bg-blue-500 text-white",
                            stage.status === 'failed' && "bg-red-500 text-white",
                            stage.status === 'pending' && "bg-gray-300 text-gray-600"
                          )}>
                            {stage.status === 'running' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              getStageIcon(stage.name)
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium capitalize">
                              {stage.name.replace('_', ' ')}
                            </div>
                            {stage.model_used && (
                              <div className="text-sm text-gray-600">
                                Model: {stage.model_used.replace('-', ' ')}
                              </div>
                            )}
                            {stage.duration && (
                              <div className="text-sm text-gray-600">
                                Duration: {stage.duration.toFixed(1)}s
                              </div>
                            )}
                          </div>
                          
                          <div className={cn("text-sm font-medium", getStatusColor(stage.status))}>
                            {stage.status === 'running' && <span className="animate-pulse">●</span>}
                            {stage.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                            {stage.status === 'failed' && <AlertCircle className="w-4 h-4" />}
                            {stage.status === 'pending' && <Clock className="w-4 h-4" />}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Orchestration Metrics */}
                {orchestrationStatus && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Live Orchestration Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {orchestrationStatus.healthy_models}
                          </div>
                          <div className="text-sm text-gray-600">Healthy Models</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {orchestrationStatus.active_workflows}
                          </div>
                          <div className="text-sm text-gray-600">Active Workflows</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {currentWorkflow.metadata.quota_switches}
                          </div>
                          <div className="text-sm text-gray-600">Quota Switches</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {currentWorkflow.metadata.total_requests}
                          </div>
                          <div className="text-sm text-gray-600">Total Requests</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ready for Enhanced Scout</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Describe your project to start autonomous full-stack development
                      <br />
                      with intelligent Gemini 2.5 model orchestration
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-4 h-4" />
                      8 Models
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Auto Routing
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Quota Management
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default EnhancedScoutWorkflow
