import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Settings, Play, Pause, Square, RefreshCw, Save, 
  Upload, Download, Trash2, Copy, ExternalLink, Eye, 
  EyeOff, Edit3, ChevronRight, ChevronDown, FileText, 
  Code, Database, Globe, Brain, Zap, Target, Award,
  GitBranch, Timer, Activity, TrendingUp, AlertCircle,
  CheckCircle, Loader2, Sparkles, Wand2, Cpu, Network
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'analyzer' | 'generator' | 'executor' | 'monitor';
  status: 'idle' | 'training' | 'active' | 'error';
  version: string;
  createdAt: Date;
  lastModified: Date;
  performance: {
    accuracy: number;
    speed: number;
    reliability: number;
  };
  capabilities: string[];
  dependencies: string[];
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    specialInstructions: string;
  };
  metrics: {
    totalRuns: number;
    successRate: number;
    avgExecutionTime: number;
    lastRun?: Date;
  };
}

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  template: Partial<Agent>;
}

const agentTemplates: AgentTemplate[] = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Analyzes code quality, finds bugs, suggests improvements',
    category: 'Development',
    icon: <Code className="w-5 h-5" />,
    template: {
      type: 'analyzer',
      capabilities: ['Code Analysis', 'Bug Detection', 'Best Practices', 'Security Review'],
      config: {
        model: 'gemini-2.5-pro',
        temperature: 0.1,
        maxTokens: 2000,
        specialInstructions: 'Focus on code quality, security vulnerabilities, and optimization opportunities.'
      }
    }
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Generates high-quality content for various purposes',
    category: 'Content',
    icon: <FileText className="w-5 h-5" />,
    template: {
      type: 'generator',
      capabilities: ['Content Writing', 'SEO Optimization', 'Brand Voice', 'Multi-format Output'],
      config: {
        model: 'gemini-2.5-pro',
        temperature: 0.7,
        maxTokens: 4000,
        specialInstructions: 'Create engaging, well-structured content that matches the specified tone and style.'
      }
    }
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Processes and analyzes data to extract insights',
    category: 'Analytics',
    icon: <Database className="w-5 h-5" />,
    template: {
      type: 'analyzer',
      capabilities: ['Data Processing', 'Statistical Analysis', 'Visualization', 'Report Generation'],
      config: {
        model: 'gemini-2.5-pro',
        temperature: 0.2,
        maxTokens: 3000,
        specialInstructions: 'Focus on accurate data interpretation and clear, actionable insights.'
      }
    }
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Tests APIs and validates responses automatically',
    category: 'Testing',
    icon: <Globe className="w-5 h-5" />,
    template: {
      type: 'executor',
      capabilities: ['API Testing', 'Response Validation', 'Load Testing', 'Error Handling'],
      config: {
        model: 'gemini-2.5-pro',
        temperature: 0.1,
        maxTokens: 1500,
        specialInstructions: 'Thoroughly test API endpoints and validate all response scenarios.'
      }
    }
  },
  {
    id: 'system-monitor',
    name: 'System Monitor',
    description: 'Monitors system health and performance metrics',
    category: 'Operations',
    icon: <Activity className="w-5 h-5" />,
    template: {
      type: 'monitor',
      capabilities: ['Health Monitoring', 'Alert Generation', 'Performance Tracking', 'Anomaly Detection'],
      config: {
        model: 'gemini-2.5-pro',
        temperature: 0.1,
        maxTokens: 1000,
        specialInstructions: 'Monitor system metrics and alert on anomalies or performance issues.'
      }
    }
  }
];

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Code Guardian',
    description: 'Advanced code review and security analysis agent',
    type: 'analyzer',
    status: 'active',
    version: '2.1.0',
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-20'),
    performance: { accuracy: 94, speed: 87, reliability: 96 },
    capabilities: ['Code Analysis', 'Security Review', 'Performance Optimization', 'Documentation'],
    dependencies: ['gemini-2.5-pro', 'static-analysis-tools'],
    config: {
      model: 'gemini-2.5-pro',
      temperature: 0.1,
      maxTokens: 2000,
      specialInstructions: 'Focus on security vulnerabilities and performance bottlenecks.'
    },
    metrics: {
      totalRuns: 1247,
      successRate: 94.2,
      avgExecutionTime: 2.3,
      lastRun: new Date('2024-01-20T14:30:00')
    }
  },
  {
    id: 'agent-002',
    name: 'Content Maestro',
    description: 'Creative content generation and optimization specialist',
    type: 'generator',
    status: 'idle',
    version: '1.8.2',
    createdAt: new Date('2024-01-10'),
    lastModified: new Date('2024-01-18'),
    performance: { accuracy: 91, speed: 93, reliability: 89 },
    capabilities: ['Content Creation', 'SEO Optimization', 'Brand Voice', 'Multi-language'],
    dependencies: ['gemini-2.5-pro', 'content-templates'],
    config: {
      model: 'gemini-2.5-pro',
      temperature: 0.7,
      maxTokens: 4000,
      specialInstructions: 'Create engaging content that resonates with the target audience.'
    },
    metrics: {
      totalRuns: 892,
      successRate: 91.7,
      avgExecutionTime: 3.1,
      lastRun: new Date('2024-01-19T16:45:00')
    }
  },
  {
    id: 'agent-003',
    name: 'API Sentinel',
    description: 'Comprehensive API testing and validation system',
    type: 'executor',
    status: 'training',
    version: '1.5.1',
    createdAt: new Date('2024-01-12'),
    lastModified: new Date('2024-01-19'),
    performance: { accuracy: 88, speed: 95, reliability: 92 },
    capabilities: ['API Testing', 'Load Testing', 'Security Testing', 'Documentation'],
    dependencies: ['gemini-2.5-pro', 'testing-framework'],
    config: {
      model: 'gemini-2.5-pro',
      temperature: 0.1,
      maxTokens: 1500,
      specialInstructions: 'Thoroughly test all API endpoints and edge cases.'
    },
    metrics: {
      totalRuns: 654,
      successRate: 88.3,
      avgExecutionTime: 1.8,
      lastRun: new Date('2024-01-19T12:20:00')
    }
  }
];

