'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Folder, 
  FolderOpen, 
  Download, 
  Send, 
  Paperclip, 
  Mic, 
  Image as ImageIcon,
  Play,
  CheckCircle,
  Clock,
  Code,
  Eye,
  Terminal,
  Zap,
  Bot,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
}

interface TimelineStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending'
  timestamp: string
  type: 'file' | 'command' | 'install' | 'deploy'
}

interface ChatMessage {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: string
  attachments?: string[]
}

interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
}

const themes: Theme[] = [
  {
    name: 'Purple Neon Tokyo',
    colors: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-purple-900 to-black',
      accent: '#ff00ff',
      background: 'bg-black',
      surface: 'bg-purple-900/20',
      text: 'text-purple-100'
    }
  },
  {
    name: 'Daytime Blue',
    colors: {
      primary: 'from-blue-400 to-cyan-400',
      secondary: 'from-blue-50 to-white',
      accent: '#0ea5e9',
      background: 'bg-blue-50',
      surface: 'bg-white/80',
      text: 'text-blue-900'
    }
  },
  {
    name: 'Pink Scrumptious',
    colors: {
      primary: 'from-pink-400 to-rose-400',
      secondary: 'from-pink-50 to-white',
      accent: '#ec4899',
      background: 'bg-pink-50',
      surface: 'bg-white/80',
      text: 'text-pink-900'
    }
  },
  {
    name: 'Orange Explosion',
    colors: {
      primary: 'from-orange-400 to-red-400',
      secondary: 'from-orange-50 to-white',
      accent: '#f97316',
      background: 'bg-orange-50',
      surface: 'bg-white/80',
      text: 'text-orange-900'
    }
  },
  {
    name: 'Green Matrix',
    colors: {
      primary: 'from-green-400 to-emerald-400',
      secondary: 'from-green-900 to-black',
      accent: '#10b981',
      background: 'bg-black',
      surface: 'bg-green-900/20',
      text: 'text-green-100'
    }
  },
  {
    name: 'Cyberpunk Yellow',
    colors: {
      primary: 'from-yellow-400 to-amber-400',
      secondary: 'from-gray-900 to-black',
      accent: '#f59e0b',
      background: 'bg-gray-900',
      surface: 'bg-yellow-900/20',
      text: 'text-yellow-100'
    }
  },
  {
    name: 'Royal Purple',
    colors: {
      primary: 'from-violet-500 to-purple-600',
      secondary: 'from-violet-50 to-white',
      accent: '#8b5cf6',
      background: 'bg-violet-50',
      surface: 'bg-white/80',
      text: 'text-violet-900'
    }
  },
  {
    name: 'Ocean Depths',
    colors: {
      primary: 'from-teal-400 to-blue-500',
      secondary: 'from-slate-900 to-black',
      accent: '#14b8a6',
      background: 'bg-slate-900',
      surface: 'bg-teal-900/20',
      text: 'text-teal-100'
    }
  }
]

const mockFileTree: FileNode[] = [
  {
    id: '1',
    name: 'my-fullstack-app',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'src',
        type: 'folder',
        children: [
          { id: '3', name: 'App.tsx', type: 'file', content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;' },
          { id: '4', name: 'index.tsx', type: 'file', content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));' }
        ]
      },
      {
        id: '5',
        name: 'backend',
        type: 'folder',
        children: [
          { id: '6', name: 'server.js', type: 'file', content: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.json({ message: "Hello from backend!" });\n});\n\napp.listen(3001);' },
          { id: '7', name: 'package.json', type: 'file', content: '{\n  "name": "backend",\n  "version": "1.0.0",\n  "dependencies": {\n    "express": "^4.18.0"\n  }\n}' }
        ]
      },
      { id: '8', name: 'package.json', type: 'file', content: '{\n  "name": "my-fullstack-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}' },
      { id: '9', name: 'README.md', type: 'file', content: '# My Fullstack App\n\nA full-stack application built by AI agent.' }
    ]
  }
]

const mockTimeline: TimelineStep[] = [
  {
    id: '1',
    title: 'Environment Setup',
    description: 'Spinning up development environment',
    status: 'completed',
    timestamp: '2 minutes ago',
    type: 'command'
  },
  {
    id: '2',
    title: 'Project Structure',
    description: 'Creating project directories and files',
    status: 'completed',
    timestamp: '1 minute ago',
    type: 'file'
  },
  {
    id: '3',
    title: 'Frontend Setup',
    description: 'Installing React and dependencies',
    status: 'completed',
    timestamp: '45 seconds ago',
    type: 'install'
  },
  {
    id: '4',
    title: 'Backend API',
    description: 'Setting up Express server',
    status: 'in-progress',
    timestamp: 'Now',
    type: 'file'
  },
  {
    id: '5',
    title: 'Database Integration',
    description: 'Configuring database connection',
    status: 'pending',
    timestamp: 'Pending',
    type: 'install'
  },
  {
    id: '6',
    title: 'Deployment',
    description: 'Deploying to production',
    status: 'pending',
    timestamp: 'Pending',
    type: 'deploy'
  }
]

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: 'Build me a full-stack todo application with React frontend and Node.js backend',
    timestamp: '3 minutes ago'
  },
  {
    id: '2',
    type: 'agent',
    content: 'I\'ll help you build a full-stack todo application! Let me start by setting up the development environment and project structure.',
    timestamp: '3 minutes ago'
  },
  {
    id: '3',
    type: 'agent',
    content: 'Environment is ready! I\'ve created the project structure with React frontend and Express backend. Currently working on the API endpoints.',
    timestamp: '1 minute ago'
  }
]

