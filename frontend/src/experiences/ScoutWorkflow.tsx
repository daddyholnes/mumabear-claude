import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Computer, Rocket, FileText, Eye, 
  Clock, CheckCircle, AlertCircle, Loader2, Sparkles,
  FolderOpen, Code, Play, Download, Copy, Maximize2,
  Minimize2, X, Settings, Upload, Share2, Terminal,
  Zap, Brain, Target, Search, Globe, Monitor, ChevronRight,
  ChevronDown, GripVertical, GitBranch, History, FileCode,
  LayoutTemplate, Bot, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

interface ChatMessage {
  id: string
  type: 'user' | 'scout' | 'system'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  metadata?: {
    step?: string
    progress?: number
    files?: string[]
    action?: string
  }
}

interface ProjectStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  timestamp: Date
  duration?: number
  files?: string[]
  output?: string
  type: 'planning' | 'environment' | 'coding' | 'testing' | 'deployment'
}

interface ProjectFile {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  content?: string
  language?: string
  children?: ProjectFile[]
}

interface ScoutProject {
  id: string
  name: string
  description: string
  status: 'planning' | 'negotiating' | 'approved' | 'building' | 'completed' | 'error'
  progress: number
  environment: {
    type: 'scrapybara' | 'local' | 'cloud'
    status: 'pending' | 'launching' | 'ready' | 'error'
    url?: string
    specs?: {
      language: string
      framework: string
      packages: string[]
    }
  }
  timeline: ProjectStep[]
  files: ProjectFile[]
  preview?: {
    url: string
    screenshot?: string
    type: 'web' | 'mobile' | 'desktop'
  }
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'system',
    content: '🎯 **Scout Commander ready!** I\'m here to help you build amazing projects from idea to production. What would you like to create today?',
    timestamp: new Date(Date.now() - 60000),
    status: 'sent'
  }
]

