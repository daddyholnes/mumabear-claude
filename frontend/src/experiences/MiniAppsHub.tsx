import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ExternalLink, Grid, LayoutGrid, LayoutList, X, Clock, Plus, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

interface MiniApp {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: 'ai' | 'dev' | 'research' | 'design' | 'productivity' | 'live-studio';
  rating: number;
  lastUsed?: string;
  logoPath?: string;
  featured?: boolean;
}

const MINI_APPS: MiniApp[] = [
  {
    id: 'live-api-studio',
    name: 'Live API Studio',
    description: 'World\'s first persistent AI development studio with Mem0 integration',
    url: '/live-studio',
    icon: '🚀',
    category: 'live-studio',
    rating: 5.0,
    logoPath: '/images/aistudio.svg',
    featured: true
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    description: 'Build with Gemini models and advanced AI capabilities',
    url: 'https://aistudio.google.com',
    icon: '🤖',
    category: 'ai',
    rating: 4.8,
    logoPath: '/images/aistudio.svg',
    featured: true
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI-powered search and real-time research',
    url: 'https://perplexity.ai',
    icon: '🔍',
    category: 'research',
    rating: 4.7,
    logoPath: '/images/perplexity.webp',
    featured: true
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant for complex reasoning',
    url: 'https://claude.ai',
    icon: '🧠',
    category: 'ai',
    rating: 4.9,
    logoPath: '/images/claude-1.png'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI assistant',
    url: 'https://chat.openai.com',
    icon: '💬',
    category: 'ai',
    rating: 4.6,
    logoPath: '/images/ChatGPT-Logo.png'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code hosting, collaboration, and version control',
    url: 'https://github.com',
    icon: '🐙',
    category: 'dev',
    rating: 4.8,
    logoPath: '/images/github-copilot.webp'
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    description: 'Open-source AI chat with multiple models',
    url: 'https://huggingface.co/chat',
    icon: '🤗',
    category: 'ai',
    rating: 4.5,
    logoPath: '/images/huggingchat.svg'
  },
  {
    id: 'dify',
    name: 'Dify',
    description: 'LLMOps platform for AI application development',
    url: 'https://dify.ai',
    icon: '⚡',
    category: 'dev',
    rating: 4.6,
    logoPath: '/images/dify.svg'
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow automation and integration platform',
    url: 'https://n8n.io',
    icon: '🔗',
    category: 'productivity',
    rating: 4.7,
    logoPath: '/images/n8n.svg'
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    description: 'AI-powered research and note-taking assistant',
    url: 'https://notebooklm.google.com',
    icon: '📚',
    category: 'research',
    rating: 4.8,
    logoPath: '/images/notebooklm.svg'
  }
];

interface AppCardProps {
  app: MiniApp;
  index: number;
  viewMode: 'grid' | 'list';
  favorites: string[];
  lastUsedTimes: Record<string, string>;
  onToggleFavorite: (appId: string) => void;
  onOpenApp: (app: MiniApp) => void;
  compact?: boolean;
}

