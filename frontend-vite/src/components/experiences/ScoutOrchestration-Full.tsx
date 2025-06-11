import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { 
  ArrowLeft, 
  Bot, 
  Zap, 
  Layers, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Monitor, 
  Code2, 
  GitBranch, 
  Globe, 
  Database, 
  FileText, 
  Image, 
  Video, 
  Mic, 
  Terminal, 
  Sparkles, 
  Brain, 
  Network, 
  Cpu, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Eye, 
  Download, 
  Share, 
  Copy, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Save, 
  Upload,
  PanelLeftOpen,
  PanelRightOpen,
  Search,
  Filter,
  SortAsc,
  MoreHorizontal,
  Star,
  Heart,
  MessageSquare,
  Send,
  Paperclip,
  Command,
  Users
} from 'lucide-react';

// Types for Scout Orchestration
interface ScoutAgent {
  id: string;
  name: string;
  type: 'research' | 'creation' | 'analysis' | 'deployment' | 'optimization';
  status: 'idle' | 'working' | 'completed' | 'error';
  progress: number;
  currentTask?: string;
  specialties: string[];
  icon: React.ReactNode;
  color: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  agent?: ScoutAgent;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  estimatedDuration: number;
  dependencies: string[];
  outputs: WorkflowOutput[];
}

interface WorkflowOutput {
  id: string;
  type: 'file' | 'data' | 'api' | 'deployment' | 'report';
  name: string;
  size?: string;
  url?: string;
  preview?: string;
  status: 'generating' | 'ready' | 'error';
}

interface Orchestra {
  id: string;
  name: string;
  description: string;
  agents: ScoutAgent[];
  workflow: WorkflowStep[];
  status: 'idle' | 'running' | 'completed' | 'paused' | 'error';
  progress: number;
  startTime?: Date;
  estimatedCompletion?: Date;
}

