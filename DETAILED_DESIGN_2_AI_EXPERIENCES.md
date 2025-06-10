# 🤖 Detailed Design 2: AI Core Experiences

**Project:** Podplay Sanctuary Enhanced AI Model Friends Chat  
**Scope:** Agent Workbench, Execution Router, Enhanced Scout Orchestration  
**Backend Port:** 5001 (Flask backend already running)  
**Backend Endpoints:** All APIs already implemented and tested  

---

## 🎯 Backend Integration Specifications

### **Existing API Endpoints** 
```typescript
const AI_API_ENDPOINTS = {
  // Agent Workbench APIs (Port 5001)
  AGENT_WORKBENCH: {
    BASE: '/api/agent-workbench',
    TEMPLATES: '/api/agent-workbench/templates',
    AGENTS: '/api/agent-workbench/agents',
    CREATE: '/api/agent-workbench/agents/create',
    CREATE_CUSTOM: '/api/agent-workbench/agents/create-custom',
    DEPLOY: '/api/agent-workbench/agents/{id}/deploy',
    METRICS: '/api/agent-workbench/agents/{id}/metrics',
    LOGS: '/api/agent-workbench/agents/{id}/logs',
    STATUS: '/api/agent-workbench/agents/status',
    CLEANUP: '/api/agent-workbench/agents/cleanup'
  },
  
  // Execution Router APIs (Port 5001) 
  EXECUTION_ROUTER: {
    BASE: '/api/execution-router',
    ANALYZE: '/api/execution-router/analyze-task',
    ROUTE: '/api/execution-router/route-execution',
    E2B_EXECUTE: '/api/execution-router/execute-e2b',
    SCRAPYBARA_EXECUTE: '/api/execution-router/execute-scrapybara',
    SESSIONS: '/api/execution-router/sessions',
    METRICS: '/api/execution-router/metrics',
    STATUS: '/api/execution-router/status',
    HEALTH_CHECK: '/api/execution-router/health-check'
  },
  
  // Scout Workflow APIs (Port 5001)
  SCOUT_WORKFLOW: {
    BASE: '/api/scout-workflow',
    MODELS: '/api/scout-workflow/models',
    START: '/api/scout-workflow/start',
    STATUS: '/api/scout-workflow/status',
    STOP: '/api/scout-workflow/stop',
    METRICS: '/api/scout-workflow/metrics'
  }
};
```

### **WebSocket Endpoints**
```typescript
const WEBSOCKET_ENDPOINTS = {
  AGENT_WORKBENCH: 'ws://localhost:5001/ws/agent-workbench',
  EXECUTION_ROUTER: 'ws://localhost:5001/ws/execution-router', 
  SCOUT_ORCHESTRATOR: 'ws://localhost:5001/ws/scout-orchestrator'
};
```

---

## 🤖 Experience 1: Agent Creation Workbench

### **Main Workbench Interface**
```typescript
// /frontend/src/experiences/AgentWorkbench/index.tsx
interface AgentWorkbenchProps {
  agents: Agent[];
  templates: AgentTemplate[];
  selectedAgent: Agent | null;
  onAgentSelect: (agentId: string) => void;
  onAgentCreate: (config: AgentConfig) => void;
  onAgentDeploy: (agentId: string) => void;
}
```

### **User Flow Experience**
1. **Dashboard View** - Grid of agent cards with status indicators
2. **Template Selection** - Choose from 4 pre-built templates or custom
3. **Creation Wizard** - Multi-step agent configuration 
4. **Testing Sandbox** - Test agent capabilities before deployment
5. **Deployment** - Deploy to E2B or Scrapybara environments
6. **Monitoring** - Real-time performance and usage analytics

### **Dashboard Layout**
```typescript
// Main dashboard with agent cards
interface WorkbenchDashboardProps {
  agents: Agent[];
  onCreateNew: () => void;
  onAgentAction: (agentId: string, action: AgentAction) => void;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

// Agent card design
interface AgentCardProps {
  agent: Agent;
  showMetrics: boolean;
  onEdit: () => void;
  onDeploy: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
}

// Features per card:
// - Agent avatar with personality indicator
// - Status badge (Draft, Testing, Deployed, Error, Archived)
// - Performance metrics (success rate, response time)
// - Quick action buttons
// - Last activity timestamp
// - Resource usage indicator
```

