import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bot, 
  Brain, 
  Sparkles, 
  Code, 
  Palette, 
  Zap, 
  Heart, 
  Search, 
  Settings, 
  Play,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  Edit,
  Eye,
  GitBranch,
  Star,
  Award,
  Cpu,
  Database,
  Globe,
  Shield,
  Wand2,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Layers,
  Network,
  Workflow
} from 'lucide-react'

// Mock data for existing agents
const existingAgents = [
  {
    id: 'scout_commander',
    name: 'Scout Commander',
    emoji: '🎯',
    description: 'Strategic planning and orchestration specialist',
    capabilities: ['planning', 'coordination', 'task_breakdown'],
    performance: 94,
    created: '2024-01-15',
    status: 'active',
    interactions: 1247
  },
  {
    id: 'research_specialist',
    name: 'Research Specialist',
    emoji: '🔍',
    description: 'Deep research and analysis expert',
    capabilities: ['research', 'analysis', 'data_synthesis'],
    performance: 91,
    created: '2024-01-10',
    status: 'active',
    interactions: 892
  },
  {
    id: 'creative_bear',
    name: 'Creative Bear',
    emoji: '🎨',
    description: 'Innovation and creative solutions specialist',
    capabilities: ['creativity', 'brainstorming', 'design'],
    performance: 89,
    created: '2024-01-20',
    status: 'active',
    interactions: 567
  }
]

const agentTemplates = [
  {
    id: 'custom',
    name: 'Custom Agent',
    icon: <Wand2 className="w-5 h-5" />,
    description: 'Build from scratch with full customization'
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Specialized in data analysis and insights'
  },
  {
    id: 'ui_designer',
    name: 'UI Designer',
    icon: <Palette className="w-5 h-5" />,
    description: 'Expert in user interface design and UX'
  },
  {
    id: 'api_specialist',
    name: 'API Specialist',
    icon: <Network className="w-5 h-5" />,
    description: 'API design, integration, and management expert'
  },
  {
    id: 'security_auditor',
    name: 'Security Auditor',
    icon: <Shield className="w-5 h-5" />,
    description: 'Security analysis and vulnerability assessment'
  },
  {
    id: 'workflow_optimizer',
    name: 'Workflow Optimizer',
    icon: <Workflow className="w-5 h-5" />,
    description: 'Process optimization and automation specialist'
  }
]

const capabilityOptions = [
  { id: 'reasoning', name: 'Complex Reasoning', icon: <Brain /> },
  { id: 'creativity', name: 'Creative Thinking', icon: <Sparkles /> },
  { id: 'code_generation', name: 'Code Generation', icon: <Code /> },
  { id: 'research', name: 'Research & Analysis', icon: <Search /> },
  { id: 'design', name: 'Design & UI', icon: <Palette /> },
  { id: 'optimization', name: 'Performance Optimization', icon: <Zap /> },
  { id: 'empathy', name: 'Emotional Intelligence', icon: <Heart /> },
  { id: 'data_analysis', name: 'Data Analysis', icon: <Database /> },
  { id: 'web_browsing', name: 'Web Research', icon: <Globe /> },
  { id: 'security', name: 'Security Analysis', icon: <Shield /> }
]

const personalityTraits = [
  { id: 'caring', name: 'Caring & Supportive', range: [0, 100] },
  { id: 'analytical', name: 'Analytical Thinking', range: [0, 100] },
  { id: 'creative', name: 'Creative & Innovative', range: [0, 100] },
  { id: 'efficient', name: 'Efficiency Focused', range: [0, 100] },
  { id: 'patient', name: 'Patient & Understanding', range: [0, 100] },
  { id: 'detail_oriented', name: 'Detail Oriented', range: [0, 100] }
]