const ScoutWorkflow = () => {
  const { effectLevel } = useSanctuaryStore()
  
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [currentProject, setCurrentProject] = useState<ScoutProject | null>(null)
  const [showDevArea, setShowDevArea] = useState(false)
  const [devAreaTab, setDevAreaTab] = useState('timeline')
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const scoutResponse = generateScoutResponse(inputMessage)
      setMessages(prev => [...prev, scoutResponse])
      setIsTyping(false)
      
      if (inputMessage.toLowerCase().includes('build') || inputMessage.toLowerCase().includes('create')) {
        startProjectPlanning(inputMessage)
      }
    }, 1500)
  }

  const generateScoutResponse = (userInput: string): ChatMessage => {
    const responses = [
      "🎯 **Excellent idea!** Let me analyze your requirements and create a comprehensive plan. I'll break this down into manageable phases and suggest the best technology stack.",
      "🚀 **I love the vision!** This sounds like a fantastic project. Let me draft a detailed implementation plan with timeline, tech stack, and deployment strategy.",
      "💡 **Great concept!** I can see the potential here. Let me create a structured approach with clear milestones and deliverables.",
    ]
    return {
      id: Date.now().toString(),
      type: 'scout',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      status: 'sent'
    }
  }

  const startProjectPlanning = (prompt: string) => {
    const newProject: ScoutProject = {
      id: Date.now().toString(),
      name: `New Project: ${prompt.substring(0, 20)}...`,
      description: prompt,
      status: 'planning',
      progress: 10,
      environment: {
        type: 'scrapybara',
        status: 'pending'
      },
      timeline: [{
        id: 'step1',
        name: 'Project Planning',
        description: 'Analyzing requirements and creating a project plan.',
        status: 'running',
        timestamp: new Date(),
        type: 'planning'
      }],
      files: []
    }
    setCurrentProject(newProject)
    setShowDevArea(true)
  }

  const approvePlan = () => {
    if (!currentProject) return
    setCurrentProject({
      ...currentProject,
      status: 'approved',
      progress: 30,
      timeline: [
        ...currentProject.timeline.map(p => p.id === 'step1' ? { ...p, status: 'completed' as const } : p),
        {
          id: 'step2',
          name: 'Environment Setup',
          description: 'Launching Scrapybara environment.',
          status: 'running' as const,
          timestamp: new Date(),
          type: 'environment'
        }
      ]
    })
  }

  const renderMessageContent = (message: ChatMessage) => {
    const Icon = message.type === 'user' ? User : Bot;
    return (
      <div className={cn("flex items-start gap-3 my-4", message.type === 'user' && "justify-end")}>
        {message.type !== 'user' && <Icon className="w-6 h-6 text-purple-500" />}
        <div className={cn("p-3 rounded-lg max-w-lg", message.type === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs text-muted-foreground mt-1 text-right">{message.timestamp.toLocaleTimeString()}</p>
        </div>
        {message.type === 'user' && <Icon className="w-6 h-6" />}
      </div>
    )
  }

  const renderFileTree = (files: ProjectFile[], level = 0) => {
    return files.map(file => (
      <div key={file.id} style={{ paddingLeft: `${level * 1.5}rem` }}>
        <div className="flex items-center gap-2 py-1 hover:bg-muted/50 rounded-md cursor-pointer">
          {file.type === 'folder' ? <FolderOpen className="w-4 h-4 text-purple-500" /> : <FileCode className="w-4 h-4 text-gray-500" />}
          <span>{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ))
  }

  const renderTimeline = (timeline: ProjectStep[]) => {
    return (
      <div className="space-y-4">
        {timeline.map((step, index) => (
          <motion.div key={step.id} className="flex items-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col items-center">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                step.status === 'completed' && 'bg-green-500',
                step.status === 'running' && 'bg-blue-500 animate-pulse',
                step.status === 'pending' && 'bg-muted',
                step.status === 'error' && 'bg-red-500'
              )}>
                {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                {step.status === 'running' && <Loader2 className="w-5 h-5 text-white animate-spin" />}
                {step.status === 'pending' && <Clock className="w-5 h-5 text-muted-foreground" />}
                {step.status === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
              </div>
              {index < timeline.length - 1 && <div className="w-0.5 h-16 bg-muted mt-2" />}
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{step.name}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{step.timestamp.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  const renderPreview = (preview: ScoutProject['preview']) => {
    if (!preview) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Monitor className="w-16 h-16 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">No Preview Available</p>
          <p className="text-sm text-muted-foreground">The project preview will appear here once generated.</p>
        </div>
      )
    }
    return (
      <div className="w-full h-full bg-black rounded-lg overflow-hidden">
        <img src={preview.screenshot || `https://via.placeholder.com/800x600.png?text=${currentProject?.name}`} alt="Project Preview" className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className={cn("h-screen w-screen flex flex-col bg-background text-foreground", isFullscreen && "fixed inset-0 z-50")}>
      <header className="flex items-center justify-between p-2 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-purple-500" />
          <h1 className="text-lg font-bold">Scout Workflow</h1>
          {currentProject && <Badge variant="secondary">{currentProject.name}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={showDevArea ? 50 : 100}>
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow p-4">
              <div ref={messagesEndRef} />
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {renderMessageContent(msg)}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bot className="w-5 h-5" />
                  <span>Scout is thinking...</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="relative">
                <Textarea
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className="pr-24"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setShowUpload(true)}>
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button onClick={sendMessage} size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <AnimatePresence>
          {showDevArea && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50}>
                <motion.div 
                  className="h-full flex flex-col bg-muted/20"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tabs value={devAreaTab} onValueChange={setDevAreaTab} className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="timeline"><History className="w-4 h-4 mr-2" />Timeline</TabsTrigger>
                      <TabsTrigger value="files"><FileCode className="w-4 h-4 mr-2" />Files</TabsTrigger>
                      <TabsTrigger value="preview"><LayoutTemplate className="w-4 h-4 mr-2" />Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline" className="flex-grow">
                      <ScrollArea className="h-full p-4">
                        {currentProject ? renderTimeline(currentProject.timeline) : <p>No project active.</p>}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="files" className="flex-grow">
                      <ScrollArea className="h-full p-4">
                        {currentProject ? renderFileTree(currentProject.files) : <p>No project active.</p>}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="preview" className="flex-grow">
                      <div className="h-full p-4 flex items-center justify-center">
                        {currentProject ? renderPreview(currentProject.preview) : <p>No project active.</p>}
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </ResizablePanel>
            </>
          )}
        </AnimatePresence>
      </ResizablePanelGroup>
    </div>
  )
}

export default ScoutWorkflow