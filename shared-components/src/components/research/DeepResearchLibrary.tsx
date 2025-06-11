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
  Plus,
  FileDown,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCcw,
  Trash2,
  ExternalLink
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

// 📡 Enhanced Types for Production Features
interface WebSocketState {
  connected: boolean
  reconnecting: boolean
  error: string | null
  lastMessage: Date | null
}

interface WebSocketMessage {
  type: 'research_update' | 'collaboration_update' | 'error' | 'connection_status'
  data: any
  timestamp: Date
}

interface ExportOptions {
  format: 'markdown' | 'pdf' | 'json'
  includeMetadata: boolean
  includeSources: boolean
  includeAnalysis: boolean
}

interface SearchFilters {
  dateRange: {
    start: Date | null
    end: Date | null
  }
  models: string[]
  status: ResearchQuery['status'][]
  tags: string[]
  minDuration: number | null
  maxDuration: number | null
}

interface ErrorState {
  type: 'network' | 'api' | 'validation' | 'unknown'
  message: string
  details?: string
  timestamp: Date
  retry?: () => void
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
  const [activeView, setActiveView] = React.useState<"home" | "collaborative" | "history" | "research">("home")
  const [researchQueries, setResearchQueries] = React.useState<ResearchQuery[]>([])
  const [activeQuery, setActiveQuery] = React.useState<ResearchQuery | null>(null)
  const [showSettings, setShowSettings] = React.useState(false)
  // 🤝 Collaborative State
  const [collaborativeSession, setCollaborativeSession] = React.useState<CollaborativeSession | null>(null)
  const [showLiveTicker, setShowLiveTicker] = React.useState(true)
  const [tickerMessages, setTickerMessages] = React.useState<string[]>([])
  const [researchSources, setResearchSources] = React.useState<ResearchSource[]>([])

  // 📡 Enhanced Production Features State
  const [wsState, setWsState] = React.useState<WebSocketState>({
    connected: false,
    reconnecting: false,
    error: null,
    lastMessage: null
  })
  const [wsRef, setWsRef] = React.useState<WebSocket | null>(null)
  