function AppCard({ app, index, viewMode, favorites, lastUsedTimes, onToggleFavorite, onOpenApp, compact = false }: AppCardProps) {
  const AppIcon = () => {
    if (app.logoPath) {
      return (
        <img 
          src={app.logoPath} 
          alt={app.name}
          className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} object-contain rounded-lg`}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
      );
    }
    return <div className={`${compact ? 'text-2xl' : 'text-3xl'}`}>{app.icon}</div>;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * index }}
        onClick={() => onOpenApp(app)}
        className="group flex items-center gap-4 p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 cursor-pointer"
      >
        <div className="flex-shrink-0">
          <AppIcon />
          <div className={`${app.logoPath ? 'hidden' : ''} text-3xl`}>{app.icon}</div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
            {app.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">{app.description}</p>
          {lastUsedTimes[app.id] && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Last used {lastUsedTimes[app.id]}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">{app.rating}</span>
          </div>
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
            {app.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(app.id);
            }}
            className={`p-2 rounded-lg transition-all ${
              favorites.includes(app.id)
                ? 'text-yellow-400 bg-yellow-400/10'
                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            <Star className={`w-5 h-5 ${favorites.includes(app.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      onClick={() => onOpenApp(app)}
      className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <AppIcon />
          <div className={`${app.logoPath ? 'hidden' : ''} text-3xl`}>{app.icon}</div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
              {app.name}
            </h3>
            <p className="text-sm text-gray-400">{app.category}</p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(app.id);
          }}
          className={`p-2 rounded-lg transition-all ${
            favorites.includes(app.id)
              ? 'text-yellow-400 bg-yellow-400/10'
              : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
          }`}
        >
          <Star className={`w-5 h-5 ${favorites.includes(app.id) ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {app.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">{app.rating}</span>
          </div>
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
            {app.category}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenApp(app);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </button>
      </div>
      
      {lastUsedTimes[app.id] && (
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          Last used {lastUsedTimes[app.id]}
        </div>
      )}
    </motion.div>
  );
}

export default function MiniAppsHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<MiniApp | null>(null);
  const [lastUsedTimes, setLastUsedTimes] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites and last used times from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('miniapp-favorites');
    const savedLastUsed = localStorage.getItem('miniapp-lastused');
    const savedViewMode = localStorage.getItem('miniapp-viewmode');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedLastUsed) {
      setLastUsedTimes(JSON.parse(savedLastUsed));
    }

    if (savedViewMode) {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (appId: string) => {
    const newFavorites = favorites.includes(appId)
      ? favorites.filter(id => id !== appId)
      : [...favorites, appId];
    
    setFavorites(newFavorites);
    localStorage.setItem('miniapp-favorites', JSON.stringify(newFavorites));
  };

  // Toggle view mode
  const toggleViewMode = () => {
    const newViewMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newViewMode);
    localStorage.setItem('miniapp-viewmode', newViewMode);
  };

  // Update last used time
  const updateLastUsed = (appId: string) => {
    const now = new Date().toLocaleDateString();
    const newLastUsed = { ...lastUsedTimes, [appId]: now };
    setLastUsedTimes(newLastUsed);
    localStorage.setItem('miniapp-lastused', JSON.stringify(newLastUsed));
  };

  // Open app in modal
  const openApp = (app: MiniApp) => {
    if (app.url.startsWith('/')) {
      // Internal route - navigate directly
      window.location.href = app.url;
    } else {
      // External URL - open in modal
      setSelectedApp(app);
      setIsLoading(true);
      updateLastUsed(app.id);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedApp(null);
    setIsFullscreen(false);
    setIsLoading(false);
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Filter apps
  const filteredApps = MINI_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get favorite apps for quick access
  const favoriteApps = MINI_APPS.filter(app => favorites.includes(app.id)).slice(0, 3);

  // Get featured apps
  const featuredApps = filteredApps.filter(app => app.featured);

  const categories = [
    { id: 'all', name: 'All', icon: '⭐' },
    { id: 'live-studio', name: 'Live Studio', icon: '🚀' },
    { id: 'ai', name: 'AI', icon: '🤖' },
    { id: 'dev', name: 'Dev', icon: '💻' },
    { id: 'research', name: 'Research', icon: '🔍' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🌐 Mini Apps Hub
              </h1>
              <p className="text-gray-300 mt-2">
                Quick access to your favorite AI tools and services
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Custom App
            </motion.button>
          </div>

          {/* Quick Access Dock */}
          {favoriteApps.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                  ⭐ Quick Access:
                </span>
                {favoriteApps.map((app) => (
                  <motion.button
                    key={app.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openApp(app)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-lg hover:bg-gray-700/60 transition-all whitespace-nowrap border border-purple-500/20"
                    title={app.name}
                  >
                    {app.logoPath ? (
                      <img src={app.logoPath} alt={app.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="text-lg">{app.icon}</span>
                    )}
                    <span className="text-sm font-medium text-white">{app.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Search, Filters, and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={toggleViewMode}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={toggleViewMode}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="List View"
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="text-yellow-400 w-6 h-6" />
              Featured Apps
            </h2>
            
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {featuredApps.map((app, index) => (
                <AppCard
                  key={app.id}
                  app={app}
                  index={index}
                  viewMode={viewMode}
                  favorites={favorites}
                  lastUsedTimes={lastUsedTimes}
                  onToggleFavorite={toggleFavorite}
                  onOpenApp={openApp}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Apps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Grid className="text-blue-400 w-6 h-6" />
            All Apps
            <span className="text-sm font-normal text-gray-400">
              ({filteredApps.length} apps)
            </span>
          </h2>
          
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            : "space-y-3"
          }>
            {filteredApps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                viewMode={viewMode}
                favorites={favorites}
                lastUsedTimes={lastUsedTimes}
                onToggleFavorite={toggleFavorite}
                onOpenApp={openApp}
                compact={viewMode === 'grid'}
              />
            ))}
          </div>
        </motion.div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No apps found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Modal for embedded apps */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-gray-900 rounded-2xl w-full max-w-7xl flex flex-col overflow-hidden border border-purple-500/30 ${
                isFullscreen ? 'h-[95vh]' : 'h-[90vh]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  {selectedApp.logoPath ? (
                    <img src={selectedApp.logoPath} alt={selectedApp.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="text-2xl">{selectedApp.icon}</div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{selectedApp.name}</h3>
                    <p className="text-sm text-gray-400">{selectedApp.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      // Force iframe reload
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.src = iframe.src;
                      }
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => window.open(selectedApp.url, '_blank')}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="relative flex-1 overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400">Loading {selectedApp.name}...</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={selectedApp.url}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={() => setIsLoading(false)}
                  title={selectedApp.name}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
                
                {/* Fallback message for sites that refuse to connect */}
                {!isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-center bg-gray-800/90 p-8 rounded-xl">
                      <div className="text-6xl mb-4">🚫</div>
                      <p className="text-lg font-medium mb-2">{selectedApp.name} may have refused to connect.</p>
                      <p className="text-sm">If the app doesn't load, click "Open in New Tab" above.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
