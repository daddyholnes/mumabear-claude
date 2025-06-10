// filepath: shared-components/src/components/scout-ui/ScoutUI2.tsx
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/cn"
import {
  Zap,
  Search,
  FileText,
  BarChart3,
  BookOpen,
  ArrowUpIcon,
  Paperclip,
  Command,
  SendIcon,
  LoaderIcon,
  Sparkles,
  Plus,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Image as ImageIcon,
  Code,
  Folder,
  Star,
  Moon,
  Sun,
  Cloud,
  Settings,
  CheckCircle,
  Clock
} from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"

interface ScoutUI2Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

interface TaskStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed"
  expanded?: boolean
  substeps?: string[]
}

interface GeneratedFile {
  name: string
  type: "html" | "css" | "js" | "image" | "other"
  content?: string
  size: string
}

const ScoutUI2 = React.forwardRef<HTMLDivElement, ScoutUI2Props>(
  ({ 
    reducedMotion = false, 
    neurodivergentMode = false, 
    theme = 'system', 
    className,
    ...props 
  }, ref) => {
    const [prompt, setPrompt] = React.useState("")
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [expandedStep, setExpandedStep] = React.useState<string | null>(null)
    const [activeTab, setActiveTab] = React.useState("overview")
    const [generatedFiles, setGeneratedFiles] = React.useState<GeneratedFile[]>([])

    const taskSteps: TaskStep[] = [
      {
        id: "analyze",
        title: "Analyzing Requirements",
        description: "Understanding your project needs and technical requirements",
        status: "completed",
        substeps: [
          "Parse user requirements",
          "Identify technology stack",
          "Plan project structure"
        ]
      },
      {
        id: "design",
        title: "Creating Design System",
        description: "Building a cohesive design language and component library",
        status: "running",
        substeps: [
          "Generate color palette",
          "Design component library",
          "Create responsive layouts"
        ]
      },
      {
        id: "implement",
        title: "Code Generation",
        description: "Writing optimized, production-ready code",
        status: "pending"
      }
    ]

    const handleGenerate = () => {
      if (!prompt.trim()) return
      setIsGenerating(true)
      // Simulate generation process
      setTimeout(() => {
        setIsGenerating(false)
        setGeneratedFiles([
          { name: "index.html", type: "html", size: "2.3 KB" },
          { name: "styles.css", type: "css", size: "1.8 KB" },
          { name: "script.js", type: "js", size: "0.9 KB" }
        ])
      }, 3000)
    }

    const toggleStep = (stepId: string) => {
      if (reducedMotion) return // Skip animations if reduced motion
      setExpandedStep(expandedStep === stepId ? null : stepId)
    }

    return (
      <div 
        ref={ref}
        className={cn(
          "h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
          "dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950",
          neurodivergentMode && "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
          neurodivergentMode && "dark:from-blue-950 dark:via-purple-950 dark:to-pink-950",
          className
        )}
        {...props}
      >
        {/* Header */}
        <header className={cn(
          "flex items-center justify-between p-4 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b",
          neurodivergentMode && "p-6 border-b-2"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center",
              neurodivergentMode && "w-12 h-12 rounded-2xl"
            )}>
              <Sparkles className={cn("w-5 h-5 text-white", neurodivergentMode && "w-6 h-6")} />
            </div>
            <div>
              <h1 className={cn(
                "text-xl font-bold text-slate-900 dark:text-slate-100",
                neurodivergentMode && "text-2xl leading-relaxed"
              )}>
                Scout UI Builder
              </h1>
              <p className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                neurodivergentMode && "text-base leading-relaxed"
              )}>
                AI-powered interface generation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size={neurodivergentMode ? "lg" : "default"}
              className={cn(
                neurodivergentMode && "px-6 py-3 text-base"
              )}
            >
              <Settings className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
              {neurodivergentMode && <span className="ml-2">Settings</span>}
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-5rem)]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Prompt Input */}
            <div className={cn(
              "p-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b",
              neurodivergentMode && "p-8 border-b-2"
            )}>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <Textarea
                    placeholder="Describe the interface you want to build..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    reducedMotion={reducedMotion}
                    neurodivergentMode={neurodivergentMode}
                    className={cn(
                      "min-h-[120px] pr-16 resize-none",
                      neurodivergentMode && "min-h-[160px] text-lg leading-relaxed"
                    )}
                    disabled={isGenerating}
                  />
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isGenerating}
                      className={cn(
                        neurodivergentMode && "h-10 w-10"
                      )}
                    >
                      <Paperclip className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
                    </Button>
                    
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      size={neurodivergentMode ? "lg" : "default"}
                      className={cn(
                        "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                        neurodivergentMode && "px-6 py-3"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <LoaderIcon className={cn(
                            "w-4 h-4 animate-spin mr-2",
                            neurodivergentMode && "w-5 h-5"
                          )} />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className={cn(
              "p-6 bg-slate-50/50 dark:bg-slate-900/50",
              neurodivergentMode && "p-8"
            )}>
              <div className="max-w-4xl mx-auto">
                <h2 className={cn(
                  "text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100",
                  neurodivergentMode && "text-xl leading-relaxed"
                )}>
                  Generation Progress
                </h2>
                
                <div className="space-y-3">
                  {taskSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                      transition={reducedMotion ? {} : { delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "p-4 border transition-all duration-200",
                        step.status === "completed" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
                        step.status === "running" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
                        step.status === "pending" && "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950",
                        neurodivergentMode && "p-6 border-2"
                      )}>
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleStep(step.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              toggleStep(step.id)
                            }
                          }}
                          aria-expanded={expandedStep === step.id}
                          aria-controls={`step-${step.id}-content`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              step.status === "completed" && "bg-green-500",
                              step.status === "running" && "bg-blue-500",
                              step.status === "pending" && "bg-slate-300 dark:bg-slate-700",
                              neurodivergentMode && "w-10 h-10"
                            )}>
                              {step.status === "completed" && (
                                <CheckCircle className={cn("w-4 h-4 text-white", neurodivergentMode && "w-5 h-5")} />
                              )}
                              {step.status === "running" && (
                                <LoaderIcon className={cn("w-4 h-4 text-white animate-spin", neurodivergentMode && "w-5 h-5")} />
                              )}
                              {step.status === "pending" && (
                                <Clock className={cn("w-4 h-4 text-slate-500", neurodivergentMode && "w-5 h-5")} />
                              )}
                            </div>
                            
                            <div>
                              <h3 className={cn(
                                "font-medium text-slate-900 dark:text-slate-100",
                                neurodivergentMode && "text-lg leading-relaxed"
                              )}>
                                {step.title}
                              </h3>
                              <p className={cn(
                                "text-sm text-slate-600 dark:text-slate-400",
                                neurodivergentMode && "text-base leading-relaxed"
                              )}>
                                {step.description}
                              </p>
                            </div>
                          </div>
                          
                          {step.substeps && (
                            <ChevronDown className={cn(
                              "w-5 h-5 text-slate-400 transition-transform",
                              expandedStep === step.id && "rotate-180",
                              neurodivergentMode && "w-6 h-6"
                            )} />
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {expandedStep === step.id && step.substeps && (
                            <motion.div
                              id={`step-${step.id}-content`}
                              initial={reducedMotion ? {} : { height: 0, opacity: 0 }}
                              animate={reducedMotion ? {} : { height: "auto", opacity: 1 }}
                              exit={reducedMotion ? {} : { height: 0, opacity: 0 }}
                              transition={reducedMotion ? {} : { duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className={cn("pt-4 pl-11", neurodivergentMode && "pt-6 pl-14")}>
                                <ul className="space-y-2">
                                  {step.substeps.map((substep, subIndex) => (
                                    <li 
                                      key={subIndex}
                                      className={cn(
                                        "text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2",
                                        neurodivergentMode && "text-base leading-relaxed"
                                      )}
                                    >
                                      <div className={cn(
                                        "w-1.5 h-1.5 bg-slate-400 rounded-full",
                                        neurodivergentMode && "w-2 h-2"
                                      )} />
                                      {substep}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Files */}
            {generatedFiles.length > 0 && (
              <div className={cn(
                "p-6 bg-white/50 dark:bg-black/50",
                neurodivergentMode && "p-8"
              )}>
                <div className="max-w-4xl mx-auto">
                  <h2 className={cn(
                    "text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100",
                    neurodivergentMode && "text-xl leading-relaxed"
                  )}>
                    Generated Files
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedFiles.map((file, index) => (
                      <Card key={index} className={cn(
                        "p-4 hover:shadow-md transition-shadow",
                        neurodivergentMode && "p-6 border-2"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className={cn("w-5 h-5 text-blue-500", neurodivergentMode && "w-6 h-6")} />
                            <div>
                              <p className={cn(
                                "font-medium text-slate-900 dark:text-slate-100",
                                neurodivergentMode && "text-lg"
                              )}>
                                {file.name}
                              </p>
                              <p className={cn(
                                "text-sm text-slate-500",
                                neurodivergentMode && "text-base"
                              )}>
                                {file.size}
                              </p>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size={neurodivergentMode ? "lg" : "sm"}
                            className={cn(
                              neurodivergentMode && "h-10 w-10"
                            )}
                          >
                            <Download className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

ScoutUI2.displayName = "ScoutUI2"

export { ScoutUI2 }
export type { ScoutUI2Props }
