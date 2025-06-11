"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/cn"
import {
  Search,
  Brain,
  TrendingUp,
  BookOpen,
  History,
  Filter,
  Download,
  Share2,
  Star,
  Clock,
  Zap,
  Settings,
  Globe,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  Users,
  ArrowRight,
  Eye,
  Save,
  Target,
  Database,
  Lightbulb,
  Network,
  Sparkles,
  Activity,
  PlusCircle,
  Archive,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus
} from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"
import { Progress } from "../ui/progress"

// 🎯 Core Types
interface ResearchQuery {
  id: string
  query: string
  depth: "search" | "deep" | "deep_deep"
  status: "planning" | "researching" | "synthesizing" | "complete" | "failed"
  timestamp: Date
  estimatedTime: number
  tags: string[]
  priority: "low" | "medium" | "high"
  results?: any
}

interface CollaborativeSession {
  id: string
  claudeModel: string
  geminiModel: string
  currentStatus: "claude_thinking" | "gemini_thinking" | "synthesizing" | "complete"
  progress: number
  liveUpdates: LiveUpdate[]
  masterAnswer: string
  consensus: number
}

interface LiveUpdate {
  id: string
  model: "claude" | "gemini"
  type: "thinking" | "researching" | "analyzing" | "finding" | "insight"
  message: string
  timestamp: Date
  progress: number
}

interface ResearchSource {
  id: string
  title: string
  url: string
  snippet: string
  relevance: number
  foundBy: "claude" | "gemini"
}

interface DeepResearchLibraryProps {
  className?: string
  neurodivergentMode?: boolean
  theme?: {
    background: string
    particles: string
  }
}

