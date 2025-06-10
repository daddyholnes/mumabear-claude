import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Package, Download, Star, ExternalLink, 
  Filter, Grid, List, Trash2, Settings, CheckCircle,
  Github, Globe, BookOpen, Code, Zap, Bot, Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  getMCPTools, 
  installMCPTool, 
  uninstallMCPTool, 
  searchMCPTools, 
  type MCPTool 
} from '@/api/mamaBearAPI'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'

const categoryIcons = {
  'database': Database,
  'api': Zap,
  'ai': Bot,
  'web': Globe,
  'development': Code,
  'productivity': Settings,
  'other': Package
}

export default function MCPMarketplace() {
  const { effectLevel } = useSanctuaryStore()
  const [tools, setTools] = useState<MCPTool[]>([])
  const [filteredTools, setFilteredTools] = useState<MCPTool[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('downloads')
  const [showInstalled, setShowInstalled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [installingTools, setInstallingTools] = useState<Set<string>>(new Set())

  // Mock data for demonstration
  const mockTools: MCPTool[] = [
    {
      id: 'github-mcp',
      name: 'GitHub Integration',
      description: 'Connect to GitHub repositories, manage issues, and deploy code directly from your sanctuary.',
      version: '2.1.0',
      author: 'GitHub Inc.',
      category: 'development',
      rating: 4.8,
      downloads: 15420,
      installed: false,
      repository: 'https://github.com/github/mcp-github',
      documentation: 'https://docs.github.com/mcp'
    },
    {
      id: 'postgres-mcp',
      name: 'PostgreSQL Connector',
      description: 'Full-featured PostgreSQL database integration with query builder and schema management.',
      version: '1.5.2',
      author: 'PostgreSQL Team',
      category: 'database',
      rating: 4.9,
      downloads: 8930,
      installed: true,
      repository: 'https://github.com/postgres/mcp-postgres',
      documentation: 'https://www.postgresql.org/mcp'
    },
    {
      id: 'openai-mcp',
      name: 'OpenAI Advanced',
      description: 'Enhanced OpenAI integration with function calling, embeddings, and custom model management.',
      version: '3.0.1',
      author: 'OpenAI',
      category: 'ai',
      rating: 4.7,
      downloads: 22150,
      installed: true,
      repository: 'https://github.com/openai/mcp-openai',
      documentation: 'https://platform.openai.com/mcp'
    },
    {
      id: 'slack-mcp',
      name: 'Slack Notifications',
      description: 'Send notifications, create channels, and manage Slack workspaces from your AI workflows.',
      version: '1.2.8',
      author: 'Slack Technologies',
      category: 'productivity',
      rating: 4.4,
      downloads: 5670,
      installed: false,
      repository: 'https://github.com/slack/mcp-slack',
      documentation: 'https://api.slack.com/mcp'
    },
    {
      id: 'vercel-mcp',
      name: 'Vercel Deploy',
      description: 'Deploy applications to Vercel with automatic builds, previews, and domain management.',
      version: '2.3.0',
      author: 'Vercel Inc.',
      category: 'web',
      rating: 4.6,
      downloads: 11280,
      installed: false,
      repository: 'https://github.com/vercel/mcp-vercel',
      documentation: 'https://vercel.com/docs/mcp'
    },
    {
      id: 'anthropic-mcp',
      name: 'Claude Integration',
      description: 'Advanced Claude API integration with conversation management and tool use capabilities.',
      version: '1.8.4',
      author: 'Anthropic',
      category: 'ai',
      rating: 4.9,
      downloads: 18760,
      installed: true,
      repository: 'https://github.com/anthropic/mcp-claude',
      documentation: 'https://docs.anthropic.com/mcp'
    },
    {
      id: 'google-mcp',
      name: 'Google Workspace',
      description: 'Complete Google Workspace integration: Gmail, Drive, Docs, Sheets, and Calendar.',
      version: '2.0.3',
      author: 'Google LLC',
      category: 'productivity',
      rating: 4.5,
      downloads: 9850,
      installed: false,
      repository: 'https://github.com/google/mcp-workspace',
      documentation: 'https://developers.google.com/mcp'
    },
    {
      id: 'redis-mcp',
      name: 'Redis Cache',
      description: 'High-performance Redis integration for caching, sessions, and real-time data management.',
      version: '1.4.1',
      author: 'Redis Ltd.',
      category: 'database',
      rating: 4.7,
      downloads: 7320,
      installed: false,
      repository: 'https://github.com/redis/mcp-redis',
      documentation: 'https://redis.io/mcp'
    }
  ]

  useEffect(() => {
    setTools(mockTools)
    setFilteredTools(mockTools)
  }, [])

  useEffect(() => {
    let filtered = [...tools]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory)
    }

    // Filter by installed status
    if (showInstalled) {
      filtered = filtered.filter(tool => tool.installed)
    }

    // Sort tools
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        case 'recent':
          return b.version.localeCompare(a.version)
        default:
          return 0
      }
    })

    setFilteredTools(filtered)
  }, [tools, searchQuery, selectedCategory, sortBy, showInstalled])

  const handleInstall = async (toolId: string) => {
    setInstallingTools(prev => new Set(prev).add(toolId))
    
    try {
      await installMCPTool(toolId)
      setTools(prev => prev.map(tool => 
        tool.id === toolId ? { ...tool, installed: true } : tool
      ))
    } catch (error) {
      console.error('Failed to install tool:', error)
    } finally {
      setInstallingTools(prev => {
        const next = new Set(prev)
        next.delete(toolId)
        return next
      })
    }
  }

  const handleUninstall = async (toolId: string) => {
    try {
      await uninstallMCPTool(toolId)
      setTools(prev => prev.map(tool => 
        tool.id === toolId ? { ...tool, installed: false } : tool
      ))
    } catch (error) {
      console.error('Failed to uninstall tool:', error)
    }
  }

  const categories = Array.from(new Set(tools.map(tool => tool.category)))
  const installedCount = tools.filter(tool => tool.installed).length

  return (
    <TooltipProvider>
      <motion.div
        className="min-h-screen p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                MCP Marketplace
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover and install Model Context Protocol tools to extend your AI capabilities
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary">
                  {tools.length} Tools Available
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  {installedCount} Installed
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>

              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tools, descriptions, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                id="show-installed"
                checked={showInstalled}
                onCheckedChange={setShowInstalled}
              />
              <label htmlFor="show-installed" className="text-sm">
                Installed only
              </label>
            </div>
          </div>

          {/* Tools Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${filteredTools.length}`}
              className={cn(
                "gap-6",
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "space-y-4"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredTools.map((tool, index) => {
                const IconComponent = categoryIcons[tool.category as keyof typeof categoryIcons] || Package
                const isInstalling = installingTools.has(tool.id)
                
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "h-full transition-all duration-300 group overflow-hidden",
                      effectLevel === 'full' && "hover-glow",
                      tool.installed && "ring-2 ring-green-500/20 bg-green-500/5"
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                              tool.category === 'ai' && "from-purple-500 to-blue-500",
                              tool.category === 'database' && "from-green-500 to-emerald-500",
                              tool.category === 'development' && "from-blue-500 to-cyan-500",
                              tool.category === 'web' && "from-orange-500 to-red-500",
                              tool.category === 'productivity' && "from-violet-500 to-purple-500",
                              !['ai', 'database', 'development', 'web', 'productivity'].includes(tool.category) && "from-gray-500 to-slate-500"
                            )}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">{tool.name}</h3>
                                {tool.installed && (
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                by {tool.author}
                              </p>
                            </div>
                          </div>

                          <Badge variant="secondary" className="text-xs">
                            v{tool.version}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {tool.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {tool.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {tool.downloads.toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {tool.category}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-2">
                          {tool.installed ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleUninstall(tool.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Uninstall
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleInstall(tool.id)}
                              disabled={isInstalling}
                            >
                              {isInstalling ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                  Installing...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Install
                                </>
                              )}
                            </Button>
                          )}

                          <div className="flex gap-1">
                            {tool.repository && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => window.open(tool.repository, '_blank')}
                                  >
                                    <Github className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View source</TooltipContent>
                              </Tooltip>
                            )}

                            {tool.documentation && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => window.open(tool.documentation, '_blank')}
                                  >
                                    <BookOpen className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Documentation</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      {effectLevel === 'full' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-blue-500/5 pointer-events-none"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {filteredTools.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse different categories
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  )
}