### **Template Selection Interface**
```typescript
interface TemplatesSelectorProps {
  templates: AgentTemplate[];
  onTemplateSelect: (template: AgentTemplate) => void;
  onCustomCreate: () => void;
}

// 4 Default Templates with rich visuals:
const DEFAULT_TEMPLATES = {
  research_agent: {
    id: 'research_agent',
    name: 'Research Specialist',
    description: 'Deep research and analysis with multi-source verification',
    icon: '🔬',
    color: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
    capabilities: [
      'Web research and fact-checking',
      'Academic paper analysis', 
      'Data synthesis and reporting',
      'Citation management',
      'Multi-language research'
    ],
    complexity: 'intermediate',
    estimatedSetupTime: '3-5 minutes',
    resourceRequirements: 'Medium',
    useCase: 'Perfect for academic research, market analysis, and fact verification tasks'
  },
  
  ui_ux_agent: {
    id: 'ui_ux_agent', 
    name: 'UI/UX Designer',
    description: 'Creative design assistance with user experience focus',
    icon: '🎨',
    color: 'linear-gradient(135deg, #8E24AA 0%, #AB47BC 100%)',
    capabilities: [
      'Design system creation',
      'User interface mockups',
      'Accessibility auditing',
      'Design pattern recommendations',
      'Color theory and typography'
    ],
    complexity: 'beginner',
    estimatedSetupTime: '2-3 minutes',
    resourceRequirements: 'Low',
    useCase: 'Ideal for design feedback, UI improvements, and creative brainstorming'
  },
  
  api_agent: {
    id: 'api_agent',
    name: 'API Developer',
    description: 'Backend development and API integration specialist',
    icon: '⚡',
    color: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)',
    capabilities: [
      'REST API design and testing',
      'Database schema optimization',
      'Authentication implementation',
      'Performance optimization',
      'Documentation generation'
    ],
    complexity: 'advanced',
    estimatedSetupTime: '5-8 minutes', 
    resourceRequirements: 'High',
    useCase: 'Perfect for backend development, API integration, and system architecture'
  },
  
  security_agent: {
    id: 'security_agent',
    name: 'Security Analyst',
    description: 'Cybersecurity analysis and vulnerability assessment',
    icon: '🛡️',
    color: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
    capabilities: [
      'Security vulnerability scanning',
      'Code security analysis',
      'Penetration testing guidance',
      'Compliance checking',
      'Incident response planning'
    ],
    complexity: 'advanced',
    estimatedSetupTime: '7-10 minutes',
    resourceRequirements: 'High',
    useCase: 'Essential for security audits, vulnerability assessments, and compliance'
  }
};
```

### **Agent Creation Wizard**
```typescript
interface AgentCreationWizardProps {
  selectedTemplate?: AgentTemplate;
  onAgentCreate: (config: AgentConfig) => void;
  onCancel: () => void;
  mamaBearAssistance: boolean;
}

// 5-Step Wizard Process:
const WIZARD_STEPS = {
  step1: {
    id: 'basic_info',
    title: 'Basic Information',
    description: 'Name, description, and personality settings',
    components: [
      'AgentNameInput',
      'DescriptionTextarea', 
      'PersonalitySliders',
      'AvatarSelector'
    ]
  },
  
  step2: {
    id: 'capabilities',
    title: 'Capabilities & Skills',
    description: 'Define what your agent can do',
    components: [
      'CapabilitySelector',
      'SpecializedToolsPicker',
      'ModelPreferenceSelector',
      'LanguageSupport'
    ]
  },
  
  step3: {
    id: 'configuration', 
    title: 'Environment & Resources',
    description: 'Configure execution environment and limits',
    components: [
      'EnvironmentSelector',
      'ResourceLimitSliders',
      'CommunicationStylePicker',
      'SecuritySettings'
    ]
  },
  
  step4: {
    id: 'testing',
    title: 'Test & Validate', 
    description: 'Test your agent before deployment',
    components: [
      'TestScenarioRunner',
      'CapabilityValidator',
      'PerformanceBenchmark',
      'SecurityAudit'
    ]
  },
  
  step5: {
    id: 'deployment',
    title: 'Deploy & Monitor',
    description: 'Deploy and set up monitoring',
    components: [
      'DeploymentEnvironmentSelector',
      'MonitoringSetup',
      'AlertConfiguration',
      'AccessControlSettings'
    ]
  }
};
```

