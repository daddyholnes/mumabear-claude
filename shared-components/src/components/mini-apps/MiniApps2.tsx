"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Star, 
  Search, 
  ExternalLink, 
  Palette, 
  Moon, 
  Sun, 
  Cloud, 
  X, 
  Maximize2, 
  Minimize2,
  Grid3X3,
  List,
  Filter,
  Zap,
  Sparkles,
  Globe,
  Code,
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Calculator,
  Calendar,
  Mail,
  Settings
} from 'lucide-react';

interface MiniApp {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  category: string;
  rating: number;
  featured?: boolean;
  color: string;
}

interface MiniApps2Props {
  reducedMotion?: boolean;
  neurodivergentMode?: boolean;
  theme?: 'daydream-clouds' | 'purple-haze' | 'midnight-sky';
}

const FEATURED_APPS: MiniApp[] = [
  {
    id: 'code-editor',
    name: 'Code Editor',
    description: 'Lightweight code editor with syntax highlighting',
    url: 'https://codemirror.net/try/',
    icon: Code,
    category: 'Development',
    rating: 4.8,
    featured: true,
    color: 'blue'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Scientific calculator with advanced functions',
    url: 'https://calculator.net/',
    icon: Calculator,
    category: 'Utilities',
    rating: 4.9,
    featured: true,
    color: 'green'
  },
  {
    id: 'image-editor',
    name: 'Image Editor',
    description: 'Quick image editing and manipulation',
    url: 'https://photopea.com/',
    icon: ImageIcon,
    category: 'Graphics',
    rating: 4.7,
    featured: true,
    color: 'purple'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Simple calendar and scheduling',
    url: 'https://calendar.google.com/',
    icon: Calendar,
    category: 'Productivity',
    rating: 4.6,
    featured: true,
    color: 'orange'
  },
  {
    id: 'music-player',
    name: 'Music Studio',
    description: 'Create and edit music online',
    url: 'https://musiclab.chromeexperiments.com/',
    icon: Music,
    category: 'Creative',
    rating: 4.5,
    color: 'pink'
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Simple video editing tools',
    url: 'https://clipchamp.com/',
    icon: Video,
    category: 'Media',
    rating: 4.4,
    color: 'red'
  }
];

export default function MiniApps2({ 
  reducedMotion = false, 
  neurodivergentMode = false,
  theme = 'purple-haze' 
}: MiniApps2Props) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openApps, setOpenApps] = useState<Set<string>>(new Set());

  const categories = ['all', 'Development', 'Utilities', 'Graphics', 'Productivity', 'Creative', 'Media'];

  const filteredApps = FEATURED_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openApp = useCallback((appId: string) => {
    setOpenApps(prev => new Set([...prev, appId]));
    setSelectedApp(appId);
  }, []);

  const closeApp = useCallback((appId: string) => {
    setOpenApps(prev => {
      const newSet = new Set(prev);
      newSet.delete(appId);
      return newSet;
    });
    if (selectedApp === appId) {
      setSelectedApp(null);
    }
  }, [selectedApp]);

  const themeColors = {
    'daydream-clouds': 'from-blue-50 to-cyan-50',
    'purple-haze': 'from-purple-50 to-pink-50',
    'midnight-sky': 'from-gray-900 to-blue-900'
  };

  const AppIcon = ({ app }: { app: MiniApp }) => {
    const IconComponent = app.icon;
    return (
      <div className={`p-3 rounded-xl bg-${app.color}-100 text-${app.color}-600 dark:bg-${app.color}-900/20 dark:text-${app.color}-400`}>
        <IconComponent className="h-6 w-6" />
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors[theme]} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                Mini Apps Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Powerful mini applications for enhanced productivity
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Apps Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  delay: reducedMotion ? 0 : index * 0.1,
                  duration: reducedMotion ? 0.2 : 0.3 
                }}
              >
                <Card className={`
                  ${viewMode === 'grid' ? 'p-6 h-full' : 'p-4 flex items-center gap-4'}
                  bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                  hover:shadow-lg transition-all duration-200
                  border-2 border-transparent hover:border-purple-200
                  ${neurodivergentMode ? 'focus-within:ring-2 focus-within:ring-purple-500' : ''}
                `}>
                  <div className={viewMode === 'grid' ? 'text-center space-y-4' : 'flex items-center gap-4 flex-1'}>
                    <AppIcon app={app} />
                    
                    <div className={viewMode === 'grid' ? 'space-y-2' : 'flex-1'}>
                      <div className="flex items-center gap-2 justify-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {app.name}
                        </h3>
                        {app.featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {app.description}
                      </p>
                      
                      <div className="flex items-center gap-2 justify-center">
                        <Badge variant="outline">{app.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {app.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`${viewMode === 'grid' ? 'space-y-2' : 'flex gap-2'}`}>
                      <Button
                        onClick={() => openApp(app.id)}
                        className="w-full"
                        disabled={openApps.has(app.id)}
                      >
                        {openApps.has(app.id) ? 'Running' : 'Launch'}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                      
                      {openApps.has(app.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => closeApp(app.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredApps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No apps found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or category filter
            </p>
          </motion.div>
        )}

        {/* Open Apps Indicator */}
        {openApps.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <Card className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="font-medium">
                    {openApps.size} app{openApps.size !== 1 ? 's' : ''} running
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenApps(new Set())}
                >
                  Close All
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}