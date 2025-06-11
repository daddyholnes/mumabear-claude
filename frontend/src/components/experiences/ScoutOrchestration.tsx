import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, BarChart3, Cpu, Database, GitBranch, Globe, 
  Monitor, Settings, RefreshCw, Play, Pause, Square, 
  TrendingUp, Gauge, Users, Timer, ChevronRight, ChevronDown, 
  ExternalLink, Copy, Download, AlertTriangle, Shield, 
  Layers, Network, Server, Zap, Brain, Target, Eye,
  CheckCircle, AlertCircle, Loader2, Sparkles, Clock,
  MessageCircle, Send, Rocket, Star, Award, Crown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface ScoutModel {
  id: string;
  name: string;
  tier: 'primary' | 'secondary' | 'fallback' | 'emergency';
  specialties: string[];
  healthScore: number;
  quotaUsage: {
    minute: string;
    day: string;
  };
  performance: {
    successRate: number;
    consecutiveErrors: number;
    avgResponseTime: number;
  };
  isHealthy: boolean;
  isActive: boolean;
  cooldownUntil?: string;
  currentTask?: string;
  completedTasks: number;
}

interface WorkflowStage {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  modelUsed?: string;
  duration?: number;
  completedAt?: string;
  progress?: number;
}

interface ActiveWorkflow {
  id: string;
  name: string;
  status: 'planning' | 'environment' | 'coding' | 'testing' | 'deployment' | 'completed' | 'failed';
  stages: WorkflowStage[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  startedAt: Date;
  estimatedCompletion?: Date;
  assignedModels: string[];
}

const scoutModels: ScoutModel[] = [
  {
    id: 'scout-alpha',
    name: 'Scout Alpha',
    tier: 'primary',
    specialties: ['Research', 'Analysis', 'Planning'],
    healthScore: 98,
    quotaUsage: { minute: '12/60', day: '1,234/15,000' },
    performance: { successRate: 97.8, consecutiveErrors: 0, avgResponseTime: 1.2 },
    isHealthy: true,
    isActive: true,
    currentTask: 'Market Research Analysis',
    completedTasks: 1847
  },
  {
    id: 'scout-beta',
    name: 'Scout Beta',
    tier: 'primary',
    specialties: ['Code Generation', 'Testing', 'Debugging'],
    healthScore: 94,
    quotaUsage: { minute: '8/60', day: '987/15,000' },
    performance: { successRate: 95.2, consecutiveErrors: 1, avgResponseTime: 0.9 },
    isHealthy: true,
    isActive: true,
    currentTask: 'Unit Test Creation',
    completedTasks: 2103
  },
  {
    id: 'scout-gamma',
    name: 'Scout Gamma',
    tier: 'secondary',
    specialties: ['Documentation', 'Communication', 'Support'],
    healthScore: 91,
    quotaUsage: { minute: '15/60', day: '2,156/15,000' },
    performance: { successRate: 93.7, consecutiveErrors: 0, avgResponseTime: 1.5 },
    isHealthy: true,
    isActive: false,
    completedTasks: 1592
  },
  {
    id: 'scout-delta',
    name: 'Scout Delta',
    tier: 'secondary',
    specialties: ['Data Processing', 'Automation', 'Integration'],
    healthScore: 89,
    quotaUsage: { minute: '22/60', day: '3,445/15,000' },
    performance: { successRate: 91.4, consecutiveErrors: 2, avgResponseTime: 2.1 },
    isHealthy: true,
    isActive: true,
    currentTask: 'API Integration Setup',
    completedTasks: 1276
  },
  {
    id: 'scout-epsilon',
    name: 'Scout Epsilon',
    tier: 'fallback',
    specialties: ['Quality Assurance', 'Validation', 'Review'],
    healthScore: 85,
    quotaUsage: { minute: '5/60', day: '678/15,000' },
    performance: { successRate: 88.9, consecutiveErrors: 1, avgResponseTime: 1.8 },
    isHealthy: true,
    isActive: false,
    completedTasks: 943
  },
  {
    id: 'scout-zeta',
    name: 'Scout Zeta',
    tier: 'fallback',
    specialties: ['Performance Optimization', 'Monitoring', 'Alerts'],
    healthScore: 82,
    quotaUsage: { minute: '3/60', day: '234/15,000' },
    performance: { successRate: 87.2, consecutiveErrors: 3, avgResponseTime: 2.5 },
    isHealthy: true,
    isActive: true,
    currentTask: 'System Performance Monitoring',
    completedTasks: 756
  },
  {
    id: 'scout-eta',
    name: 'Scout Eta',
    tier: 'emergency',
    specialties: ['Crisis Response', 'Emergency Fixes', 'Recovery'],
    healthScore: 76,
    quotaUsage: { minute: '1/60', day: '89/15,000' },
    performance: { successRate: 84.1, consecutiveErrors: 0, avgResponseTime: 3.2 },
    isHealthy: true,
    isActive: false,
    completedTasks: 312
  },
  {
    id: 'scout-theta',
    name: 'Scout Theta',
    tier: 'emergency',
    specialties: ['Backup Operations', 'Data Recovery', 'System Restore'],
    healthScore: 73,
    quotaUsage: { minute: '0/60', day: '45/15,000' },
    performance: { successRate: 81.7, consecutiveErrors: 1, avgResponseTime: 4.1 },
    isHealthy: true,
    isActive: false,
    completedTasks: 189
  }
];

const mockWorkflows: ActiveWorkflow[] = [
  {
    id: 'wf-001',
    name: 'E-commerce Platform Upgrade',
    status: 'coding',
    priority: 'high',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    estimatedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000),
    assignedModels: ['scout-alpha', 'scout-beta'],
    stages: [
      { name: 'Planning', status: 'completed', modelUsed: 'scout-alpha', duration: 1200, completedAt: '2 hours ago' },
      { name: 'Environment Setup', status: 'completed', modelUsed: 'scout-beta', duration: 800, completedAt: '1.5 hours ago' },
      { name: 'Code Implementation', status: 'running', modelUsed: 'scout-beta', progress: 67 },
      { name: 'Testing', status: 'pending' },
      { name: 'Deployment', status: 'pending' }
    ]
  },
  {
    id: 'wf-002', 
    name: 'API Performance Optimization',
    status: 'testing',
    priority: 'medium',
    startedAt: new Date(Date.now() - 45 * 60 * 1000),
    estimatedCompletion: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
    assignedModels: ['scout-delta', 'scout-epsilon'],
    stages: [
      { name: 'Analysis', status: 'completed', modelUsed: 'scout-delta', duration: 600, completedAt: '40 min ago' },
      { name: 'Optimization', status: 'completed', modelUsed: 'scout-delta', duration: 1800, completedAt: '15 min ago' },
      { name: 'Testing', status: 'running', modelUsed: 'scout-epsilon', progress: 34 },
      { name: 'Validation', status: 'pending' }
    ]
  }
];