### **Agent Performance Monitoring**
```typescript
interface AgentMetricsViewProps {
  agentId: string;
  metrics: PerformanceMetrics;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onExportMetrics: () => void;
}

interface PerformanceMetrics {
  // Execution Metrics
  totalExecutions: number;
  successRate: number;
  averageResponseTime: number;
  averageCost: number;
  
  // Resource Usage
  cpuUsage: TimeSeries;
  memoryUsage: TimeSeries;
  networkUsage: TimeSeries;
  
  // Quality Metrics
  userSatisfaction: number;
  taskCompletionRate: number;
  errorRate: number;
  
  // Usage Patterns
  peakUsageHours: number[];
  mostCommonTaskTypes: string[];
  averageSessionDuration: number;
}

// Metrics visualization components:
// - Real-time performance charts
// - Resource usage heatmaps  
// - Success rate trends
// - Cost analysis graphs
// - User satisfaction scores
// - Comparative performance vs other agents
```

---

## ⚡ Experience 2: Intelligent Execution Router

### **Router Dashboard Interface**
```typescript
// /frontend/src/experiences/ExecutionRouter/index.tsx
interface ExecutionRouterProps {
  currentTask: string;
  taskAnalysis: TaskAnalysis | null;
  activeSessions: ExecutionSession[];
  routingHistory: RoutingDecision[];
  environmentStatus: EnvironmentStatus;
}
```

### **User Flow Experience**
1. **Task Input** - Submit task for complexity analysis
2. **Analysis Visualization** - See real-time complexity scoring
3. **Routing Decision** - View AI recommendation with explanations
4. **Manual Override** - Option to manually select environment
5. **Execution Monitoring** - Track execution in real-time
6. **Results Analysis** - View performance and cost metrics

### **Task Analysis Panel**
```typescript
interface TaskAnalysisPanelProps {
  task: string;
  onTaskChange: (task: string) => void;
  onAnalyze: () => void;
  analysis: TaskAnalysis | null;
  isAnalyzing: boolean;
}

interface TaskAnalysis {
  task_id: string;
  complexity_score: number; // 1-10 scale with detailed breakdown
  complexity_factors: {
    computational_complexity: number;
    time_sensitivity: number;
    resource_requirements: number;
    security_requirements: number;
    integration_complexity: number;
  };
  estimated_duration: number;
  estimated_cost: {
    e2b_cost: number;
    scrapybara_cost: number;
    savings_percentage: number;
  };
  recommended_environment: 'e2b' | 'scrapybara';
  confidence_level: number;
  routing_explanation: string;
  alternative_recommendations: AlternativeOption[];
}

// Visual complexity meter with color coding:
// 1-3: Green (Simple) - E2B recommended
// 4-6: Yellow (Medium) - Analysis needed  
// 7-10: Red (Complex) - Scrapybara recommended
```

### **Routing Intelligence Visualizer**
```typescript
interface RoutingVisualizerProps {
  analysis: TaskAnalysis;
  mamaBearInsights: MamaBearInsight[];
  decisionTree: DecisionNode[];
  onInsightRequest: () => void;
}

interface MamaBearInsight {
  type: 'explanation' | 'suggestion' | 'warning' | 'optimization';
  title: string;
  content: string;
  confidence: number;
  actionable: boolean;
  action?: string;
}

// Mama Bear Avatar Integration:
// - Animated avatar explaining routing decisions
// - Contextual tips based on task type
// - Learning from user feedback
// - Proactive optimization suggestions
// - Voice explanations (optional)

// Decision tree visualization:
// - Interactive flowchart showing decision logic
// - Hover explanations for each decision point
// - Historical accuracy tracking
// - User feedback integration
```

