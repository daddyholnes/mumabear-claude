// filepath: shared-components/src/components/scout-ui/ScoutUI4.tsx
"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "../../utils/cn"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { 
  Zap, 
  Plus, 
  Search, 
  FileText, 
  Lightbulb, 
  BarChart3, 
  GraduationCap,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  Cloud,
  Moon,
  Mic,
  Video,
  Upload,
  Image,
  Monitor,
  GripVertical,
  X,
  Maximize2,
  Minimize2,
  Settings,
  Sparkles,
  Code,
  Globe,
  Smartphone,
  Tablet
} from "lucide-react"

interface ScoutUI4Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

interface ProjectCard {
  id: string
  title: string
  description: string
  status: 'planning' | 'in-progress' | 'review' | 'completed'
  progress: number
  tags: string[]
  lastUpdated: Date
  collaborators: number
}

interface ToolCard {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'ai' | 'design' | 'development' | 'analytics'
  isActive: boolean
}

const ScoutUI4 = React.forwardRef<HTMLDivElement, ScoutUI4Props>(
  ({ 
    reducedMotion = false, 
    neurodivergentMode = false, 
    theme = 'system', 
    className,
    ...props 
  }, ref) => {
    const [activeSection, setActiveSection] = React.useState("dashboard")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const [selectedProject, setSelectedProject] = React.useState<string | null>(null)

    const { scrollY } = useScroll()
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95])
    const headerBlur = useTransform(scrollY, [0, 100], [0, 10])

    const projects: ProjectCard[] = [
      {
        id: "1",
        title: "AI-Powered Dashboard",
        description: "Building an intelligent analytics dashboard with real-time insights",
        status: "in-progress",
        progress: 65,
        tags: ["React", "TypeScript", "AI"],
        lastUpdated: new Date(),
        collaborators: 3
      },
      {
        id: "2", 
        title: "Mobile App Redesign",
        description: "Complete UX overhaul for better accessibility and user engagement",
        status: "review",
        progress: 90,
        tags: ["UI/UX", "Mobile", "Figma"],
        lastUpdated: new Date(),
        collaborators: 5
      },
      {
        id: "3",
        title: "API Integration Suite",
        description: "Seamless third-party integrations with enhanced security",
        status: "planning", 
        progress: 15,
        tags: ["API", "Node.js", "Security"],
        lastUpdated: new Date(),
        collaborators: 2
      }
    ]

    const tools: ToolCard[] = [
      {
        id: "ai-assistant",
        name: "AI Code Assistant",
        description: "Intelligent code generation and debugging",
        icon: <Sparkles className="w-5 h-5" />,
        category: "ai",
        isActive: true
      },
      {
        id: "design-system",
        name: "Design System Builder",
        description: "Create consistent UI components and patterns",
        icon: <Monitor className="w-5 h-5" />,
        category: "design", 
        isActive: true
      },
      {
        id: "analytics",
        name: "Performance Analytics", 
        description: "Real-time application monitoring and insights",
        icon: <BarChart3 className="w-5 h-5" />,
        category: "analytics",
        isActive: false
      },
      {
        id: "deployment",
        name: "Auto Deployment",
        description: "Continuous integration and deployment pipeline",
        icon: <Cloud className="w-5 h-5" />,
        category: "development",
        isActive: true
      }
    ]

    const getStatusColor = (status: ProjectCard['status']) => {
      switch (status) {
        case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }
    }

    const getCategoryIcon = (category: ToolCard['category']) => {
      switch (category) {
        case 'ai': return <Sparkles className="w-4 h-4" />
        case 'design': return <Monitor className="w-4 h-4" />
        case 'development': return <Code className="w-4 h-4" />
        case 'analytics': return <BarChart3 className="w-4 h-4" />
      }
    }

    return (
      <div 
        ref={ref}
        className={cn(
          "h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
          "dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950",
          neurodivergentMode && "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
          neurodivergentMode && "dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950",
          isFullscreen && "fixed inset-0 z-50",
          className
        )}
        {...props}
      >
        {/* Dynamic Header */}
        <motion.header 
          className={cn(
            "sticky top-0 z-40 flex items-center justify-between p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b",
            neurodivergentMode && "p-6 border-b-2"
          )}
          style={{
            opacity: reducedMotion ? 1 : headerOpacity,
            backdropFilter: reducedMotion ? 'blur(12px)' : `blur(${headerBlur}px)`
          }}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center",
              neurodivergentMode && "w-12 h-12 rounded-2xl"
            )}>
              <Zap className={cn("w-5 h-5 text-white", neurodivergentMode && "w-6 h-6")} />
            </div>
            
            <div>
              <h1 className={cn(
                "text-xl font-bold text-slate-900 dark:text-slate-100",
                neurodivergentMode && "text-2xl leading-relaxed"
              )}>
                Scout Workspace
              </h1>
              <p className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                neurodivergentMode && "text-base leading-relaxed"
              )}>
                Intelligent development environment
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400",
                neurodivergentMode && "w-5 h-5 left-4"
              )} />
              <Input
                placeholder="Search projects, tools, or ask AI assistant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-slate-200 dark:border-slate-800",
                  neurodivergentMode && "pl-12 h-12 text-base"
                )}
              />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2",
                  neurodivergentMode && "right-3 h-8 w-8"
                )}
              >
                <Mic className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={cn(
                neurodivergentMode && "h-12 w-12"
              )}
            >
              {isFullscreen ? 
                <Minimize2 className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} /> : 
                <Maximize2 className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
              }
            </Button>
            
            <Button 
              variant="outline" 
              size={neurodivergentMode ? "lg" : "default"}
              className={cn(
                neurodivergentMode && "px-6 py-3 text-base"
              )}
            >
              <Settings className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
              Settings
            </Button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-5rem)]">
          {/* Sidebar Navigation */}
          <nav className={cn(
            "w-64 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-r p-4 overflow-y-auto",
            neurodivergentMode && "w-80 p-6 border-r-2"
          )}>
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <Monitor className="w-4 h-4" /> },
                { id: 'projects', label: 'Projects', icon: <FileText className="w-4 h-4" /> },
                { id: 'tools', label: 'AI Tools', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    neurodivergentMode && "h-12 text-base px-4"
                  )}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </div>

            <div className={cn("my-6 h-px bg-border", neurodivergentMode && "my-8 h-0.5")} />

            {/* Quick Tools */}
            <div>
              <h3 className={cn(
                "text-sm font-medium text-slate-600 dark:text-slate-400 mb-3",
                neurodivergentMode && "text-base leading-relaxed"
              )}>
                Quick Tools
              </h3>
              
              <div className="space-y-2">
                {tools.filter(tool => tool.isActive).map((tool) => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2 text-xs",
                      neurodivergentMode && "h-10 text-sm px-3"
                    )}
                  >
                    {getCategoryIcon(tool.category)}
                    {tool.name}
                  </Button>
                ))}
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <main className={cn(
            "flex-1 overflow-y-auto p-6",
            neurodivergentMode && "p-8"
          )}>
            {activeSection === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={cn(
                    "text-2xl font-bold text-slate-900 dark:text-slate-100",
                    neurodivergentMode && "text-3xl leading-relaxed"
                  )}>
                    Active Projects
                  </h2>
                  
                  <Button 
                    className={cn(
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                      neurodivergentMode && "px-6 py-3 text-base"
                    )}
                  >
                    <Plus className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
                    New Project
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                      whileHover={reducedMotion ? {} : { y: -5 }}
                      transition={reducedMotion ? {} : { duration: 0.2 }}
                    >
                      <Card className={cn(
                        "p-6 h-full cursor-pointer transition-all duration-200 hover:shadow-lg",
                        selectedProject === project.id && "ring-2 ring-blue-500",
                        neurodivergentMode && "p-8 border-2"
                      )}
                      onClick={() => setSelectedProject(
                        selectedProject === project.id ? null : project.id
                      )}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={cn(
                              "font-semibold text-slate-900 dark:text-slate-100 mb-2",
                              neurodivergentMode && "text-lg leading-relaxed"
                            )}>
                              {project.title}
                            </h3>
                            <p className={cn(
                              "text-sm text-slate-600 dark:text-slate-400 mb-4",
                              neurodivergentMode && "text-base leading-relaxed"
                            )}>
                              {project.description}
                            </p>
                          </div>
                          
                          <Badge className={cn(
                            getStatusColor(project.status),
                            neurodivergentMode && "text-base px-3 py-1"
                          )}>
                            {project.status}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className={cn(
                              "text-sm text-slate-600 dark:text-slate-400",
                              neurodivergentMode && "text-base"
                            )}>
                              Progress
                            </span>
                            <span className={cn(
                              "text-sm font-medium text-slate-900 dark:text-slate-100",
                              neurodivergentMode && "text-base"
                            )}>
                              {project.progress}%
                            </span>
                          </div>
                          <div className={cn(
                            "w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2",
                            neurodivergentMode && "h-3"
                          )}>
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                neurodivergentMode && "text-sm px-3 py-1"
                              )}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                          <span className={cn(
                            neurodivergentMode && "text-sm"
                          )}>
                            {project.collaborators} collaborators
                          </span>
                          <span className={cn(
                            neurodivergentMode && "text-sm"
                          )}>
                            Updated {project.lastUpdated.toLocaleDateString()}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'tools' && (
              <div>
                <div className="mb-6">
                  <h2 className={cn(
                    "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
                    neurodivergentMode && "text-3xl leading-relaxed"
                  )}>
                    AI Tools & Integrations
                  </h2>
                  <p className={cn(
                    "text-slate-600 dark:text-slate-400",
                    neurodivergentMode && "text-lg leading-relaxed"
                  )}>
                    Powerful tools to accelerate your development workflow
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool) => (
                    <Card key={tool.id} className={cn(
                      "p-6 transition-all duration-200 hover:shadow-lg",
                      tool.isActive && "ring-2 ring-green-500 bg-green-50 dark:bg-green-950",
                      neurodivergentMode && "p-8 border-2"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                          "w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white",
                          neurodivergentMode && "w-16 h-16 rounded-2xl"
                        )}>
                          {tool.icon}
                        </div>
                        
                        <Badge 
                          variant={tool.isActive ? "default" : "secondary"}
                          className={cn(
                            neurodivergentMode && "text-base px-3 py-1"
                          )}
                        >
                          {tool.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <h3 className={cn(
                        "font-semibold text-slate-900 dark:text-slate-100 mb-2",
                        neurodivergentMode && "text-lg leading-relaxed"
                      )}>
                        {tool.name}
                      </h3>
                      
                      <p className={cn(
                        "text-sm text-slate-600 dark:text-slate-400 mb-4",
                        neurodivergentMode && "text-base leading-relaxed"
                      )}>
                        {tool.description}
                      </p>
                      
                      <Button 
                        variant={tool.isActive ? "outline" : "default"}
                        className={cn(
                          "w-full",
                          neurodivergentMode && "h-12 text-base"
                        )}
                      >
                        {tool.isActive ? "Configure" : "Activate"}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'dashboard' && (
              <div>
                <h2 className={cn(
                  "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6",
                  neurodivergentMode && "text-3xl leading-relaxed"
                )}>
                  Welcome to Scout Workspace
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className={cn(
                    "p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950",
                    neurodivergentMode && "p-8 border-2"
                  )}>
                    <h3 className={cn(
                      "text-lg font-semibold mb-4",
                      neurodivergentMode && "text-xl leading-relaxed"
                    )}>
                      Project Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={cn(
                          "text-slate-600 dark:text-slate-400",
                          neurodivergentMode && "text-base"
                        )}>
                          Active Projects
                        </span>
                        <span className={cn(
                          "font-semibold",
                          neurodivergentMode && "text-lg"
                        )}>
                          {projects.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={cn(
                          "text-slate-600 dark:text-slate-400",
                          neurodivergentMode && "text-base"
                        )}>
                          In Progress
                        </span>
                        <span className={cn(
                          "font-semibold text-yellow-600",
                          neurodivergentMode && "text-lg"
                        )}>
                          {projects.filter(p => p.status === 'in-progress').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={cn(
                          "text-slate-600 dark:text-slate-400",
                          neurodivergentMode && "text-base"
                        )}>
                          Completed
                        </span>
                        <span className={cn(
                          "font-semibold text-green-600",
                          neurodivergentMode && "text-lg"
                        )}>
                          {projects.filter(p => p.status === 'completed').length}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className={cn(
                    "p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950",
                    neurodivergentMode && "p-8 border-2"
                  )}>
                    <h3 className={cn(
                      "text-lg font-semibold mb-4",
                      neurodivergentMode && "text-xl leading-relaxed"
                    )}>
                      AI Tools Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={cn(
                          "text-slate-600 dark:text-slate-400",
                          neurodivergentMode && "text-base"
                        )}>
                          Active Tools
                        </span>
                        <span className={cn(
                          "font-semibold text-green-600",
                          neurodivergentMode && "text-lg"
                        )}>
                          {tools.filter(t => t.isActive).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={cn(
                          "text-slate-600 dark:text-slate-400",
                          neurodivergentMode && "text-base"
                        )}>
                          Available Tools
                        </span>
                        <span className={cn(
                          "font-semibold",
                          neurodivergentMode && "text-lg"
                        )}>
                          {tools.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={cn(
                          "text-slate-600 dark:text-slate-400",
                          neurodivergentMode && "text-base"
                        )}>
                          System Status
                        </span>
                        <Badge 
                          className={cn(
                            "bg-green-100 text-green-800",
                            neurodivergentMode && "text-base px-3 py-1"
                          )}
                        >
                          Operational
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="text-center">
                  <p className={cn(
                    "text-slate-600 dark:text-slate-400 mb-6",
                    neurodivergentMode && "text-lg leading-relaxed"
                  )}>
                    Ready to build something amazing? Start by creating a new project or exploring our AI tools.
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setActiveSection('projects')}
                      className={cn(
                        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                        neurodivergentMode && "px-8 py-4 text-lg"
                      )}
                    >
                      <Plus className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
                      New Project
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setActiveSection('tools')}
                      className={cn(
                        neurodivergentMode && "px-8 py-4 text-lg"
                      )}
                    >
                      <Sparkles className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
                      Explore Tools
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }
)

ScoutUI4.displayName = "ScoutUI4"

export { ScoutUI4 }
export type { ScoutUI4Props }