const AgentCreationWorkbench = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [agentForm, setAgentForm] = useState({
    name: '',
    emoji: '🤖',
    description: '',
    specialization: '',
    systemPrompt: '',
    capabilities: [],
    preferredModels: [],
    personality: {
      caring: 70,
      analytical: 50,
      creative: 50,
      efficient: 60,
      patient: 80,
      detail_oriented: 60
    },
    neurodivergentOptimized: true,
    contextWindow: 100000,
    maxTokens: 4096,
    temperature: 0.7
  })
  const [creationProgress, setCreationProgress] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id)
    
    // Pre-fill form based on template
    const templateConfigs = {
      data_analyst: {
        name: 'Data Analysis Specialist',
        emoji: '📊',
        description: 'Expert in analyzing data patterns, creating insights, and generating reports',
        specialization: 'data_analysis_and_insights',
        capabilities: ['reasoning', 'data_analysis', 'research'],
        preferredModels: ['deep_thinker_primary', 'context_master_primary'],
        personality: { analytical: 90, detail_oriented: 85, efficient: 80 }
      },
      ui_designer: {
        name: 'UI/UX Design Expert',
        emoji: '🎨',
        description: 'Creative designer specializing in user interfaces and experiences',
        specialization: 'user_interface_design',
        capabilities: ['creativity', 'design', 'empathy'],
        preferredModels: ['creative_writer_primary', 'creative_writer_backup'],
        personality: { creative: 95, caring: 85, detail_oriented: 80 }
      },
      api_specialist: {
        name: 'API Integration Master',
        emoji: '🔌',
        description: 'Expert in API design, integration, and management',
        specialization: 'api_development_and_integration',
        capabilities: ['code_generation', 'reasoning', 'optimization'],
        preferredModels: ['deep_thinker_primary', 'speed_demon_primary'],
        personality: { analytical: 85, efficient: 90, detail_oriented: 95 }
      }
    }

    if (templateConfigs[template.id]) {
      setAgentForm(prev => ({
        ...prev,
        ...templateConfigs[template.id],
        personality: { ...prev.personality, ...templateConfigs[template.id].personality }
      }))
    }
  }

  const handleCapabilityToggle = (capabilityId) => {
    setAgentForm(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capabilityId)
        ? prev.capabilities.filter(c => c !== capabilityId)
        : [...prev.capabilities, capabilityId]
    }))
  }

  const handlePersonalityChange = (trait, value) => {
    setAgentForm(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [trait]: value[0]
      }
    }))
  }

  const createAgent = async () => {
    setIsCreating(true)
    setCreationProgress(0)

    // Simulate agent creation process
    const steps = [
      'Analyzing agent requirements...',
      'Generating system prompt...',
      'Configuring capabilities...',
      'Optimizing for neurodivergent users...',
      'Testing agent responses...',
      'Finalizing integration...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCreationProgress(((i + 1) / steps.length) * 100)
    }

    setIsCreating(false)
    setActiveTab('agents')
  }

  const AgentCard = ({ agent }) => (
    <Card className="neo-edge hover-glow cursor-pointer transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{agent.emoji}</div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">{agent.description}</CardDescription>
            </div>
          </div>
          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map(cap => (
            <Badge key={cap} variant="outline" className="text-xs">
              {cap.replace('_', ' ')}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Performance</span>
            <span className="text-primary-400">{agent.performance}%</span>
          </div>
          <Progress value={agent.performance} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{agent.interactions} interactions</span>
          <span>Created {agent.created}</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Test
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 text-4xl font-bold">
            <Wand2 className="w-10 h-10 text-primary-500" />
            <span className="bg-gradient-to-r from-primary-400 via-blue-400 to-silver-400 bg-clip-text text-transparent">
              Agent Creation Workbench
            </span>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design, build, and evolve AI agents that perfectly match your needs. 
            Create specialized assistants that understand your unique workflow.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 neo-edge">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Create Agent
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              My Agents
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Evolution Lab
            </TabsTrigger>
          </TabsList>

          {/* Create Agent Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Configuration */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="neo-edge">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Agent Configuration
                    </CardTitle>
                    <CardDescription>
                      Define your agent's core identity and capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Agent Name</Label>
                        <Input
                          id="name"
                          value={agentForm.name}
                          onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter agent name..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emoji">Emoji</Label>
                        <Input
                          id="emoji"
                          value={agentForm.emoji}
                          onChange={(e) => setAgentForm(prev => ({ ...prev, emoji: e.target.value }))}
                          placeholder="🤖"
                          className="text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={agentForm.description}
                        onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what your agent specializes in..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={agentForm.specialization}
                        onChange={(e) => setAgentForm(prev => ({ ...prev, specialization: e.target.value }))}
                        placeholder="e.g., data_analysis, creative_writing, code_review"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Capabilities */}
                <Card className="neo-edge">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      Capabilities
                    </CardTitle>
                    <CardDescription>
                      Select the core capabilities your agent should have
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {capabilityOptions.map(capability => (
                        <div
                          key={capability.id}
                          onClick={() => handleCapabilityToggle(capability.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            agentForm.capabilities.includes(capability.id)
                              ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                              : 'border-border hover:border-primary-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-primary-400">{capability.icon}</div>
                            <span className="text-sm font-medium">{capability.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personality Traits */}
                <Card className="neo-edge">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Personality Traits
                    </CardTitle>
                    <CardDescription>
                      Fine-tune your agent's personality for optimal user interaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {personalityTraits.map(trait => (
                      <div key={trait.id} className="space-y-2">
                        <div className="flex justify-between">
                          <Label>{trait.name}</Label>
                          <span className="text-sm text-muted-foreground">
                            {agentForm.personality[trait.id]}%
                          </span>
                        </div>
                        <Slider
                          value={[agentForm.personality[trait.id]]}
                          onValueChange={(value) => handlePersonalityChange(trait.id, value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Actions */}
              <div className="space-y-6">
                {/* Agent Preview */}
                <Card className="neo-edge">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Agent Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{agentForm.emoji}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{agentForm.name || 'Unnamed Agent'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {agentForm.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Capabilities</Label>
                      <div className="flex flex-wrap gap-1">
                        {agentForm.capabilities.map(cap => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Personality Profile</Label>
                      <div className="space-y-1">
                        {Object.entries(agentForm.personality).map(([trait, value]) => (
                          <div key={trait} className="flex justify-between text-xs">
                            <span className="capitalize">{trait.replace('_', ' ')}</span>
                            <span className="text-primary-400">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Creation Actions */}
                <Card className="neo-edge">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Switch
                        checked={agentForm.neurodivergentOptimized}
                        onCheckedChange={(checked) => 
                          setAgentForm(prev => ({ ...prev, neurodivergentOptimized: checked }))
                        }
                      />
                      <Label className="text-sm">Neurodivergent Optimized</Label>
                    </div>

                    {isCreating ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-sm font-medium mb-2">Creating Agent...</div>
                          <Progress value={creationProgress} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          onClick={createAgent}
                          className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500"
                          disabled={!agentForm.name || agentForm.capabilities.length === 0}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Create Agent
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Agents</h2>
              <Button className="bg-gradient-to-r from-primary-600 to-blue-600">
                <Bot className="w-4 h-4 mr-2" />
                Import Agent
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Agent Templates</h2>
              <p className="text-muted-foreground">
                Start with pre-configured templates and customize to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentTemplates.map(template => (
                <Card 
                  key={template.id}
                  className={`neo-edge hover-glow cursor-pointer transition-all duration-300 ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => {
                    handleTemplateSelect(template)
                    setActiveTab('create')
                  }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 mb-2">
                      {template.icon}
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Evolution Lab Tab */}
          <TabsContent value="evolution" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Agent Evolution Lab</h2>
              <p className="text-muted-foreground">
                Analyze agent performance and evolve them for better results
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="neo-edge">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center text-2xl font-bold text-primary-400">92.4%</div>
                  <div className="text-center text-sm text-muted-foreground">
                    Average Success Rate
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Satisfaction</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} />
                    <div className="flex justify-between text-sm">
                      <span>Response Quality</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} />
                    <div className="flex justify-between text-sm">
                      <span>Task Completion</span>
                      <span>96%</span>
                    </div>
                    <Progress value={96} />
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-edge">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Evolution Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">High Impact</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Increase empathy score by 15% to improve user satisfaction
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">Medium Impact</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add web browsing capability for better research
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">Low Impact</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Optimize response time by 200ms
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Apply Evolution
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AgentCreationWorkbench