### **Environment Status Monitor**
```typescript
interface EnvironmentStatusProps {
  e2bStatus: EnvironmentHealth;
  scrapybaraStatus: EnvironmentHealth;
  onHealthCheck: (env: 'e2b' | 'scrapybara') => void;
  onEnvironmentConfig: (env: string) => void;
}

interface EnvironmentHealth {
  status: 'healthy' | 'degraded' | 'error' | 'maintenance';
  responseTime: number;
  capacity: {
    current: number;
    maximum: number;
    percentage: number;
  };
  queueLength: number;
  errorRate: number;
  lastHealthCheck: string;
  uptime: number;
  activeInstances: number;
}

// Status visualization:
// - Real-time health indicators
// - Capacity gauges with warnings
// - Response time charts
// - Queue length monitoring
// - Historical availability graphs
```

### **Session Monitoring Interface**
```typescript
interface SessionMonitorProps {
  sessions: ExecutionSession[];
  selectedSession: string | null;
  onSessionSelect: (id: string) => void;
  onSessionCancel: (id: string) => void;
  onSessionRetry: (id: string) => void;
}

interface ExecutionSession {
  session_id: string;
  task_description: string;
  environment: 'e2b' | 'scrapybara';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  start_time: string;
  estimated_completion: string;
  resource_usage: ResourceUsage;
  cost_so_far: number;
  logs: LogEntry[];
  result?: ExecutionResult;
}

// Session card features:
// - Real-time progress bars
// - Live resource usage metrics
// - Cost tracking with estimates
// - Log streaming
// - Cancel/retry controls
// - Result preview
```

---

## 🔍 Experience 3: Enhanced Scout Orchestration

### **Orchestrator Dashboard**
```typescript
// /frontend/src/experiences/GeminiOrchestrator/index.tsx  
interface GeminiOrchestratorProps {
  models: GeminiModel[];
  activeWorkflows: WorkflowExecution[];
  quotaStatus: QuotaStatus;
  orchestrationRules: OrchestrationRule[];
}
```

