"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Plus, 
  Search, 
  Lightbulb, 
  Calendar, 
  BarChart3, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  Image,
  Code,
  Folder,
  FolderOpen,
  Star,
  Cloud,
  Sparkles
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'

interface TaskStep {
  id: string
  title: string
  status: 'pending' | 'running' | 'completed'
  details?: string[]
  expandable?: boolean
  expanded?: boolean
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  children?: FileItem[]
  content?: string
}

interface ScoutUIProps {
  userName?: string
  theme?: 'nightie-stars' | 'daytime-clouds' | 'purple-haze'
}

const ScoutUI: React.FC<ScoutUIProps> = ({ 
  userName = "Julian",
  theme = 'purple-haze'
}) => {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [isWorking, setIsWorking] = useState(false)
  const [workspaceActive, setWorkspaceActive] = useState(false)
  const [taskSteps, setTaskSteps] = useState<TaskStep[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('index.html')
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const themeClasses = {
    'nightie-stars': 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    'daytime-clouds': 'bg-gradient-to-br from-blue-100 via-white to-purple-100',
    'purple-haze': 'bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900'
  }

  const themeAccents = {
    'nightie-stars': 'from-blue-400 to-purple-400',
    'daytime-clouds': 'from-blue-500 to-purple-500',
    'purple-haze': 'from-pink-400 to-purple-400'
  }

  const mockFiles: FileItem[] = [
    {
      name: 'seo-calculator',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file' },
        { name: 'styles.css', type: 'file' },
        { name: 'script.js', type: 'file' },
        {
          name: 'images',
          type: 'folder',
          children: [
            { name: 'favicon.png', type: 'file' },
            { name: 'goldie_agency_logo.png', type: 'file' },
            { name: 'julian_goldie_profile.jpg', type: 'file' }
          ]
        }
      ]
    }
  ]

  const mockSteps: TaskStep[] = [
    {
      id: '1',
      title: 'Researching Julian Goldie and starting website development',
      status: 'completed',
      details: ['Found LinkedIn profile', 'Located YouTube channel', 'Identified personal website'],
      expandable: true
    },
    {
      id: '2',
      title: 'Found 7 sources',
      status: 'completed',
      details: [
        'LinkedIn: https://www.linkedin.com/in/juliangoldieseo/',
        'YouTube: Julian Goldie SEO',
        'Personal website: juliangoldie.com'
      ],
      expandable: true
    },
    {
      id: '3',
      title: 'Searched Julian Goldie picture profile photo',
      status: 'completed',
      expandable: false
    },
    {
      id: '4',
      title: 'Downloaded media.licdn.com/...profile_img.jpg',
      status: 'completed',
      expandable: false
    },
    {
      id: '5',
      title: 'Generating HTML structure and interactive calculator',
      status: 'completed',
      details: ['Created responsive layout', 'Built SEO ROI calculator', 'Integrated branding elements'],
      expandable: true
    }
  ]

  const handlePromptSubmit = () => {
    if (!currentPrompt.trim()) return
    
    setIsWorking(true)
    setWorkspaceActive(true)
    
    // Simulate task execution
    setTimeout(() => {
      setTaskSteps(mockSteps)
      setIsWorking(false)
    }, 2000)
  }

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const renderFileTree = (files: FileItem[], level = 0) => {
    return files.map((file, index) => (
      <div key={index} className="select-none">
        <div 
          className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-white/10 transition-colors ${
            selectedFile === file.name ? 'bg-white/20' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => file.type === 'file' && setSelectedFile(file.name)}
        >
          {file.type === 'folder' ? (
            <FolderOpen className="w-4 h-4 text-yellow-400" />
          ) : (
            <FileText className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-sm text-white/90">{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ))
  }

  const ThemeIcon = () => {
    switch (theme) {
      case 'nightie-stars':
        return <Star className="w-4 h-4" />
      case 'daytime-clouds':
        return <Cloud className="w-4 h-4" />
      case 'purple-haze':
        return <Sparkles className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  if (!workspaceActive) {
    return (
      <div className={`min-h-screen ${themeClasses[theme]} flex items-center justify-center p-4 relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {theme === 'nightie-stars' && (
            <>
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </>
          )}
          {theme === 'daytime-clouds' && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-16 bg-white/20 rounded-full blur-xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, 100, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </>
          )}
          {theme === 'purple-haze' && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-sm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <motion.div 
          className="w-full max-w-2xl mx-auto text-center space-y-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Theme indicator */}
          <motion.div 
            className="flex items-center justify-center gap-2 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ThemeIcon />
            <span className="text-sm capitalize">{theme.replace('-', ' ')}</span>
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Hey {userName}, Got work?
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light">
              Let's jam! ✨
            </p>
          </motion.div>

          {/* Main input */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <Input
                placeholder="Let Scout do it for you"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePromptSubmit()}
                className="w-full h-16 text-lg px-6 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 rounded-2xl shadow-2xl"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Fast AF
                </Badge>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </div>
            </div>

            <Button 
              onClick={handlePromptSubmit}
              disabled={!currentPrompt.trim()}
              className={`w-full h-12 bg-gradient-to-r ${themeAccents[theme]} hover:opacity-90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]`}
            >
              <Plus className="w-5 h-5 mr-2" />
              New
            </Button>
          </motion.div>

          {/* Action buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: Search, label: 'Research' },
              { icon: Lightbulb, label: 'Create' },
              { icon: Calendar, label: 'Plan' },
              { icon: BarChart3, label: 'Analyze' },
              { icon: BookOpen, label: 'Learn' }
            ].map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </motion.div>

          {/* Alpha notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-yellow-500/20 border-yellow-500/30 backdrop-blur-md">
              <div className="p-4 text-center">
                <p className="text-yellow-200 text-sm">
                  🚀 Scout Alpha - Experiencing high demand. Join our{' '}
                  <span className="underline cursor-pointer">Discord</span> and{' '}
                  <span className="underline cursor-pointer">X</span> for updates.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-all duration-500`}>
      {/* Header */}
      <motion.div 
        className="border-b border-white/10 bg-black/20 backdrop-blur-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThemeIcon />
              <span className="text-white font-semibold">Scout.new</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <Input
                placeholder="Let Scout do it for you"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                className="w-96 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button size="sm" className={`bg-gradient-to-r ${themeAccents[theme]} text-white`}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Alpha
          </Badge>
        </div>
      </motion.div>

      {/* Main workspace */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left pane - Chat & Workflow */}
        <motion.div 
          className="w-1/2 border-r border-white/10 bg-black/10 backdrop-blur-sm"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-white text-lg font-semibold mb-2">Scout's Thought Process</h2>
              <p className="text-white/60 text-sm">Building SEO calculator for Julian Goldie</p>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {taskSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => step.expandable && toggleStepExpansion(step.id)}
                      >
                        <div className="flex items-center gap-3">
                          {step.status === 'completed' && (
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                          )}
                          {step.status === 'running' && (
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                          )}
                          {step.status === 'pending' && (
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          )}
                          <span className="text-white text-sm flex-1">{step.title}</span>
                          {step.expandable && (
                            <ChevronRight 
                              className={`w-4 h-4 text-white/60 transition-transform ${
                                expandedSteps.has(step.id) ? 'rotate-90' : ''
                              }`} 
                            />
                          )}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {step.expandable && expandedSteps.has(step.id) && step.details && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/10"
                          >
                            <div className="p-4 space-y-2">
                              {step.details.map((detail, idx) => (
                                <div key={idx} className="text-white/70 text-xs flex items-center gap-2">
                                  <div className="w-1 h-1 bg-white/40 rounded-full" />
                                  {detail}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!isWorking && taskSteps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
                  >
                    <p className="text-green-300 font-semibold">🎉 Scout is done with the task!</p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-4">
              <Input
                placeholder="Ask Scout to modify or create something new..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Right pane - File browser & Preview */}
        <motion.div 
          className="w-1/2 bg-black/5 backdrop-blur-sm"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="h-full flex flex-col">
            {/* File browser */}
            <div className="border-b border-white/10 bg-black/10">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-3">Project Files</h3>
                <div className="space-y-1">
                  {renderFileTree(mockFiles)}
                </div>
              </div>
            </div>

            {/* Preview area */}
            <div className="flex-1 p-4">
              <div className="h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${themeAccents[theme]} rounded-full flex items-center justify-center`}>
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">SEO Calculator</h3>
                    <p className="text-gray-600">Interactive ROI calculator for Julian Goldie's agency</p>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download all
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in new tab
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface ScoutUI1Props {
  userName?: string;
  theme?: 'nightie-stars' | 'daytime-clouds' | 'purple-haze';
  reducedMotion?: boolean;
  neurodivergentMode?: boolean;
}

export default function ScoutUI1(props: ScoutUI1Props) {
  return <ScoutUI {...props} />
}

export { ScoutUI as ScoutUIClassic };
