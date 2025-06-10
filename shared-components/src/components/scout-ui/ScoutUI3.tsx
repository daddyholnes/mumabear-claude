// filepath: shared-components/src/components/scout-ui/ScoutUI3.tsx
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/cn"
import {
  Zap,
  Search,
  PlusCircle,
  BarChart3,
  BookOpen,
  Sparkles,
  Command,
  Send,
  Paperclip,
  X,
  Loader,
  FileText,
  Code,
  Image as ImageIcon,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  Globe,
  Linkedin,
  Youtube,
  Facebook,
  Monitor,
  Smartphone,
  Tablet,
  Copy
} from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"

interface ScoutUI3Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

interface SocialPlatform {
  name: string
  icon: React.ReactNode
  color: string
  url: string
  engagement: number
}

interface AnalyticsData {
  views: number
  engagement: number
  conversions: number
  trend: 'up' | 'down' | 'stable'
}

const ScoutUI3 = React.forwardRef<HTMLDivElement, ScoutUI3Props>(
  ({ 
    reducedMotion = false, 
    neurodivergentMode = false, 
    theme = 'system', 
    className,
    ...props 
  }, ref) => {
    const [activeTab, setActiveTab] = React.useState("create")
    const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([])
    const [contentIdea, setContentIdea] = React.useState("")
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [generatedContent, setGeneratedContent] = React.useState<any[]>([])

    const socialPlatforms: SocialPlatform[] = [
      {
        name: "LinkedIn",
        icon: <Linkedin className="w-5 h-5" />,
        color: "bg-blue-600",
        url: "https://linkedin.com",
        engagement: 85
      },
      {
        name: "YouTube",
        icon: <Youtube className="w-5 h-5" />,
        color: "bg-red-600",
        url: "https://youtube.com",
        engagement: 72
      },
      {
        name: "Facebook",
        icon: <Facebook className="w-5 h-5" />,
        color: "bg-blue-500",
        url: "https://facebook.com",
        engagement: 68
      }
    ]

    const analyticsData: AnalyticsData = {
      views: 12450,
      engagement: 8.3,
      conversions: 156,
      trend: 'up'
    }

    const togglePlatform = (platform: string) => {
      setSelectedPlatforms(prev => {
        const index = prev.indexOf(platform)
        return index > -1 
          ? prev.filter(p => p !== platform)
          : [...prev, platform]
      })
    }

    const handleGenerate = () => {
      if (!contentIdea.trim() || selectedPlatforms.length === 0) return
      
      setIsGenerating(true)
      // Simulate content generation
      setTimeout(() => {
        setIsGenerating(false)
        setGeneratedContent([
          {
            platform: "LinkedIn",
            type: "Professional Post",
            content: "🚀 Excited to share insights about...",
            media: "infographic.jpg",
            hashtags: ["#Innovation", "#Technology", "#Growth"]
          },
          {
            platform: "YouTube",
            type: "Video Script",
            content: "Hook: Did you know that...",
            media: "thumbnail.jpg",
            duration: "8:42"
          }
        ])
      }, 2500)
    }

    return (
      <div 
        ref={ref}
        className={cn(
          "h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50",
          "dark:from-purple-950 dark:via-pink-950 dark:to-orange-950",
          neurodivergentMode && "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
          neurodivergentMode && "dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950",
          className
        )}
        {...props}
      >
        {/* Header */}
        <header className={cn(
          "flex items-center justify-between p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b",
          neurodivergentMode && "p-6 border-b-2"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center",
              neurodivergentMode && "w-12 h-12 rounded-2xl"
            )}>
              <Sparkles className={cn("w-5 h-5 text-white", neurodivergentMode && "w-6 h-6")} />
            </div>
            <div>
              <h1 className={cn(
                "text-xl font-bold text-slate-900 dark:text-slate-100",
                neurodivergentMode && "text-2xl leading-relaxed"
              )}>
                Social Content Studio
              </h1>
              <p className={cn(
                "text-sm text-slate-600 dark:text-slate-400",
                neurodivergentMode && "text-base leading-relaxed"
              )}>
                Multi-platform content generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className={cn(
                "text-green-600 border-green-200 bg-green-50",
                neurodivergentMode && "text-base px-4 py-2"
              )}
            >
              <div className={cn(
                "w-2 h-2 bg-green-500 rounded-full mr-2",
                neurodivergentMode && "w-3 h-3"
              )} />
              All Systems Active
            </Badge>

            <Button 
              variant="outline" 
              size={neurodivergentMode ? "lg" : "default"}
              className={cn(
                neurodivergentMode && "px-6 py-3 text-base"
              )}
            >
              <BarChart3 className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
              Analytics
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-5rem)]">
          {/* Sidebar - Platform Selection */}
          <div className={cn(
            "w-80 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-r p-6",
            neurodivergentMode && "w-96 p-8 border-r-2"
          )}>
            <h2 className={cn(
              "text-lg font-semibold mb-6 text-slate-900 dark:text-slate-100",
              neurodivergentMode && "text-xl leading-relaxed"
            )}>
              Select Platforms
            </h2>

            <div className="space-y-4">
              {socialPlatforms.map((platform) => (
                <Card 
                  key={platform.name}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200 border-2",
                    selectedPlatforms.indexOf(platform.name) > -1
                      ? "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950" 
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700",
                    neurodivergentMode && "p-6"
                  )}
                  onClick={() => togglePlatform(platform.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      togglePlatform(platform.name)
                    }
                  }}
                  aria-pressed={selectedPlatforms.indexOf(platform.name) > -1}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      platform.color, 
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                      neurodivergentMode && "w-12 h-12 rounded-xl"
                    )}>
                      {platform.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-medium text-slate-900 dark:text-slate-100",
                        neurodivergentMode && "text-lg"
                      )}>
                        {platform.name}
                      </h3>
                      <p className={cn(
                        "text-sm text-slate-600 dark:text-slate-400",
                        neurodivergentMode && "text-base"
                      )}>
                        {platform.engagement}% engagement
                      </p>
                    </div>

                    {selectedPlatforms.indexOf(platform.name) > -1 && (
                      <CheckCircle className={cn(
                        "w-5 h-5 text-purple-600",
                        neurodivergentMode && "w-6 h-6"
                      )} />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className={cn("my-6 h-px bg-border", neurodivergentMode && "my-8 h-0.5")} />

            {/* Analytics Preview */}
            <div>
              <h3 className={cn(
                "text-md font-medium mb-4 text-slate-900 dark:text-slate-100",
                neurodivergentMode && "text-lg leading-relaxed"
              )}>
                Performance Overview
              </h3>
              
              <div className="space-y-3">
                <div className={cn(
                  "flex justify-between items-center",
                  neurodivergentMode && "py-2"
                )}>
                  <span className={cn(
                    "text-sm text-slate-600 dark:text-slate-400",
                    neurodivergentMode && "text-base"
                  )}>
                    Total Views
                  </span>
                  <span className={cn(
                    "font-semibold text-slate-900 dark:text-slate-100",
                    neurodivergentMode && "text-lg"
                  )}>
                    {analyticsData.views.toLocaleString()}
                  </span>
                </div>
                
                <div className={cn(
                  "flex justify-between items-center",
                  neurodivergentMode && "py-2"
                )}>
                  <span className={cn(
                    "text-sm text-slate-600 dark:text-slate-400",
                    neurodivergentMode && "text-base"
                  )}>
                    Engagement Rate
                  </span>
                  <span className={cn(
                    "font-semibold text-green-600",
                    neurodivergentMode && "text-lg"
                  )}>
                    {analyticsData.engagement}%
                  </span>
                </div>
                
                <div className={cn(
                  "flex justify-between items-center",
                  neurodivergentMode && "py-2"
                )}>
                  <span className={cn(
                    "text-sm text-slate-600 dark:text-slate-400",
                    neurodivergentMode && "text-base"
                  )}>
                    Conversions
                  </span>
                  <span className={cn(
                    "font-semibold text-blue-600",
                    neurodivergentMode && "text-lg"
                  )}>
                    {analyticsData.conversions}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Content Input */}
            <div className={cn(
              "p-6 bg-gradient-to-r from-white/80 to-purple-50/80 dark:from-black/80 dark:to-purple-950/80 backdrop-blur-sm border-b",
              neurodivergentMode && "p-8 border-b-2"
            )}>
              <h2 className={cn(
                "text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100",
                neurodivergentMode && "text-xl leading-relaxed"
              )}>
                Content Idea
              </h2>
              
              <div className="relative">
                <Textarea
                  placeholder="Describe your content idea, key message, or topic you want to create content about..."
                  value={contentIdea}
                  onChange={(e) => setContentIdea(e.target.value)}
                  reducedMotion={reducedMotion}
                  neurodivergentMode={neurodivergentMode}
                  className={cn(
                    "min-h-[100px] pr-16 resize-none",
                    neurodivergentMode && "min-h-[120px] text-lg leading-relaxed"
                  )}
                  disabled={isGenerating}
                />
                
                <div className="absolute bottom-4 right-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !contentIdea.trim() || selectedPlatforms.length === 0}
                    size={neurodivergentMode ? "lg" : "default"}
                    className={cn(
                      "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
                      neurodivergentMode && "px-6 py-3"
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <Loader className={cn(
                          "w-4 h-4 animate-spin mr-2",
                          neurodivergentMode && "w-5 h-5"
                        )} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className={cn("w-4 h-4 mr-2", neurodivergentMode && "w-5 h-5")} />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Generated Content */}
            <div className={cn(
              "flex-1 p-6 overflow-y-auto",
              neurodivergentMode && "p-8"
            )}>
              {generatedContent.length > 0 ? (
                <div className="space-y-6">
                  <h2 className={cn(
                    "text-lg font-semibold text-slate-900 dark:text-slate-100",
                    neurodivergentMode && "text-xl leading-relaxed"
                  )}>
                    Generated Content
                  </h2>
                  
                  {generatedContent.map((content, index) => (
                    <motion.div
                      key={index}
                      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                      transition={reducedMotion ? {} : { delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "p-6 border-l-4 border-l-purple-500",
                        neurodivergentMode && "p-8 border-l-8"
                      )}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className={cn(
                              "font-semibold text-slate-900 dark:text-slate-100",
                              neurodivergentMode && "text-lg"
                            )}>
                              {content.platform} - {content.type}
                            </h3>
                            {content.duration && (
                              <p className={cn(
                                "text-sm text-slate-600 dark:text-slate-400",
                                neurodivergentMode && "text-base"
                              )}>
                                Duration: {content.duration}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size={neurodivergentMode ? "lg" : "sm"}
                            >
                              <Copy className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size={neurodivergentMode ? "lg" : "sm"}
                            >
                              <ExternalLink className={cn("w-4 h-4", neurodivergentMode && "w-5 h-5")} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className={cn(
                          "bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4",
                          neurodivergentMode && "p-6 rounded-xl"
                        )}>
                          <p className={cn(
                            "text-slate-700 dark:text-slate-300 font-mono",
                            neurodivergentMode && "text-base leading-relaxed"
                          )}>
                            {content.content}
                          </p>
                        </div>
                        
                        {content.hashtags && (
                          <div className="flex flex-wrap gap-2">
                            {content.hashtags.map((tag: string, tagIndex: number) => (
                              <Badge 
                                key={tagIndex} 
                                variant="secondary"
                                className={cn(
                                  neurodivergentMode && "text-base px-3 py-1"
                                )}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className={cn(
                    "w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6",
                    neurodivergentMode && "w-32 h-32"
                  )}>
                    <PlusCircle className={cn("w-12 h-12 text-white", neurodivergentMode && "w-16 h-16")} />
                  </div>
                  
                  <h3 className={cn(
                    "text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2",
                    neurodivergentMode && "text-2xl leading-relaxed"
                  )}>
                    Ready to Create Content
                  </h3>
                  
                  <p className={cn(
                    "text-slate-600 dark:text-slate-400 mb-6 max-w-md",
                    neurodivergentMode && "text-lg leading-relaxed"
                  )}>
                    Select your platforms and describe your content idea to generate optimized content for each channel.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2">
                      <Monitor className={cn("w-5 h-5 text-slate-400", neurodivergentMode && "w-6 h-6")} />
                      <span className={cn(
                        "text-sm text-slate-600 dark:text-slate-400",
                        neurodivergentMode && "text-base"
                      )}>
                        Desktop Optimized
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className={cn("w-5 h-5 text-slate-400", neurodivergentMode && "w-6 h-6")} />
                      <span className={cn(
                        "text-sm text-slate-600 dark:text-slate-400",
                        neurodivergentMode && "text-base"
                      )}>
                        Mobile Ready
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className={cn("w-5 h-5 text-slate-400", neurodivergentMode && "w-6 h-6")} />
                      <span className={cn(
                        "text-sm text-slate-600 dark:text-slate-400",
                        neurodivergentMode && "text-base"
                      )}>
                        Multi-Platform
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ScoutUI3.displayName = "ScoutUI3"

export { ScoutUI3 }
export type { ScoutUI3Props }