### **8-Model Orchestration Visualization**
```typescript
interface ModelOrchestrationViewProps {
  models: GeminiModel[];
  onModelSelect: (modelId: string) => void;
  onModelToggle: (modelId: string, enabled: boolean) => void;
  onWorkflowStart: (config: WorkflowConfig) => void;
}

// 8 Gemini Models with distinct visualizations:
const GEMINI_MODELS = {
  primary: {
    id: 'gemini-2.5-pro-preview-06-05',
    name: 'Gemini 2.5 Pro (06-05)',
    tier: 'primary',
    icon: '💎',
    color: '#1E88E5',
    capabilities: ['Reasoning', 'Analysis', 'Code', 'Creative'],
    maxTokens: 2000000,
    status: 'healthy'
  },
  
  primary_alt: {
    id: 'gemini-2.5-pro-preview-05-06', 
    name: 'Gemini 2.5 Pro (05-06)',
    tier: 'primary',
    icon: '💠',
    color: '#1565C0',
    capabilities: ['Reasoning', 'Analysis', 'Code', 'Creative'],
    maxTokens: 2000000,
    status: 'healthy'
  },
  
  flash_primary: {
    id: 'gemini-2.5-flash-preview-06-05',
    name: 'Gemini 2.5 Flash (06-05)',
    tier: 'secondary', 
    icon: '⚡',
    color: '#FF6F00',
    capabilities: ['Speed', 'Efficiency', 'Quick Tasks'],
    maxTokens: 1000000,
    status: 'healthy'
  },
  
  flash_alt: {
    id: 'gemini-2.5-flash-preview-05-06',
    name: 'Gemini 2.5 Flash (05-06)',
    tier: 'secondary',
    icon: '🔥',
    color: '#FF8F00', 
    capabilities: ['Speed', 'Efficiency', 'Quick Tasks'],
    maxTokens: 1000000,
    status: 'healthy'
  },
  
  thinking: {
    id: 'gemini-2.5-thinking-preview',
    name: 'Gemini 2.5 Thinking',
    tier: 'fallback',
    icon: '🧠',
    color: '#8E24AA',
    capabilities: ['Deep Reasoning', 'Complex Analysis'],
    maxTokens: 200000,
    status: 'healthy'
  },
  
  flash_thinking: {
    id: 'gemini-2.5-flash-thinking-preview',
    name: 'Flash Thinking',
    tier: 'fallback',
    icon: '💭', 
    color: '#AB47BC',
    capabilities: ['Fast Reasoning', 'Quick Decisions'],
    maxTokens: 150000,
    status: 'healthy'
  },
  
  legacy_pro: {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    tier: 'emergency',
    icon: '🔧',
    color: '#43A047',
    capabilities: ['Reliability', 'Fallback', 'Stability'],
    maxTokens: 2000000,
    status: 'healthy'
  },
  
  legacy_flash: {
    id: 'gemini-1.5-flash-latest',
    name: 'Gemini 1.5 Flash', 
    tier: 'emergency',
    icon: '🛡️',
    color: '#66BB6A',
    capabilities: ['Backup', 'Emergency', 'Basic Tasks'],
    maxTokens: 1000000,
    status: 'healthy'
  }
};

// Model grid layout with tiers:
// Primary Tier: 2 models (main workhorses)
// Secondary Tier: 2 flash models (speed tasks)  
// Fallback Tier: 2 thinking models (complex reasoning)
// Emergency Tier: 2 legacy models (backup)
```

### **Quota Management Dashboard**
```typescript
interface QuotaManagementProps {
  quotaStatus: QuotaStatus;
  usageHistory: UsageData[];
  predictions: UsagePrediction[];
  onQuotaAlert: (threshold: number) => void;
  onOptimizationSuggestion: () => void;
}

interface QuotaStatus {
  daily_quota: {
    total: number;
    used: number;
    remaining: number;
    percentage: number;
    reset_time: string;
  };
  
  per_model_usage: {
    [modelId: string]: {
      requests: number;
      tokens: number;
      cost: number;
      percentage: number;
    };
  };
  
  rate_limits: {
    requests_per_minute: number;
    tokens_per_minute: number;
    current_usage: number;
  };
  
  alerts: QuotaAlert[];
}

// Quota visualization features:
// - Real-time usage gauges
// - Model-specific breakdown charts
// - Predictive usage forecasting
// - Optimization recommendations
// - Alert configuration
// - Cost tracking and budgeting
```

### **Workflow Execution Monitor**
```typescript
interface WorkflowMonitorProps {
  workflows: WorkflowExecution[];
  onWorkflowPause: (id: string) => void;
  onWorkflowResume: (id: string) => void;
  onWorkflowCancel: (id: string) => void;
  onWorkflowDetails: (id: string) => void;
}

interface WorkflowExecution {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'queued';
  progress: WorkflowProgress;
  models_involved: string[];
  start_time: string;
  estimated_completion: string;
  resource_usage: ResourceUsage;
  cost_tracking: CostTracking;
  performance_metrics: WorkflowMetrics;
}

// Workflow visualization:
// - Progress timeline with model handoffs
// - Resource usage per model
// - Cost breakdown by model
// - Performance metrics
// - Error tracking and recovery
// - Real-time status updates
```

---

## 🔧 Advanced Integration Features

