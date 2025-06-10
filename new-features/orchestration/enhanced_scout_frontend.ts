// frontend/src/experiences/EnhancedScoutWorkflow.tsx
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
      }, 2000)
      
      return () => {
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current)
        }
      }
    }
  }, [currentWorkflow])

  const loadOrchestrationStatus = async () => {
    try {
      const response = await fetch('/api/scout/orchestration/status')
      const data = await response.json()
      
      if (data.success) {
        setOrchestrationStatus(data.orchestration_status)
      }
    } catch (error) {
      console.error('Failed to load orchestration status:', error)
    }
  }

  const loadWorkflowStatus = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/scout/workflow/${workflowId}/status`)
      const data = await response.json()
      
      if (data.success) {
        setCurrentWorkflow(data)
        
        // Stop auto-refresh if workflow is complete
        if (['completed', 'failed'].includes(data.status) && statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: projectDescription,
          user_id: 'demo_user',
          preferences: {
            frontend: 'react',
            styling: 'tailwindcss'
          }
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentWorkflow({
          workflow_id: data.workflow_id,
          status: 'planning',
          progress: 0,
          stages: data.stages,
          metadata: {
            started_at: new Date().toISOString(),
            models_used: [],
            total_requests: 0,
            quota_switches: 0
          },
          current_stage: 'planning'
        })
        
        // Start polling for status updates
        setTimeout(() => loadWorkflowStatus(data.workflow_id), 1000)
      }
    } catch (error) {
      console.error('Failed to start workflow:', error)
    } finally {
      setIsStarting(false)
    }
  }

  const cancelWorkflow = async () => {
    if (!currentWorkflow) return
    
    try {
      const response = await fetch(`/api/scout/workflow/${currentWorkflow.workflow_id}/cancel`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentWorkflow(prev => prev ? { ...prev, status: 'failed' } : null)
      }
    } catch (error) {
      console.error('Failed to cancel workflow:', error)
    }
  }

  const rebalanceModels = async () => {
    try {
      const response = await fetch('/api/scout/models/rebalance', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        loadOrchestrationStatus() // Refresh status
      }
    } catch (error) {
      console.error('Failed to rebalance models:', error)
    }
  }

  const getModelTierColor = (tier: string) => {
    switch (tier) {
      case 'primary': return 'bg-green-500'
      case 'secondary': return 'bg-blue-500'
      case 'fallback': return 'bg-yellow-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'running': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">🎯 Enhanced Scout Workflow</h1>
                  <p className="text-gray-300 text-sm">
                    Autonomous full-stack development with 8 Gemini 2.5 models
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? 'border-green-500 text-green-400' : ''}
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", autoRefresh && "animate-spin")} />
                  Auto Refresh
                </Button>
                
                <Button variant="outline" size="sm" onClick={rebalanceModels}>
                  <Activity className="w-4 h-4 mr-2" />
                  Rebalance Models
                </Button>
                
                <Dialog open={showModelDetails} onOpenChange={setShowModelDetails}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Cpu className="w-4 h-4 mr-2" />
                      Model Status
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Workflow Control Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Input */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project in detail... e.g., 'Build a social media app with React frontend, Node.js backend, real-time chat, user authentication, and PostgreSQL database'"
                    className="min-h-[120px] bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    disabled={!!currentWorkflow && !['completed', 'failed'].includes(currentWorkflow.status)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={startWorkflow}
                      disabled={!projectDescription.trim() || isStarting || (!!currentWorkflow && !['completed', 'failed'].includes(currentWorkflow.status))}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isStarting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Start Scout Workflow
                    </Button>
                    
                    {currentWorkflow && !['completed', 'failed'].includes(currentWorkflow.status) && (
                      <Button variant="destructive" onClick={cancelWorkflow}>
                        <Square className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Progress */}
              {currentWorkflow && (
                <Card className="bg-gray-800/50 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Target className="w-5 h-5 text-green-400" />
                        Workflow Progress
                      </CardTitle>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {currentWorkflow.workflow_id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Overall Progress</span>
                        <span className="text-white">{Math.round(currentWorkflow.progress)}%</span>
                      </div>
                      <Progress value={currentWorkflow.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Quota Efficiency</h4>
                        <div className="text-2xl font-bold text-white">
                          {currentWorkflow.metadata.quota_switches}/{currentWorkflow.metadata.total_requests}
                        </div>
                        <p className="text-xs text-gray-400">Model switches / Total requests</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Models Used</h4>
                        <div className="text-2xl font-bold text-white">
                          {new Set(currentWorkflow.metadata.models_used).size}
                        </div>
                        <p className="text-xs text-gray-400">Unique models utilized</p>
                      </div>
                    </div>

                    {/* Stage Timeline */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Stage Timeline</h4>
                      {currentWorkflow.stages.map((stage, index) => (
                        <motion.div
                          key={stage.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {getStageIcon(stage.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">{stage.name}</span>
                              {stage.model_used && (
                                <Badge variant="outline" className="text-xs">
                                  {stage.model_used.split('-').slice(-2).join('-')}
                                </Badge>
                              )}
                            </div>
                            {stage.duration && (
                              <p className="text-xs text-gray-400">
                                Completed in {stage.duration.toFixed(1)}s
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Model Orchestra Status */}
            <div className="space-y-6">
              {/* System Health */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-green-400" />
                    Orchestra Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orchestrationStatus && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {orchestrationStatus.healthy_models}
                          </div>
                          <p className="text-xs text-gray-400">Healthy Models</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {orchestrationStatus.active_workflows}
                          </div>
                          <p className="text-xs text-gray-400">Active Workflows</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Model Health</span>
                          <span className="text-white">
                            {Math.round((orchestrationStatus.healthy_models / orchestrationStatus.total_models) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(orchestrationStatus.healthy_models / orchestrationStatus.total_models) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Model Status Grid */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    Gemini 2.5 Models
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-2">
                      {orchestrationStatus && Object.entries(orchestrationStatus.model_status).map(([modelId, status]) => (
                        <Tooltip key={modelId}>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "p-3 rounded-lg cursor-pointer transition-all",
                                "bg-gray-700/30 hover:bg-gray-700/50",
                                !status.is_healthy && "opacity-50"
                              )}
                              onClick={() => setSelectedModel(modelId)}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={cn("w-2 h-2 rounded-full", getModelTierColor(status.tier))} />
                                <span className="text-sm font-medium text-white truncate">
                                  {modelId.split('-').slice(-2).join('-')}
                                </span>
                                <div className="ml-auto">
                                  <Gauge 
                                    className={cn(
                                      "w-4 h-4",
                                      status.health_score > 0.7 ? "text-green-400" :
                                      status.health_score > 0.3 ? "text-yellow-400" : "text-red-400"
                                    )}
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-400">Quota:</span>
                                  <span className="text-white ml-1">{status.quota_usage.minute.split('/')[0]}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Success:</span>
                                  <span className="text-white ml-1">
                                    {Math.round(status.performance.success_rate * 100)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <div className="space-y-1">
                              <p className="font-medium">{modelId}</p>
                              <p className="text-sm">Health: {Math.round(status.health_score * 100)}%</p>
                              <p className="text-sm">Tier: {status.tier}</p>
                              <p className="text-sm">Specialties: {status.specialties.join(', ')}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={loadOrchestrationStatus}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={rebalanceModels}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Rebalance Models
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setShowModelDetails(true)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Model Details Modal */}
        <Dialog open={showModelDetails} onOpenChange={setShowModelDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Gemini 2.5 Orchestra - Detailed Status</DialogTitle>
            </DialogHeader>
            
            {orchestrationStatus && (
              <div className="space-y-6">
                {/* System Overview */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {orchestrationStatus.healthy_models}
                    </div>
                    <p className="text-sm text-gray-600">Healthy Models</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {orchestrationStatus.total_models}
                    </div>
                    <p className="text-sm text-gray-600">Total Models</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {orchestrationStatus.active_workflows}
                    </div>
                    <p className="text-sm text-gray-600">Active Workflows</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((orchestrationStatus.healthy_models / orchestrationStatus.total_models) * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Overall Health</p>
                  </div>
                </div>

                {/* Detailed Model Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Model Performance Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Model ID</th>
                          <th className="text-left p-2">Tier</th>
                          <th className="text-left p-2">Health Score</th>
                          <th className="text-left p-2">Quota Usage</th>
                          <th className="text-left p-2">Success Rate</th>
                          <th className="text-left p-2">Errors</th>
                          <th className="text-left p-2">Specialties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(orchestrationStatus.model_status).map(([modelId, status]) => (
                          <tr key={modelId} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-mono text-xs">{modelId}</td>
                            <td className="p-2">
                              <Badge variant="outline" className={getModelTierColor(status.tier)}>
                                {status.tier}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Progress value={status.health_score * 100} className="w-16 h-2" />
                                <span>{Math.round(status.health_score * 100)}%</span>
                              </div>
                            </td>
                            <td className="p-2 font-mono text-xs">
                              <div>M: {status.quota_usage.minute}</div>
                              <div>D: {status.quota_usage.day}</div>
                            </td>
                            <td className="p-2">{Math.round(status.performance.success_rate * 100)}%</td>
                            <td className="p-2">{status.performance.consecutive_errors}</td>
                            <td className="p-2 text-xs">{status.specialties.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export default EnhancedScoutWorkflow