  const [showExportModal, setShowExportModal] = React.useState(false)
  const [exportOptions, setExportOptions] = React.useState<ExportOptions>({
    format: 'markdown',
    includeMetadata: true,
    includeSources: true,
    includeAnalysis: true
  })
  const [isExporting, setIsExporting] = React.useState(false)
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showFilters, setShowFilters] = React.useState(false)
  const [filters, setFilters] = React.useState<SearchFilters>({
    dateRange: { start: null, end: null },
    models: [],
    status: [],
    tags: [],
    minDuration: null,
    maxDuration: null
  })
  
  const [errors, setErrors] = React.useState<ErrorState[]>([])
  const [showErrorPanel, setShowErrorPanel] = React.useState(false)
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

  // 📡 WebSocket Integration
  const connectWebSocket = React.useCallback(() => {
    if (wsRef) {
      wsRef.close()
    }

    try {
      setWsState(prev => ({ ...prev, reconnecting: true, error: null }))
      
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.your-domain.com/ws/research'
        : 'ws://localhost:5000/ws/research'
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        setWsState(prev => ({ 
          ...prev, 
          connected: true, 
          reconnecting: false, 
          error: null,
          lastMessage: new Date()
        }))
        
        ws.send(JSON.stringify({
          type: 'authenticate',
          sessionId: collaborativeSession?.id || Date.now().toString()
        }))
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setWsState(prev => ({ ...prev, lastMessage: new Date() }))
          
          switch (message.type) {
            case 'research_update':
              setTickerMessages(prev => [...prev, message.data.message])
              if (message.data.progress) {
                setCollaborativeSession(prev => prev ? {
                  ...prev,
                  progress: message.data.progress,
                  currentStatus: message.data.status || prev.currentStatus
                } : null)
              }
              break
              
            case 'collaboration_update':
              if (message.data.liveUpdate) {
                setCollaborativeSession(prev => prev ? {
                  ...prev,
                  liveUpdates: [...prev.liveUpdates, message.data.liveUpdate]
                } : null)
              }
              break
              
            case 'error':
              addError('api', message.data.message, message.data.details)
              break
          }
        } catch (error) {
          addError('network', 'Failed to parse real-time update', (error as Error).message)
        }
      }

      ws.onerror = () => {
        addError('network', 'Real-time connection error', 'Check your internet connection')
      }

      ws.onclose = (event) => {
        setWsState(prev => ({ 
          ...prev, 
          connected: false, 
          reconnecting: false 
        }))
        
        if (!event.wasClean) {
          setTimeout(() => {
            if (!wsRef || wsRef.readyState === WebSocket.CLOSED) {
              connectWebSocket()
            }
          }, 3000)
        }
      }

      setWsRef(ws)
    } catch (error) {
      setWsState(prev => ({ 
        ...prev, 
        connected: false, 
        reconnecting: false, 
        error: 'Connection failed' 
      }))
      addError('network', 'Failed to establish real-time connection', (error as Error).message)
    }
  }, [collaborativeSession?.id, wsRef])

  // 🚨 Error Handling
  const addError = React.useCallback((type: ErrorState['type'], message: string, details?: string, retry?: () => void) => {
    const error: ErrorState = {
      type,
      message,
      details,
      timestamp: new Date(),
      retry
    }
    
    setErrors(prev => [error, ...prev.slice(0, 9)])
    setShowErrorPanel(true)
    
    if (type !== 'api') {
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e.timestamp !== error.timestamp))
      }, 5000)
    }
  }, [])

  // 📊 Export Functionality
  const exportResearch = React.useCallback(async (query: ResearchQuery, options: ExportOptions) => {
    if (!query.results) {
      addError('validation', 'Cannot export incomplete research')
      return
    }

    setIsExporting(true)
    
    try {
      let content = ''
      let filename = `research_${query.id}`
      
      switch (options.format) {
        case 'markdown':
          content = generateMarkdownExport(query, options)
          filename += '.md'
          break
          
        case 'json':
          content = JSON.stringify({
            query: query.query,
            depth: query.depth,
            timestamp: query.timestamp,
            results: query.results,
            metadata: options.includeMetadata ? {
              models: selectedModels,
              estimatedTime: query.estimatedTime,
              tags: query.tags,
              priority: query.priority
            } : undefined
          }, null, 2)
          filename += '.json'
          break
          
        case 'pdf':
          content = generateMarkdownExport(query, options)
          filename += '.pdf'
          break
      }
      
      const blob = new Blob([content], { 
        type: options.format === 'json' ? 'application/json' : 'text/plain' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setShowExportModal(false)
    } catch (error) {
      addError('unknown', 'Export failed', (error as Error).message, () => exportResearch(query, options))
    } finally {
      setIsExporting(false)
    }  }, [selectedModels, addError])

  const generateMarkdownExport = (query: ResearchQuery, options: ExportOptions): string => {
    let content = `# Research Report: ${query.query}\n\n`
    
    if (options.includeMetadata) {
      content += `## Metadata\n`
      content += `- **Query**: ${query.query}\n`
      content += `- **Depth**: ${query.depth}\n`
      content += `- **Date**: ${query.timestamp.toLocaleDateString()}\n`
      content += `- **Status**: ${query.status}\n\n`
    }
    
    content += `---\n*Generated by Deep Research Library - ${new Date().toLocaleString()}*`
    return content
  }

  // 🔄 WebSocket Lifecycle Management
  React.useEffect(() => {
    if (activeView === "collaborative" && isResearching) {
      connectWebSocket()
    }

    return () => {
      if (wsRef) {
        wsRef.close()
      }
    }
  }, [activeView, isResearching, connectWebSocket])

  // 🎨 Enhanced Render Functions
  const renderErrorPanel = () => {
    if (!showErrorPanel || errors.length === 0) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-20 right-4 z-50 w-96 max-h-64 overflow-hidden"
      >
        <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-300 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Errors ({errors.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowErrorPanel(false)}
                className="text-red-300 hover:bg-red-500/20"
              >
                <Minus className="w-3 h-3" />
              </Button>
            </div>
            
            <ScrollArea className="max-h-48">
              <div className="space-y-2">
                {errors.map((error) => (
                  <div
                    key={error.timestamp.getTime()}
                    className="bg-red-500/20 rounded-lg p-3 border border-red-500/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-red-100 font-medium text-sm">{error.message}</p>
                        {error.details && (
                          <p className="text-red-200/80 text-xs mt-1">{error.details}</p>
                        )}
                        <p className="text-red-300/60 text-xs mt-1">
                          {error.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {error.retry && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={error.retry}
                            className="text-red-300 hover:bg-red-500/20 h-6 w-6 p-0"
                          >
                            <RefreshCcw className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setErrors(prev => prev.filter(e => e.timestamp !== error.timestamp))}
                          className="text-red-300 hover:bg-red-500/20 h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-end mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setErrors([])}
                className="border-red-500/30 text-red-300 hover:bg-red-500/20"
              >
                Clear All
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const renderExportModal = () => {
    if (!showExportModal || !activeQuery) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowExportModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl p-6 w-96">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Export Research
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['markdown', 'json', 'pdf'] as const).map((format) => (
                    <Button
                      key={format}
                      variant={exportOptions.format === format ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportOptions(prev => ({ ...prev, format }))}
                      className={cn(
                        exportOptions.format === format
                          ? "bg-purple-600 text-white"
                          : "border-white/20 text-white hover:bg-white/10"
                      )}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Include</label>
                {[
                  { key: 'includeMetadata' as const, label: 'Metadata' },
                  { key: 'includeSources' as const, label: 'Sources' },
                  { key: 'includeAnalysis' as const, label: 'Analysis' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={exportOptions[key]}
                      onChange={(e) => setExportOptions(prev => ({ 
                        ...prev, 
                        [key]: e.target.checked 
                      }))}
                      className="rounded border-white/20"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => exportResearch(activeQuery, exportOptions)}
                disabled={isExporting}
                className="flex-1 bg-purple-600 text-white"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="w-3 h-3 mr-1" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    )
  }

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
        </div>        <div className="flex items-center gap-2">
          {/* WebSocket Status */}
          <Badge className={cn(
            "px-2 py-1",
            wsState.connected 
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : wsState.reconnecting
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          )}>
            {wsState.connected ? (
              <><Wifi className="w-3 h-3 mr-1" />Connected</>
            ) : wsState.reconnecting ? (
              <><RefreshCcw className="w-3 h-3 mr-1 animate-spin" />Reconnecting</>
            ) : (
              <><WifiOff className="w-3 h-3 mr-1" />Offline</>
            )}
          </Badge>

          {/* Error Indicator */}
          {errors.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowErrorPanel(!showErrorPanel)}
              className="border-red-500/30 text-red-300 hover:bg-red-500/10"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {errors.length}
            </Button>
          )}

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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-white border-white/20"
                      onClick={() => {
                        if (activeQuery) {
                          setShowExportModal(true)
                        }
                      }}
                      disabled={!activeQuery || !collaborativeSession?.masterAnswer}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-white border-white/20"
                      onClick={() => {
                        if (activeQuery && collaborativeSession?.masterAnswer) {
                          // Save to research queries with results
                          setResearchQueries(prev => prev.map(q => 
                            q.id === activeQuery.id 
                              ? { ...q, status: 'complete' as const, results: { 
                                  claudeFindings: "Analysis completed", 
                                  geminiFindings: "Research completed",
                                  masterSynthesis: collaborativeSession.masterAnswer,
                                  sources: researchSources,
                                  metadata: {
                                    duration: Date.now() - activeQuery.timestamp.getTime(),
                                    totalSources: researchSources.length,
                                    confidence: collaborativeSession.consensus,
                                    collaborationRounds: collaborativeSession.liveUpdates.length
                                  }
                                }}
                              : q
                          ))
                        }
                      }}
                      disabled={!activeQuery || !collaborativeSession?.masterAnswer}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save to Library
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-white border-white/20"
                      onClick={() => {
                        if (collaborativeSession?.masterAnswer) {
                          navigator.clipboard.writeText(collaborativeSession.masterAnswer)
                          // Could add a toast notification here
                        }
                      }}
                      disabled={!collaborativeSession?.masterAnswer}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Copy
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
  const renderHistoryView = () => {
    // Filter queries based on search and filters
    const filteredQueries = researchQueries.filter(query => {
      const matchesSearch = !searchQuery || 
        query.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(query.status);
      const matchesModels = filters.models.length === 0 || 
        filters.models.some(model => selectedModels.includes(model));
      
      const matchesDateRange = (!filters.dateRange.start || query.timestamp >= filters.dateRange.start) &&
        (!filters.dateRange.end || query.timestamp <= filters.dateRange.end);
      
      return matchesSearch && matchesStatus && matchesModels && matchesDateRange;
    });

    return (
      <div className="space-y-6">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Research History</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-black/30 border-white/20 text-white placeholder:text-white/40"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveView("home")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              ← Back to Research
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-white/5 border-white/20 p-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Status</label>
                  <div className="space-y-1">
                    {['complete', 'researching', 'failed'].map(status => (
                      <label key={status} className="flex items-center gap-2 text-sm text-white/80">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status as any)}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              status: e.target.checked
                                ? [...prev.status, status as any]
                                : prev.status.filter(s => s !== status)
                            }))
                          }}
                          className="rounded border-white/20"
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Models</label>
                  <div className="space-y-1">
                    {['claude', 'gemini'].map(model => (
                      <label key={model} className="flex items-center gap-2 text-sm text-white/80">
                        <input
                          type="checkbox"
                          checked={filters.models.includes(model)}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              models: e.target.checked
                                ? [...prev.models, model]
                                : prev.models.filter(m => m !== model)
                            }))
                          }}
                          className="rounded border-white/20"
                        />
                        {model.charAt(0).toUpperCase() + model.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({
                      dateRange: { start: null, end: null },
                      models: [],
                      status: [],
                      tags: [],
                      minDuration: null,
                      maxDuration: null
                    })}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-sm">
            {filteredQueries.length} of {researchQueries.length} research sessions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filteredQueries.length === 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <FileDown className="w-4 h-4 mr-1" />
              Export All
            </Button>
          </div>
        </div>
        
        {/* Research List */}
        <div className="space-y-4">
          {filteredQueries.map((query) => (
            <Card key={query.id} className="bg-white/5 border-white/20 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">{query.query}</h3>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={cn("text-xs", depthConfig[query.depth].color)}>
                      {depthConfig[query.depth].icon}
                      <span className="ml-1">{depthConfig[query.depth].name}</span>
                    </Badge>
                    <Badge className={cn(
                      "text-xs",
                      query.status === 'complete' && "bg-green-500/20 text-green-300 border-green-500/30",
                      query.status === 'researching' && "bg-blue-500/20 text-blue-300 border-blue-500/30",
                      query.status === 'failed' && "bg-red-500/20 text-red-300 border-red-500/30"
                    )}>
                      {query.status}
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      if (query.results) {
                        exportResearch(query, exportOptions)
                      }
                    }}
                    disabled={!query.results}
                    className="text-white border-white/20"
                  >
                    <FileDown className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-white border-white/20">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredQueries.length === 0 && researchQueries.length > 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-white font-medium mb-2">No matching research found</h3>
              <p className="text-white/60 mb-4">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setFilters({
                    dateRange: { start: null, end: null },
                    models: [],
                    status: [],
                    tags: [],
                    minDuration: null,
                    maxDuration: null
                  })
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Clear Search & Filters
              </Button>
            </div>
          )}
          
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
  }

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
              )}            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Error Panel */}
      <AnimatePresence>
        {renderErrorPanel()}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {renderExportModal()}
      </AnimatePresence>
    </div>
  )
}

export type { DeepResearchLibraryProps }