export default function AgentWorkbench() {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector(state => state.ui);
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/20';
      case 'training': return 'text-blue-500 bg-blue-500/20';
      case 'idle': return 'text-gray-500 bg-gray-500/20';
      case 'error': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'analyzer': return <Brain className="w-4 h-4" />;
      case 'generator': return <Wand2 className="w-4 h-4" />;
      case 'executor': return <Zap className="w-4 h-4" />;
      case 'monitor': return <Eye className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const handleCreateAgent = () => {
    if (!selectedTemplate || !newAgentName.trim()) return;
    
    // TODO: Implement agent creation logic
    console.log('Creating agent:', { name: newAgentName, description: newAgentDescription, template: selectedTemplate });
    
    setIsCreating(false);
    setNewAgentName('');
    setNewAgentDescription('');
    setSelectedTemplate(null);
  };

  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter(agent => agent.status === 'active').length;
  const avgPerformance = mockAgents.reduce((sum, agent) => 
    sum + (agent.performance.accuracy + agent.performance.speed + agent.performance.reliability) / 3, 0
  ) / mockAgents.length;

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-gradient-to-br from-sanctuary-bg via-sanctuary-surface to-sanctuary-accent/10 min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sanctuary-text mb-2">
              Agent Creation Workbench
            </h1>
            <p className="text-sanctuary-text/70">
              Design, train, and deploy self-improving AI agents
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                // TODO: Handle file import
                console.log('Importing agent:', e.target.files?.[0]);
              }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Cpu className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Total Agents</p>
                  <p className="text-xl font-bold text-sanctuary-text">{totalAgents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Active</p>
                  <p className="text-xl font-bold text-sanctuary-text">{activeAgents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-sanctuary-text/70">Avg Performance</p>
                  <p className="text-xl font-bold text-sanctuary-text">{avgPerformance.toFixed(1)}%</p>
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
                  <p className="text-sm text-sanctuary-text/70">Total Runs</p>
                  <p className="text-xl font-bold text-sanctuary-text">
                    {mockAgents.reduce((sum, agent) => sum + agent.metrics.totalRuns, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="w-6 h-6" />
                    <div>
                      <p className="font-medium">Create New Agent</p>
                      <p className="text-xs text-sanctuary-text/60">Build from scratch or template</p>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setSelectedTab('templates')}
                  >
                    <FileText className="w-6 h-6" />
                    <div>
                      <p className="font-medium">Browse Templates</p>
                      <p className="text-xs text-sanctuary-text/60">Pre-built agent templates</p>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6" />
                    <div>
                      <p className="font-medium">Import Agent</p>
                      <p className="text-xs text-sanctuary-text/60">Load existing configuration</p>
                    </div>
                  </Button>
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
                      { time: '5 min ago', action: 'Code Guardian completed security analysis', agent: 'Code Guardian', type: 'success' },
                      { time: '12 min ago', action: 'Content Maestro generated blog post', agent: 'Content Maestro', type: 'success' },
                      { time: '25 min ago', action: 'API Sentinel started training session', agent: 'API Sentinel', type: 'info' },
                      { time: '1 hour ago', action: 'New agent template created', agent: 'System', type: 'info' },
                      { time: '2 hours ago', action: 'Performance optimization completed', agent: 'Code Guardian', type: 'success' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-sanctuary-surface/50">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        )} />
                        <div className="flex-1">
                          <p className="text-sm text-sanctuary-text">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{activity.agent}</Badge>
                            <span className="text-xs text-sanctuary-text/60">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <div className="space-y-4">
              {mockAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => setExpandedAgent(
                            expandedAgent === agent.id ? null : agent.id
                          )}
                        >
                          {expandedAgent === agent.id ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          {getTypeIcon(agent.type)}
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <p className="text-sm text-sanctuary-text/60">{agent.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">v{agent.version}</Badge>
                        
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Play className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Run Agent</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Configure</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Export</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {expandedAgent === agent.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Performance Metrics */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sanctuary-text">Performance</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Accuracy</span>
                                    <span>{agent.performance.accuracy}%</span>
                                  </div>
                                  <Progress value={agent.performance.accuracy} className="h-2" />
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Speed</span>
                                    <span>{agent.performance.speed}%</span>
                                  </div>
                                  <Progress value={agent.performance.speed} className="h-2" />
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Reliability</span>
                                    <span>{agent.performance.reliability}%</span>
                                  </div>
                                  <Progress value={agent.performance.reliability} className="h-2" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Usage Statistics */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sanctuary-text">Usage Statistics</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-sanctuary-text/60">Total Runs</p>
                                  <p className="font-medium text-lg">{agent.metrics.totalRuns.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sanctuary-text/60">Success Rate</p>
                                  <p className="font-medium text-lg">{agent.metrics.successRate}%</p>
                                </div>
                                <div>
                                  <p className="text-sanctuary-text/60">Avg Execution</p>
                                  <p className="font-medium text-lg">{agent.metrics.avgExecutionTime}s</p>
                                </div>
                                <div>
                                  <p className="text-sanctuary-text/60">Last Run</p>
                                  <p className="font-medium text-lg">
                                    {agent.metrics.lastRun?.toLocaleTimeString() || 'Never'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Capabilities */}
                          <div className="mt-6">
                            <h4 className="font-medium text-sanctuary-text mb-2">Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                              {agent.capabilities.map((capability) => (
                                <Badge key={capability} variant="secondary">
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Configuration Preview */}
                          <div className="mt-6">
                            <h4 className="font-medium text-sanctuary-text mb-2">Configuration</h4>
                            <div className="bg-sanctuary-surface/30 rounded-lg p-3 text-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-sanctuary-text/60">Model:</span>
                                  <span className="ml-2">{agent.config.model}</span>
                                </div>
                                <div>
                                  <span className="text-sanctuary-text/60">Temperature:</span>
                                  <span className="ml-2">{agent.config.temperature}</span>
                                </div>
                                <div>
                                  <span className="text-sanctuary-text/60">Max Tokens:</span>
                                  <span className="ml-2">{agent.config.maxTokens}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsCreating(true);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sanctuary-primary/20 rounded-lg text-sanctuary-primary">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{template.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-sanctuary-text/70 mb-4">{template.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-sanctuary-text/60">Capabilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.template.capabilities?.slice(0, 3).map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                        {template.template.capabilities && template.template.capabilities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.template.capabilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAgents.map((agent) => (
                      <div key={agent.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{agent.name}</span>
                          <span>{((agent.performance.accuracy + agent.performance.speed + agent.performance.reliability) / 3).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(agent.performance.accuracy + agent.performance.speed + agent.performance.reliability) / 3} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg bg-sanctuary-surface/30">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(agent.type)}
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{agent.metrics.totalRuns}</p>
                          <p className="text-xs text-sanctuary-text/60">runs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Agent Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsCreating(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-sanctuary-surface border border-sanctuary-border rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-sanctuary-text mb-4">
                  {selectedTemplate ? `Create ${selectedTemplate.name}` : 'Create New Agent'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sanctuary-text mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      placeholder={selectedTemplate ? selectedTemplate.name : 'Enter agent name...'}
                      className="w-full p-2 bg-sanctuary-bg border border-sanctuary-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sanctuary-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-sanctuary-text mb-1">
                      Description
                    </label>
                    <Textarea
                      value={newAgentDescription}
                      onChange={(e) => setNewAgentDescription(e.target.value)}
                      placeholder={selectedTemplate ? selectedTemplate.description : 'Describe your agent...'}
                      className="w-full h-24 resize-none"
                    />
                  </div>
                  
                  {selectedTemplate && (
                    <div className="p-3 bg-sanctuary-bg border border-sanctuary-border rounded-lg">
                      <p className="text-sm font-medium text-sanctuary-text mb-2">Template Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.template.capabilities?.map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-6">
                  <Button onClick={handleCreateAgent} disabled={!newAgentName.trim()}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Agent
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