### **Cross-Experience Communication**
```typescript
// Inter-experience communication system
interface ExperienceMessage {
  source: 'agent-workbench' | 'execution-router' | 'scout-orchestrator';
  target: 'agent-workbench' | 'execution-router' | 'scout-orchestrator';
  type: 'agent-deployed' | 'task-routed' | 'workflow-started' | 'quota-alert';
  data: any;
  timestamp: string;
}

// Example workflows:
// 1. Create agent → Test in router → Deploy with scout models
// 2. Router recommends agent creation for recurring task types
// 3. Scout quota alerts trigger router environment preferences  
// 4. Agent performance metrics influence router decisions
```

### **Unified Performance Analytics**
```typescript
interface UnifiedAnalyticsProps {
  agentMetrics: AgentPerformanceData[];
  routerMetrics: RouterPerformanceData[];
  scoutMetrics: ScoutPerformanceData[];
  timeRange: TimeRange;
  onCrossAnalysis: () => void;
}

// Cross-system analytics:
// - Agent performance vs routing decisions
// - Scout model usage vs agent deployments
// - Cost optimization across all systems
// - Resource usage correlation analysis
// - Performance bottleneck identification
```

### **Real-Time WebSocket Integration**
```typescript
// Multi-endpoint WebSocket manager
const useMultiWebSocket = () => {
  const [connections, setConnections] = useState<{
    agentWorkbench: WebSocket | null;
    executionRouter: WebSocket | null;
    scoutOrchestrator: WebSocket | null;
  }>({
    agentWorkbench: null,
    executionRouter: null, 
    scoutOrchestrator: null
  });

  useEffect(() => {
    // Establish connections to all AI experience WebSockets
    const agentWS = new WebSocket('ws://localhost:5001/ws/agent-workbench');
    const routerWS = new WebSocket('ws://localhost:5001/ws/execution-router');
    const scoutWS = new WebSocket('ws://localhost:5001/ws/scout-orchestrator');

    // Handle messages and distribute to appropriate components
    agentWS.onmessage = (event) => handleAgentMessage(JSON.parse(event.data));
    routerWS.onmessage = (event) => handleRouterMessage(JSON.parse(event.data));
    scoutWS.onmessage = (event) => handleScoutMessage(JSON.parse(event.data));

    setConnections({
      agentWorkbench: agentWS,
      executionRouter: routerWS,
      scoutOrchestrator: scoutWS
    });

    return () => {
      agentWS.close();
      routerWS.close(); 
      scoutWS.close();
    };
  }, []);

  return connections;
};
```

---

## 📱 Responsive Design Adaptations

### **Mobile Experience Optimizations**
```typescript
const MOBILE_ADAPTATIONS = {
  agent_workbench: {
    layout: 'single_column',
    navigation: 'bottom_tabs',
    cards: 'swipeable_carousel',
    creation_wizard: 'step_by_step_modal',
    metrics: 'condensed_view'
  },
  
  execution_router: {
    layout: 'stacked_panels',
    task_input: 'bottom_sheet',
    analysis: 'expandable_cards',
    monitoring: 'tab_based',
    status: 'notification_style'
  },
  
  scout_orchestrator: {
    layout: 'accordion_style',
    model_grid: '2x4_grid',
    quota: 'summary_cards',
    workflows: 'timeline_view',
    controls: 'floating_action_button'
  }
};
```

---

## 🚀 File Structure