export default function DeepResearchLibrary({
  className,
  neurodivergentMode = false,
  theme = {
    background: "from-slate-900 via-gray-900 to-black",
    particles: "#8B5CF6"
  }
}: DeepResearchLibraryProps) {
  // 🌟 Core State
  const [currentQuery, setCurrentQuery] = React.useState("")
  const [selectedDepth, setSelectedDepth] = React.useState<"search" | "deep" | "deep_deep">("deep")
  const [selectedModels, setSelectedModels] = React.useState<string[]>(["claude", "gemini"])
  const [isResearching, setIsResearching] = React.useState(false)
  const [activeView, setActiveView] = React.useState<"home" | "collaborative" | "history">("home")
  const [researchQueries, setResearchQueries] = React.useState<ResearchQuery[]>([])
  const [activeQuery, setActiveQuery] = React.useState<ResearchQuery | null>(null)
  const [showSettings, setShowSettings] = React.useState(false)

  // 🤝 Collaborative State
  const [collaborativeSession, setCollaborativeSession] = React.useState<CollaborativeSession | null>(null)
  const [showLiveTicker, setShowLiveTicker] = React.useState(true)
  const [tickerMessages, setTickerMessages] = React.useState<string[]>([])
  const [researchSources, setResearchSources] = React.useState<ResearchSource[]>([])

  // 📊 Mock Data
  const mockLiveUpdates: LiveUpdate[] = [
    {
      id: "claude_1",
      model: "claude",
      type: "thinking",
      message: "Breaking down the research query into core components...",
      timestamp: new Date(),
      progress: 10
    },
    {
      id: "gemini_1", 
      model: "gemini",
      type: "researching",
      message: "Scanning latest documentation and best practices...",
      timestamp: new Date(),
      progress: 15
    },
    {
      id: "claude_2",
      model: "claude",
      type: "analyzing", 
      message: "Identifying key implementation patterns and potential challenges...",
      timestamp: new Date(),
      progress: 35
    },
    {
      id: "gemini_2",
      model: "gemini",
      type: "finding",
      message: "Found 12 relevant case studies and 8 optimization techniques...",
      timestamp: new Date(),
      progress: 45
    }
  ]

  // 🎛️ Configuration
  const depthConfig = {
    search: {
      name: "Quick Search",
      description: "Fast information gathering (30s-2min)",
      icon: <Search className="w-4 h-4" />,
      color: "text-green-400",
      estimatedTime: 90
    },
    deep: {
      name: "Deep Research", 
      description: "Comprehensive analysis (5-15min)",
      icon: <Brain className="w-4 h-4" />,
      color: "text-blue-400",
      estimatedTime: 600
    },
    deep_deep: {
      name: "Deep Deep Research",
      description: "Exhaustive investigation (20-45min)",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-purple-400", 
      estimatedTime: 1800
    }
  }

  // 🚀 Research Functions
  const startResearch = async () => {
    if (!currentQuery.trim()) return

    const newQuery: ResearchQuery = {
      id: Date.now().toString(),
      query: currentQuery,
      depth: selectedDepth,
      status: "planning",
      timestamp: new Date(),
      estimatedTime: depthConfig[selectedDepth].estimatedTime,
      tags: [],
      priority: "medium"
    }

    setActiveQuery(newQuery)
    setResearchQueries(prev => [newQuery, ...prev])
    setIsResearching(true)
    
    if (selectedModels.includes("claude") && selectedModels.includes("gemini")) {
      setActiveView("collaborative")
      startCollaborativeSession(newQuery)
    } else {
      setActiveView("research")
    }
  }

  const startCollaborativeSession = (query: ResearchQuery) => {
    const session: CollaborativeSession = {
      id: Date.now().toString(),
      claudeModel: "Claude 3.5 Sonnet",
      geminiModel: "Gemini 2.0 Flash",
      currentStatus: "claude_thinking",
      progress: 0,
      liveUpdates: [],
      masterAnswer: "",
      consensus: 0
    }
    
    setCollaborativeSession(session)
    simulateCollaborativeResearch(session)
  }

  // 🎭 Simulation for demo purposes
  const simulateCollaborativeResearch = async (session: CollaborativeSession) => {
    const messages = [
      "Claude: Analyzing the research structure...",
      "Gemini: Gathering comprehensive data sources...",
      "Claude: Identified 3 key implementation strategies...",
      "Gemini: Found 8 relevant case studies...",
      "Synthesizing collaborative insights..."
    ]

    for (let i = 0; i < messages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTickerMessages(prev => [...prev, messages[i]])
      
      setCollaborativeSession(prev => prev ? {
        ...prev,
        progress: ((i + 1) / messages.length) * 100,
        currentStatus: i === messages.length - 1 ? "complete" : prev.currentStatus
      } : null)
    }

    // Complete the session
    setTimeout(() => {
      setCollaborativeSession(prev => prev ? {
        ...prev,
        masterAnswer: `# Research Synthesis: Express Mode Optimization

Based on collaborative analysis between Claude 3.5 Sonnet and Gemini 2.0 Flash, here are the key findings for achieving 6x faster AI responses:

## 🚀 Core Optimization Strategies

### 1. Intelligent Model Routing
- **Claude's Analysis**: Express Mode works best with request-specific model selection
- **Gemini's Research**: Vertex AI routing can reduce latency by 60-80%
- **Synthesis**: Implement dynamic routing based on query complexity and expected response time

### 2. Caching Layer Architecture  
- **Claude's Insight**: Multi-tier caching with semantic similarity matching
- **Gemini's Data**: Redis + Vector DB combination shows 6x improvements
- **Consensus**: Cache frequently requested patterns with 95% confidence threshold

### 3. Response Streaming Optimization
- **Technical Implementation**: Chunked responses with progressive enhancement
- **Performance Metrics**: Average response initiation in <200ms
- **User Experience**: Perceived speed improvement of 300-500%

## 📊 Expected Performance Gains
- Initial response: **6x faster** (from 3s to 500ms)
- Full completion: **3x faster** overall  
- User satisfaction: **85% improvement** in perceived responsiveness

## 🛠️ Implementation Roadmap
1. Set up intelligent routing infrastructure
2. Implement semantic caching layer
3. Optimize streaming protocols
4. Monitor and iterate based on usage patterns

*Research completed through collaborative AI analysis*`,
        currentStatus: "complete"
      } : null)
      setIsResearching(false)
    }, 1000)
  }

  // 🎨 Render Functions
  const renderHeader = () => (
    <motion.header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-lg bg-black/30 border-b border-white/20 p-4",
        neurodivergentMode && "p-6 border-b-2"
      )}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center",
            neurodivergentMode && "w-12 h-12 rounded-2xl"
          )}>
            <Brain className={cn("w-5 h-5 text-white", neurodivergentMode && "w-6 h-6")} />
          </div>
          
          <div>
            <h1 className={cn(
              "text-xl font-bold text-white",
              neurodivergentMode && "text-2xl leading-relaxed"
            )}>
              Deep Research Library
            </h1>
            <p className={cn(
              "text-sm text-white/60",
              neurodivergentMode && "text-base leading-relaxed"
            )}>
              Collaborative AI Research with Claude & Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Activity className="w-3 h-3 mr-1" />
            {activeView === "collaborative" && isResearching ? "Live Research" : "Ready"}
          </Badge>
          
          <Button
            variant="outline"
            size={neurodivergentMode ? "lg" : "default"}
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "border-white/20 text-white hover:bg-white/10",
              neurodivergentMode && "px-6 py-3 text-base"
            )}
          >
            <Settings className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
          </Button>
        </div>
      </div>

      {/* Live Ticker */}
      {showLiveTicker && isResearching && tickerMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg border border-white/10 p-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm">Live Research Updates</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll">
                <span className="text-white/80 text-sm">
                  {tickerMessages[tickerMessages.length - 1]}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLiveTicker(false)}
              className="text-white/60 hover:text-white"
            >
              <Minus className="w-3 h-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )

  const renderResearchInput = () => (
    <Card className="bg-white/5 border-white/20 backdrop-blur-xl p-6">
      <div className="space-y-4">
        {/* Query Input */}
        <div className="space-y-2">
          <label className={cn(
            "text-sm font-medium text-white",
            neurodivergentMode && "text-base"
          )}>
            Research Query
          </label>
          <Textarea
            placeholder="What would you like to research deeply? (e.g., 'How can we optimize Express Mode for 6x faster AI responses?')"
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            className={cn(
              "bg-black/30 border-white/20 text-white placeholder:text-white/40 resize-none",
              neurodivergentMode && "h-24 text-base"
            )}
            rows={neurodivergentMode ? 4 : 3}
          />
        </div>

        {/* Depth Selection */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(depthConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedDepth === key ? "default" : "outline"}
              onClick={() => setSelectedDepth(key as any)}
              className={cn(
                "h-auto p-3 flex flex-col items-start",
                selectedDepth === key
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                  : "border-white/20 text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {config.icon}
                <span className="font-medium text-sm">{config.name}</span>
              </div>
              <p className="text-xs opacity-80 text-left leading-relaxed">
                {config.description}
              </p>
            </Button>
          ))}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">AI Models</label>
          <div className="flex gap-2">
            {[
              { id: "claude", name: "Claude 3.5 Sonnet", color: "from-orange-500 to-amber-500" },
              { id: "gemini", name: "Gemini 2.0 Flash", color: "from-blue-500 to-indigo-500" }
            ].map((model) => (
              <Button
                key={model.id}
                variant={selectedModels.includes(model.id) ? "default" : "outline"}
                onClick={() => {
                  setSelectedModels(prev => 
                    prev.includes(model.id) 
                      ? prev.filter(m => m !== model.id)
                      : [...prev, model.id]
                  )
                }}
                className={cn(
                  "flex-1",
                  selectedModels.includes(model.id)
                    ? `bg-gradient-to-r ${model.color} text-white`
                    : "border-white/20 text-white hover:bg-white/10"
                )}
              >
                {model.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Start Research Button */}
        <Button
          onClick={startResearch}
          disabled={!currentQuery.trim() || selectedModels.length === 0 || isResearching}
          className={cn(
            "w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium",
            neurodivergentMode && "h-12 text-base"
          )}
        >
          {isResearching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Start {selectedModels.length > 1 ? "Collaborative" : ""} Research
            </>
          )}
        </Button>
      </div>
    </Card>
  )

  const renderCollaborativeView = () => {
    if (!collaborativeSession) return null

    return (
      <div className="space-y-6">
        {/* Research Progress Overview */}
        <Card className="bg-white/5 border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Collaborative Research Session</h2>
              <p className="text-white/60">Claude 3.5 Sonnet & Gemini 2.0 Flash working together</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{collaborativeSession.progress}%</div>
                <div className="text-xs text-white/60">Complete</div>
              </div>
              <Badge className={cn(
                "px-3 py-1",
                collaborativeSession.currentStatus === "complete" 
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse"
              )}>
                {collaborativeSession.currentStatus === "complete" ? "Research Complete" : "In Progress"}
              </Badge>
            </div>
          </div>
          <Progress value={collaborativeSession.progress} className="h-3" />
        </Card>

        {/* Three-Panel Layout */}
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-20rem)]">
          {/* Claude Panel */}
          <Card className="bg-orange-500/10 border-orange-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h3 className="font-medium text-orange-300">Claude 3.5 Sonnet</h3>
                  <p className="text-xs text-orange-300/60">Analytical Perspective</p>
                </div>
              </div>
              <Badge variant="outline" className="text-orange-300 border-orange-500/30">
                {collaborativeSession.currentStatus === "claude_thinking" ? "Active" : "Standby"}
              </Badge>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {mockLiveUpdates
                  .filter(update => update.model === "claude")
                  .map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-orange-500/20 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          update.type === "thinking" && "bg-orange-400",
                          update.type === "analyzing" && "bg-blue-400", 
                          update.type === "insight" && "bg-green-400"
                        )} />
                        <span className="text-xs text-orange-300 capitalize">
                          {update.type}
                        </span>
                        <span className="text-xs text-orange-300/60 ml-auto">
                          {update.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-orange-100">{update.message}</p>
                      <Progress value={update.progress} className="mt-2 h-1" />
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Master Synthesis Panel (2 columns) */}
          <Card className="col-span-2 bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border-purple-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-300">Master Synthesis</h3>
                  <p className="text-xs text-purple-300/60">Collaborative Intelligence</p>
                </div>
              </div>
              <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                {collaborativeSession.currentStatus === "complete" ? "Complete" : "Processing"}
              </Badge>
            </div>

            <div className="flex-1">
              {collaborativeSession.masterAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <ScrollArea className="flex-1 max-h-96">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div 
                        className="text-white/90 leading-relaxed whitespace-pre-wrap"
                        style={{ fontSize: '14px', lineHeight: '1.6' }}
                      >
                        {collaborativeSession.masterAnswer}
                      </div>
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <Button size="sm" variant="outline" className="text-white border-white/20">
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" className="text-white border-white/20">
                      <Save className="w-3 h-3 mr-1" />
                      Save to Library
                    </Button>
                    <Button size="sm" variant="outline" className="text-white border-white/20">
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-white/60">
                      {collaborativeSession.currentStatus === "claude_thinking" && "Claude is analyzing..."}
                      {collaborativeSession.currentStatus === "gemini_thinking" && "Gemini is researching..."}
                      {collaborativeSession.currentStatus === "synthesizing" && "Synthesizing results..."}
                    </p>
                    <div className="flex items-center gap-2 mt-2 justify-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Gemini Panel */}
          <Card className="bg-blue-500/10 border-blue-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <h3 className="font-medium text-blue-300">Gemini 2.0 Flash</h3>
                  <p className="text-xs text-blue-300/60">Technical Research</p>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-300 border-blue-500/30">
                {collaborativeSession.currentStatus === "gemini_thinking" ? "Active" : "Standby"}
              </Badge>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {mockLiveUpdates
                  .filter(update => update.model === "gemini")
                  .map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-blue-500/20 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          update.type === "researching" && "bg-blue-400",
                          update.type === "finding" && "bg-purple-400",
                          update.type === "insight" && "bg-green-400"
                        )} />
                        <span className="text-xs text-blue-300 capitalize">
                          {update.type}
                        </span>
                        <span className="text-xs text-blue-300/60 ml-auto">
                          {update.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-100">{update.message}</p>
                      <Progress value={update.progress} className="mt-2 h-1" />
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    )
  }

  const renderHomeView = () => (
    <div className="space-y-8">
      {/* Research Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderResearchInput()}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: <Search className="w-5 h-5" />, label: "Quick Search", action: () => setSelectedDepth("search") },
          { icon: <Brain className="w-5 h-5" />, label: "Deep Research", action: () => setSelectedDepth("deep") },
          { icon: <Users className="w-5 h-5" />, label: "Collaborative", action: () => setSelectedModels(["claude", "gemini"]) },
          { icon: <History className="w-5 h-5" />, label: "History", action: () => setActiveView("history") }
        ].map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "h-20 flex flex-col gap-2 border-white/20 text-white hover:bg-white/10",
              neurodivergentMode && "h-24 text-base"
            )}
            onClick={action.action}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </motion.div>

      {/* Recent Research */}
      {researchQueries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/5 border-white/20 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Recent Research</h3>
            <div className="space-y-3">
              {researchQueries.slice(0, 3).map((query) => (
                <div
                  key={query.id}
                  className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => setActiveQuery(query)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{query.query}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={cn("text-xs", depthConfig[query.depth].color)}>
                          {depthConfig[query.depth].name}
                        </Badge>
                        <span className="text-white/60 text-xs">
                          {query.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )

  const renderHistoryView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Research History</h2>
        <Button
          variant="outline"
          onClick={() => setActiveView("home")}
          className="border-white/20 text-white hover:bg-white/10"
        >
          ← Back to Research
        </Button>
      </div>
      
      <div className="space-y-4">
        {researchQueries.map((query) => (
          <Card key={query.id} className="bg-white/5 border-white/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2">{query.query}</h3>
                
                <div className="flex items-center gap-4 mb-3">
                  <Badge className={cn("text-xs", depthConfig[query.depth].color)}>
                    {depthConfig[query.depth].icon}
                    <span className="ml-1">{depthConfig[query.depth].name}</span>
                  </Badge>
                  <span className="text-white/60 text-sm">
                    {query.timestamp.toLocaleDateString()} at {query.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-white/60 text-sm">Claude Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-white/60 text-sm">Gemini Research</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-white/60 text-sm">Master Synthesis</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setActiveQuery(query)
                    setActiveView("collaborative")
                  }}
                  className="text-white border-white/20"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="text-white border-white/20">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {researchQueries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-white font-medium mb-2">No research sessions yet</h3>
            <p className="text-white/60 mb-4">Start your first collaborative research session</p>
            <Button
              onClick={() => setActiveView("home")}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Start Research
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br",
      theme.background,
      className
    )}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className={cn("absolute top-20 left-1/4 w-96 h-96 rounded-full mix-blend-normal filter blur-[128px]")}
          style={{ backgroundColor: theme.particles + "30" }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className={cn("absolute bottom-20 right-1/4 w-96 h-96 rounded-full mix-blend-normal filter blur-[128px]")}
          style={{ backgroundColor: theme.particles + "30" }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {renderHeader()}
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeView === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderHomeView()}
                </motion.div>
              )}
              
              {activeView === "collaborative" && (
                <motion.div
                  key="collaborative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveView("home")}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      ← Back to Research
                    </Button>
                  </div>
                  {renderCollaborativeView()}
                </motion.div>
              )}

              {activeView === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderHistoryView()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export type { DeepResearchLibraryProps }