const ScoutOrchestration: React.FC = () => {
  const { currentTheme } = useSelector((state: RootState) => state.theme);
  const [selectedView, setSelectedView] = useState<'dashboard' | 'workflow' | 'agents' | 'outputs'>('dashboard');
  const [selectedOrchestra, setSelectedOrchestra] = useState<string | null>(null);
  const [isOrchestraRunning, setIsOrchestraRunning] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25);
  const [rightPanelWidth, setRightPanelWidth] = useState(30);
  const [chatMessage, setChatMessage] = useState('');
  const [showAgentDetails, setShowAgentDetails] = useState<string | null>(null);
  const [orchestraFilter, setOrchestraFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Mock data for demonstration - in real app this would come from your backend
  const mockAgents: ScoutAgent[] = [
    {
      id: 'researcher-1',
      name: 'Research Scout Alpha',
      type: 'research',
      status: 'working',
      progress: 75,
      currentTask: 'Analyzing market trends for Q2 2025',
      specialties: ['Market Analysis', 'Data Mining', 'Competitor Research'],
      icon: <Search className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'creator-1',
      name: 'Creation Scout Beta',
      type: 'creation',
      status: 'idle',
      progress: 0,
      specialties: ['UI/UX Design', 'Content Creation', 'Code Generation'],
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'analyzer-1',
      name: 'Analysis Scout Gamma',
      type: 'analysis',
      status: 'completed',
      progress: 100,
      currentTask: 'Performance metrics analysis complete',
      specialties: ['Data Analysis', 'Performance Optimization', 'Pattern Recognition'],
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'deployer-1',
      name: 'Deployment Scout Delta',
      type: 'deployment',
      status: 'working',
      progress: 45,
      currentTask: 'Setting up production environment',
      specialties: ['CI/CD', 'Cloud Deployment', 'Infrastructure'],
      icon: <Globe className="w-4 h-4" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const mockOrchestras: Orchestra[] = [
    {
      id: 'ecommerce-build',
      name: 'E-commerce Platform Build',
      description: 'Complete e-commerce solution with payment integration',
      agents: mockAgents,
      workflow: [
        {
          id: 'step-1',
          title: 'Market Research',
          description: 'Analyze competitor platforms and user requirements',
          status: 'completed',
          progress: 100,
          estimatedDuration: 2,
          dependencies: [],
          outputs: [
            { id: 'research-1', type: 'report', name: 'Market Analysis Report.pdf', status: 'ready' }
          ]
        },
        {
          id: 'step-2',
          title: 'UI/UX Design',
          description: 'Create responsive design system and user interfaces',
          status: 'active',
          progress: 60,
          estimatedDuration: 4,
          dependencies: ['step-1'],
          outputs: [
            { id: 'design-1', type: 'file', name: 'Design System.figma', status: 'generating' }
          ]
        },
        {
          id: 'step-3',
          title: 'Backend Development',
          description: 'Build API endpoints and database architecture',
          status: 'pending',
          progress: 0,
          estimatedDuration: 6,
          dependencies: ['step-2'],
          outputs: []
        }
      ],
      status: 'running',
      progress: 55,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedCompletion: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
    }
  ];

  // Real-time progress simulation
  useEffect(() => {
    if (isOrchestraRunning) {
      const interval = setInterval(() => {
        // Simulate progress updates
        // In real app, this would be WebSocket updates from backend
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOrchestraRunning]);

  const handleStartOrchestra = (orchestraId: string) => {
    setSelectedOrchestra(orchestraId);
    setIsOrchestraRunning(true);
    // In real app: dispatch action to start orchestra
  };

  const handlePauseOrchestra = () => {
    setIsOrchestraRunning(false);
    // In real app: dispatch action to pause orchestra
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Orchestra Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockOrchestras.map((orchestra) => (
          <motion.div
            key={orchestra.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            onClick={() => handleStartOrchestra(orchestra.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{orchestra.name}</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                orchestra.status === 'running' ? 'bg-green-500/20 text-green-300' :
                orchestra.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {orchestra.status}
              </div>
            </div>
            
            <p className="text-white/70 mb-4">{orchestra.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Progress</span>
                <span>{orchestra.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${orchestra.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Agent Status */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {orchestra.agents.slice(0, 4).map((agent) => (
                  <div
                    key={agent.id}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${agent.color} flex items-center justify-center border-2 border-white/20`}
                    title={agent.name}
                  >
                    {agent.icon}
                  </div>
                ))}
                {orchestra.agents.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-xs text-white">
                    +{orchestra.agents.length - 4}
                  </div>
                )}
              </div>
              
              <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg transition-colors">
                {orchestra.status === 'running' ? 'Monitor' : 'Start'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Bot className="w-6 h-6" />, label: 'New Orchestra', color: 'from-purple-500 to-pink-500' },
          { icon: <Sparkles className="w-6 h-6" />, label: 'AI Templates', color: 'from-blue-500 to-cyan-500' },
          { icon: <Network className="w-6 h-6" />, label: 'Agent Network', color: 'from-green-500 to-emerald-500' },
          { icon: <BarChart3 className="w-6 h-6" />, label: 'Analytics', color: 'from-orange-500 to-red-500' }
        ].map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-white font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderWorkflow = () => {
    const selectedOrchestraData = mockOrchestras.find(o => o.id === selectedOrchestra);
    if (!selectedOrchestraData) return <div>Select an orchestra</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Workflow Progress</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOrchestraRunning(!isOrchestraRunning)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isOrchestraRunning 
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
              }`}
            >
              {isOrchestraRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isOrchestraRunning ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {selectedOrchestraData.workflow.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500/20' :
                    step.status === 'active' ? 'bg-blue-500/20' :
                    step.status === 'error' ? 'bg-red-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                     step.status === 'active' ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" /> :
                     step.status === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
                     <Clock className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">{step.progress}%</div>
                  <div className="text-white/60 text-sm">
                    ETA: {step.estimatedDuration}h
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      step.status === 'completed' ? 'from-green-500 to-emerald-500' :
                      step.status === 'active' ? 'from-blue-500 to-cyan-500' :
                      step.status === 'error' ? 'from-red-500 to-red-600' :
                      'from-gray-500 to-gray-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${step.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Outputs */}
              {step.outputs.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {step.outputs.map((output) => (
                    <div
                      key={output.id}
                      className="bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-white/60" />
                      <span className="text-white/80 text-sm">{output.name}</span>
                      {output.status === 'ready' && (
                        <button className="text-green-400 hover:text-green-300">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Scout Agent Network</h3>
        <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg transition-colors">
          Add Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAgents.map((agent) => (
          <motion.div
            key={agent.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${agent.color} flex items-center justify-center`}>
                  {agent.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{agent.name}</h4>
                  <span className="text-white/60 capitalize">{agent.type} Agent</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                agent.status === 'working' ? 'bg-blue-500/20 text-blue-300' :
                agent.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                agent.status === 'error' ? 'bg-red-500/20 text-red-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {agent.status}
              </div>
            </div>

            {agent.currentTask && (
              <div className="mb-4">
                <p className="text-white/80 text-sm mb-2">Current Task:</p>
                <p className="text-white font-medium">{agent.currentTask}</p>
              </div>
            )}

            {agent.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Progress</span>
                  <span>{agent.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${agent.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Scout Orchestration</h1>
                  <p className="text-white/60">AI Agent Coordination & Workflow Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-white/10 rounded-lg p-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <Monitor className="w-4 h-4" /> },
                  { id: 'workflow', label: 'Workflow', icon: <GitBranch className="w-4 h-4" /> },
                  { id: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" /> },
                  { id: 'outputs', label: 'Outputs', icon: <FileText className="w-4 h-4" /> }
                ].map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setSelectedView(view.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedView === view.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {view.icon}
                    <span className="hidden md:block">{view.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedView === 'dashboard' && renderDashboard()}
            {selectedView === 'workflow' && renderWorkflow()}
            {selectedView === 'agents' && renderAgents()}
            {selectedView === 'outputs' && (
              <div className="text-center text-white/60 py-20">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Outputs Coming Soon</h3>
                <p>File management and output preview will be available here.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <span>4 Agents Active</span>
            <span>2 Orchestras Running</span>
            <span>Memory: 2.1GB / 8GB</span>
          </div>
          
          <div className="text-white/60 text-sm">
            Powered by Mama Bear (Gemini 2.5) • Podplay Sanctuary v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutOrchestration;