```
frontend/src/experiences/
├── AgentWorkbench/
│   ├── index.tsx                          # Main workbench interface
│   ├── components/
│   │   ├── WorkbenchDashboard.tsx         # Agent grid dashboard
│   │   ├── AgentCard.tsx                  # Individual agent display
│   │   ├── TemplateSelector.tsx           # Template selection grid
│   │   ├── CreationWizard/
│   │   │   ├── index.tsx                  # Wizard container
│   │   │   ├── BasicInfoStep.tsx          # Step 1: Basic details
│   │   │   ├── CapabilitiesStep.tsx       # Step 2: Capabilities
│   │   │   ├── ConfigurationStep.tsx      # Step 3: Configuration
│   │   │   ├── TestingStep.tsx            # Step 4: Testing
│   │   │   └── DeploymentStep.tsx         # Step 5: Deployment
│   │   ├── AgentMetrics.tsx               # Performance monitoring
│   │   ├── TestingSandbox.tsx             # Agent testing interface
│   │   └── DeploymentPanel.tsx            # Deployment management
│   └── hooks/
│       ├── useAgents.tsx                  # Agent data management
│       ├── useAgentMetrics.tsx            # Performance data
│       ├── useAgentTesting.tsx            # Testing utilities
│       └── useAgentDeployment.tsx         # Deployment logic
│
├── ExecutionRouter/
│   ├── index.tsx                          # Main router interface
│   ├── components/
│   │   ├── RouterDashboard.tsx            # Main dashboard
│   │   ├── TaskAnalysisPanel.tsx          # Task complexity analysis
│   │   ├── RoutingVisualizer.tsx          # Decision visualization
│   │   ├── EnvironmentStatus.tsx          # E2B/Scrapybara status
│   │   ├── SessionMonitor.tsx             # Active session tracking
│   │   ├── CostOptimization.tsx           # Cost analysis
│   │   └── ManualRouting.tsx              # Manual override controls
│   └── hooks/
│       ├── useTaskAnalysis.tsx            # Task analysis logic
│       ├── useExecutionSessions.tsx       # Session management
│       ├── useRouterMetrics.tsx           # Performance metrics
│       └── useEnvironmentHealth.tsx       # Environment monitoring
│
├── GeminiOrchestrator/
│   ├── index.tsx                          # Main orchestrator interface
│   ├── components/
│   │   ├── OrchestratorDashboard.tsx      # Main dashboard
│   │   ├── ModelGrid.tsx                  # 8-model visualization
│   │   ├── QuotaManagement.tsx            # Quota tracking
│   │   ├── WorkflowMonitor.tsx            # Workflow execution
│   │   ├── ModelStatusCard.tsx            # Individual model status
│   │   └── OrchestrationRules.tsx         # Rule configuration
│   └── hooks/
│       ├── useGeminiModels.tsx            # Model data management
│       ├── useQuotaTracking.tsx           # Quota monitoring
│       ├── useWorkflowExecution.tsx       # Workflow management
│       └── useOrchestrationRules.tsx      # Rule management
│
└── shared/
    ├── components/
    │   ├── MamaBearAvatar.tsx             # Shared avatar component
    │   ├── PerformanceChart.tsx           # Shared metrics visualization
    │   ├── StatusIndicator.tsx            # Health status displays
    │   └── ResourceUsageGauge.tsx         # Resource monitoring
    └── hooks/
        ├── useWebSocketManager.tsx        # Multi-WS management
        ├── usePerformanceMetrics.tsx      # Shared metrics logic
        └── useCrossExperienceComm.tsx     # Inter-experience messaging
```

---

## ✅ Implementation Checklist

### **Phase 1: Agent Workbench**
- [ ] Build agent dashboard with card grid
- [ ] Implement 4 template selection system
- [ ] Create 5-step creation wizard
- [ ] Add testing sandbox with validation
- [ ] Build deployment management interface
- [ ] Integrate real-time performance monitoring

### **Phase 2: Execution Router**  
- [ ] Build task analysis interface
- [ ] Implement routing visualization with Mama Bear
- [ ] Create environment status monitoring
- [ ] Add session tracking and management
- [ ] Build cost optimization analytics
- [ ] Implement manual routing controls

### **Phase 3: Scout Orchestrator**
- [ ] Build 8-model visualization grid
- [ ] Implement quota management dashboard
- [ ] Create workflow execution monitoring
- [ ] Add orchestration rule configuration
- [ ] Build cross-model performance analytics
- [ ] Integrate predictive quota management

### **Phase 4: Integration**
- [ ] Implement cross-experience communication
- [ ] Build unified analytics dashboard
- [ ] Add WebSocket integration for all experiences
- [ ] Create mobile responsive adaptations
- [ ] Implement accessibility compliance
- [ ] Add comprehensive error handling

This detailed design provides complete specifications for implementing all three core AI experiences with full backend integration and cross-system communication capabilities.