const LiveTicker: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const completedSteps = steps.filter(step => step.status === 'completed')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % completedSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [completedSteps.length])

  if (completedSteps.length === 0) return null

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-foreground"
          >
            {completedSteps[currentStep]?.title}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const FileTreeNode: React.FC<{ 
  node: FileNode
  level: number
  onFileSelect: (file: FileNode) => void
  expandedFolders: Set<string>
  onToggleFolder: (id: string) => void
}> = ({ node, level, onFileSelect, expandedFolders, onToggleFolder }) => {
  const isExpanded = expandedFolders.has(node.id)

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer rounded-sm`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            onToggleFolder(node.id)
          } else {
            onFileSelect(node)
          }
        }}
      >
        {node.type === 'folder' ? (
          isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const EnvironmentSpinup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="relative mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-32 h-32 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-primary rounded-full" />
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Bot className="w-8 h-8 text-primary" />
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </motion.div>
        
        <motion.h2
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Spinning up AI Environment
        </motion.h2>
        
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Initializing development workspace...
        </motion.p>
      </div>
    </motion.div>
  )
}

const AIAgentInterface: React.FC = () => {
    const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [panelsOpen, setPanelsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2']))
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [currentTheme, setCurrentTheme] = useState(0)
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState('preview')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: 'Just now'
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'I\'m working on your request. Let me implement that for you!',
        timestamp: 'Just now'
      }
      setMessages(prev => [...prev, agentResponse])
    }, 1000)
  }

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file)
    if (!rightPanelOpen) {
      setRightPanelOpen(true)
    }
    setRightPanelTab('code')
  }

  const handleToggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const theme = themes[currentTheme]

  if (!isEnvironmentReady) {
    return <EnvironmentSpinup onComplete={() => setIsEnvironmentReady(true)} />
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} ${theme.colors.text} relative overflow-hidden`}>
      <LiveTicker steps={mockTimeline} />
      
            {/* Theme Selector */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <select
          value={currentTheme}
          onChange={(e) => setCurrentTheme(Number(e.target.value))}
          className="bg-background border border-border rounded-md px-3 py-1 text-sm"
        >
          {themes.map((theme, index) => (
            <option key={index} value={index}>{theme.name}</option>
          ))}
        </select>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentTheme((prev) => (prev + 1) % themes.length)}
        >
          Switch Theme
        </Button>
      </div>

      <div className="flex h-screen relative">
                {/* Center Toggle Button */}
        <motion.button
          className="absolute left-1/2 top-4 -translate-x-1/2 z-30 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
          onClick={() => {
            const newState = !panelsOpen
            setPanelsOpen(newState)
            setLeftPanelOpen(newState)
            setRightPanelOpen(newState)
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: panelsOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </motion.button>

        {/* Left Panel - File Tree */}
        <AnimatePresence>
          {leftPanelOpen && (
            <motion.div
              className="w-80 bg-background/95 backdrop-blur-sm border-r border-border flex flex-col"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Folder className="w-5 h-5" />
                    Project Files
                  </h3>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-2">
                {mockFileTree.map(node => (
                  <FileTreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    onFileSelect={handleFileSelect}
                    expandedFolders={expandedFolders}
                    onToggleFolder={handleToggleFolder}
                  />
                ))}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">AI Development Agent</h2>
                <p className="text-sm text-muted-foreground">Building your full-stack application</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="secondary" className="animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`max-w-[80%] p-4 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp}
                    </p>
                  </Card>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleFileUpload}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe what you want to build..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
              />
            </div>
          </div>
        </div>

        

        {/* Right Panel - Preview & Timeline */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.div
              className="w-96 bg-background/95 backdrop-blur-sm border-l border-border flex flex-col"
              initial={{ x: 384, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 384, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="preview" className="text-xs">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" className="text-xs">
                      <Code className="w-4 h-4 mr-1" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="text-xs">
                      <Clock className="w-4 h-4 mr-1" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="preview" className="flex-1 p-4">
                  <div className="bg-white rounded-lg border h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Live Preview</p>
                      <p className="text-sm">Your app will appear here</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {selectedFile ? selectedFile.name : 'Select a file'}
                      </h4>
                      {selectedFile && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                    <ScrollArea className="h-96">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        <code>
                          {selectedFile?.content || '// Select a file to view its content'}
                        </code>
                      </pre>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Development Progress</h4>
                      <Badge variant="outline">
                        {mockTimeline.filter(s => s.status === 'completed').length}/{mockTimeline.length}
                      </Badge>
                    </div>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {mockTimeline.map((step, index) => (
                          <motion.div
                            key={step.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              step.status === 'completed' ? 'bg-green-500 text-white' :
                              step.status === 'in-progress' ? 'bg-blue-500 text-white animate-pulse' :
                              'bg-gray-300 text-gray-600'
                            }`}>
                              {step.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : step.status === 'in-progress' ? (
                                <Play className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{step.title}</h5>
                              <p className="text-xs text-muted-foreground">{step.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{step.timestamp}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AIAgentInterface