export default function ScoutOrchestration() {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector(state => state.ui);
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedModel, setSelectedModel] = useState<ScoutModel | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'primary': return 'bg-green-500';
      case 'secondary': return 'bg-blue-500';
      case 'fallback': return 'bg-yellow-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'fallback': return 'outline';
      case 'emergency': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'running': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      case 'pending': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const activeModels = scoutModels.filter(model => model.isActive);
  const totalTasks = scoutModels.reduce((sum, model) => sum + model.completedTasks, 0);
  const avgHealthScore = scoutModels.reduce((sum, model) => sum + model.healthScore, 0) / scoutModels.length;

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-gradient-to-br from-sanctuary-bg via-sanctuary-surface to-sanctuary-accent/10 min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sanctuary-text mb-2">
              Scout Orchestration Center
            </h1>
            <p className="text-sanctuary-text/70">
              Monitor and manage your Gemini Scout network in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              <Activity className="w-4 h-4 mr-1" />
              {activeModels.length} Active
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Star className="w-4 h-4 mr-1" />
              {totalTasks.toLocaleString()} Completed
            </Badge>
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Cpu className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Active Models</p>
                  <p className="text-xl font-bold text-sanctuary-text">{activeModels.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Avg Health</p>
                  <p className="text-xl font-bold text-sanctuary-text">{avgHealthScore.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Timer className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Active Workflows</p>
                  <p className="text-xl font-bold text-sanctuary-text">{mockWorkflows.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Total Tasks</p>
                  <p className="text-xl font-bold text-sanctuary-text">{totalTasks.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Scout Models</TabsTrigger>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Scout Network Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {scoutModels.slice(0, 4).map((model) => (
                    <div 
                      key={model.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        model.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      )}
                      onClick={() => setSelectedModel(model)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{model.name}</h4>
                        <div className={cn("w-2 h-2 rounded-full", model.isActive ? "bg-green-500" : "bg-gray-400")} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Health</span>
                          <span>{model.healthScore}%</span>
                        </div>
                        <Progress value={model.healthScore} className="h-1" />
                        <p className="text-xs text-gray-600">{model.currentTask || 'Idle'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {[
                      { time: '2 min ago', action: 'Scout Alpha completed market analysis', type: 'success' },
                      { time: '5 min ago', action: 'Scout Beta started unit test generation', type: 'info' },
                      { time: '12 min ago', action: 'Workflow "API Optimization" entered testing phase', type: 'info' },
                      { time: '18 min ago', action: 'Scout Delta completed API integration', type: 'success' },
                      { time: '25 min ago', action: 'Scout Gamma activated for documentation task', type: 'info' },
                      { time: '32 min ago', action: 'Performance alert resolved automatically', type: 'warning' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-sanctuary-surface/50">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        )} />
                        <div className="flex-1">
                          <p className="text-sm text-sanctuary-text">{activity.action}</p>
                          <p className="text-xs text-sanctuary-text/60">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {scoutModels.map((model) => (
                <motion.div
                  key={model.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={cn(
                    "cursor-pointer transition-all",
                    selectedModel?.id === model.id ? "ring-2 ring-sanctuary-primary" : ""
                  )}
                  onClick={() => setSelectedModel(model)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-3 h-3 rounded-full", model.isActive ? "bg-green-500" : "bg-gray-400")} />
                          <div>
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <Badge variant={getTierBadgeVariant(model.tier)} className="mt-1">
                              {model.tier.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-sanctuary-text">{model.healthScore}%</p>
                          <p className="text-xs text-sanctuary-text/60">Health</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Performance</span>
                          <span>{model.performance.successRate}%</span>
                        </div>
                        <Progress value={model.performance.successRate} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-sanctuary-text/60">Response Time</p>
                          <p className="font-medium">{model.performance.avgResponseTime}s</p>
                        </div>
                        <div>
                          <p className="text-sanctuary-text/60">Completed Tasks</p>
                          <p className="font-medium">{model.completedTasks.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-sanctuary-text/60 mb-1">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {model.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {model.currentTask && (
                        <div className="pt-2 border-t border-sanctuary-border">
                          <p className="text-sm text-sanctuary-text/60">Current Task</p>
                          <p className="text-sm font-medium text-sanctuary-text">{model.currentTask}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            {mockWorkflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={() => setExpandedWorkflow(
                          expandedWorkflow === workflow.id ? null : workflow.id
                        )}
                      >
                        {expandedWorkflow === workflow.id ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </Button>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-sanctuary-text/60">
                          Started {workflow.startedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.priority === 'high' ? 'destructive' : 'secondary'}>
                        {workflow.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {workflow.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <AnimatePresence>
                  {expandedWorkflow === workflow.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {workflow.stages.map((stage, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-sanctuary-surface/30">
                              <div className="flex items-center gap-2">
                                {stage.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {stage.status === 'running' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                                {stage.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                {stage.status === 'pending' && <Clock className="w-4 h-4 text-gray-500" />}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sanctuary-text">{stage.name}</h4>
                                  {stage.modelUsed && (
                                    <Badge variant="outline" className="text-xs">
                                      {stage.modelUsed}
                                    </Badge>
                                  )}
                                </div>
                                
                                {stage.status === 'running' && stage.progress && (
                                  <div className="mt-2">
                                    <Progress value={stage.progress} className="h-2" />
                                    <p className="text-xs text-sanctuary-text/60 mt-1">{stage.progress}% complete</p>
                                  </div>
                                )}
                                
                                {stage.completedAt && (
                                  <p className="text-xs text-sanctuary-text/60 mt-1">
                                    Completed {stage.completedAt}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-sanctuary-border">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-sanctuary-text/60">Assigned Models:</span>
                            <div className="flex gap-1">
                              {workflow.assignedModels.map((modelId) => (
                                <Badge key={modelId} variant="secondary" className="text-xs">
                                  {modelId}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scoutModels.slice(0, 4).map((model) => (
                      <div key={model.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{model.name}</span>
                          <span>{model.performance.successRate}%</span>
                        </div>
                        <Progress value={model.performance.successRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scoutModels.slice(0, 4).map((model) => (
                      <div key={model.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{model.name}</span>
                          <span>{model.quotaUsage.day}</span>
                        </div>
                        <Progress 
                          value={
                            (parseInt(model.quotaUsage.day.split('/')[0].replace(',', '')) / 
                             parseInt(model.quotaUsage.day.split('/')[1].replace(',', ''))) * 100
                          } 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
