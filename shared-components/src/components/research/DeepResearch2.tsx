"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  Download,
  Eye,
  EyeOff,
  Settings,
  History,
  Users,
  Zap,
  Brain,
  Sparkles,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Calendar,
  Tag,
  BookOpen,
  Archive,
  Star,
  MessageSquare,
  CornerDownLeft,
  Loader2,
  ArrowUp,
  StopCircle,
  Cpu,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  Database,
  Link,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

// Types
interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  preview?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'claude' | 'gemini' | 'system';
  timestamp: Date;
  attachments?: Attachment[];
  isThinking?: boolean;
  researchSteps?: ResearchStep[];
  sources?: Source[];
}

interface ResearchStep {
  id: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  url?: string;
  timestamp: Date;
}

interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface ChatHistory {
  id: string;
  title: string;
  model: 'claude' | 'gemini' | 'collaboration';
  timestamp: Date;
  messageCount: number;
  preview: string;
}

type Theme = 'daytime' | 'nighttime' | 'neon';
type ResearchMode = 'deep' | '8bit';
type ModelMode = 'claude' | 'gemini' | 'collaboration';

// Theme configurations
const themes = {
  daytime: {
    background: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50',
    card: 'bg-white/80 backdrop-blur-sm border-blue-200/50',
    text: 'text-gray-900',
    accent: 'text-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600 text-white',
    input: 'bg-white/90 border-blue-200 focus:border-blue-400',
    sidebar: 'bg-white/90 backdrop-blur-sm border-blue-200/50'
  },
  nighttime: {
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900',
    card: 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50',
    text: 'text-gray-100',
    accent: 'text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    input: 'bg-gray-800/90 border-gray-600 focus:border-blue-400',
    sidebar: 'bg-gray-800/90 backdrop-blur-sm border-gray-700/50'
  },
  neon: {
    background: 'bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900',
    card: 'bg-black/60 backdrop-blur-sm border-purple-500/30',
    text: 'text-purple-100',
    accent: 'text-pink-400',
    button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25',
    input: 'bg-black/50 border-purple-500/50 focus:border-pink-400',
    sidebar: 'bg-black/60 backdrop-blur-sm border-purple-500/30'
  }
};

// Animated Text Hook
function useAnimatedText(text: string, delimiter: string = "") {
  const [cursor, setCursor] = useState(0);
  const [startingCursor, setStartingCursor] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (prevText !== text) {
    setPrevText(text);
    setStartingCursor(text.startsWith(prevText) ? cursor : 0);
  }

  useEffect(() => {
    const parts = text.split(delimiter);
    const duration = delimiter === "" ? 8 : delimiter === " " ? 4 : 2;
    
    let animationId: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const newCursor = Math.floor(startingCursor + (parts.length - startingCursor) * progress);
      
      setCursor(newCursor);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [startingCursor, text, delimiter]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
}

// Neon Button Component
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'solid' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  neon?: boolean;
  children: React.ReactNode;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, neon = true, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = "relative group border text-foreground mx-auto text-center rounded-full transition-all duration-200";
    const variantClasses = {
      default: "bg-blue-500/5 hover:bg-blue-500/0 border-blue-500/20",
      solid: "bg-blue-500 hover:bg-blue-600 text-white border-transparent hover:border-foreground/50",
      ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10"
    };
    const sizeClasses = {
      default: "px-7 py-1.5",
      sm: "px-4 py-0.5",
      lg: "px-10 py-2.5"
    };

    return (
      <button
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      >
        {neon && (
          <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-500 to-transparent" />
        )}
        {children}
        {neon && (
          <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-500 to-transparent" />
        )}
      </button>
    );
  }
);

// File Upload Component
const FileUpload = ({ onFileSelect, accept, multiple = false, children }: {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFileSelect(files);
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-600">
        Drop files here or click to upload
      </p>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
    </div>
  );
};

// Message Component
const MessageBubble = ({ message, theme }: { message: Message; theme: Theme }) => {
  const animatedContent = useAnimatedText(message.isThinking ? "Thinking..." : message.content, " ");
  const isUser = message.role === 'user';
  const themeConfig = themes[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={isUser ? "/user-avatar.png" : `/${message.role}-avatar.png`} />
        <AvatarFallback>
          {message.role === 'user' ? <User className="w-4 h-4" /> : 
           message.role === 'claude' ? <Bot className="w-4 h-4" /> : 
           <Brain className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn("max-w-[70%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-lg p-3",
          isUser ? "bg-blue-500 text-white" : themeConfig.card,
          themeConfig.text
        )}>
          <p className="whitespace-pre-wrap">{animatedContent}</p>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="relative">
                  {attachment.type === 'image' && (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  {attachment.type === 'video' && (
                    <video 
                      src={attachment.url}
                      className="w-32 h-32 object-cover rounded"
                      controls
                    />
                  )}
                  {attachment.type === 'audio' && (
                    <audio src={attachment.url} controls className="w-full" />
                  )}
                  {attachment.type === 'document' && (
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {message.isThinking && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm opacity-70">Researching...</span>
              </div>
              
              {message.researchSteps && (
                <div className="space-y-1">
                  {message.researchSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs opacity-70">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        step.status === 'completed' ? "bg-green-500" :
                        step.status === 'active' ? "bg-blue-500 animate-pulse" :
                        "bg-gray-400"
                      )} />
                      <span>{step.description}</span>
                      {step.url && (
                        <ExternalLink className="w-3 h-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium mb-2">Sources:</div>
              <div className="space-y-1">
                {message.sources.map((source) => (
                  <div key={source.id} className="text-xs">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      {source.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-gray-600 mt-1">{source.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

// Chat Input Component
const ChatInput = ({ 
  onSendMessage, 
  onAttachFile,
  theme,
  disabled = false 
}: {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onAttachFile: (files: File[]) => void;
  theme: Theme;
  disabled?: boolean;
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const themeConfig = themes[theme];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || attachments.length > 0) {
      onSendMessage(input, attachments);
      setInput('');
      setAttachments([]);
    }
  };

  const handleFileSelect = (files: File[]) => {
    const newAttachments: Attachment[] = files.map(file => ({
      id: Math.random().toString(36),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' :
            file.type.startsWith('audio/') ? 'audio' : 'document',
      url: URL.createObjectURL(file),
      size: file.size
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    onAttachFile(files);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      handleFileSelect(files);
    }
  };

  return (
    <div className={cn("border-t p-4", themeConfig.card)}>
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                {attachment.type === 'image' && <ImageIcon className="w-4 h-4" />}
                {attachment.type === 'video' && <Video className="w-4 h-4" />}
                {attachment.type === 'audio' && <Volume2 className="w-4 h-4" />}
                {attachment.type === 'document' && <FileText className="w-4 h-4" />}
                <span className="text-sm">{attachment.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-4 w-4 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask me anything about your research..."
            className={cn("min-h-[50px] max-h-[200px] resize-none pr-20", themeConfig.input)}
            disabled={disabled}
          />
          
          <div className="absolute right-2 top-2 flex gap-1">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              multiple
            >
              <Button size="sm" variant="ghost" type="button">
                <Paperclip className="w-4 h-4" />
              </Button>
            </FileUpload>
            
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? "text-red-500" : ""}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          className={themeConfig.button}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

// Research History Component
const ResearchHistory = ({ 
  history, 
  onSelectChat,
  theme,
  isExpanded,
  onToggleExpanded 
}: {
  history: ChatHistory[];
  onSelectChat: (chatId: string) => void;
  theme: Theme;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModel, setFilterModel] = useState<string>('all');
  const themeConfig = themes[theme];

  const filteredHistory = history.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterModel === 'all' || chat.model === filterModel;
    return matchesSearch && matchesFilter;
  });

  const displayedHistory = isExpanded ? filteredHistory : filteredHistory.slice(0, 10);

  return (
    <Card className={cn("h-full", themeConfig.card)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Research Library
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search research..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4">
            {displayedHistory.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                  themeConfig.card
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{chat.title}</h4>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {chat.model}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {chat.preview}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {chat.timestamp.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {chat.messageCount}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        
        {!isExpanded && filteredHistory.length > 10 && (
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpanded}
              className="w-full"
            >
              Show {filteredHistory.length - 10} more
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
interface DeepResearch2Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

const AIDeepResearchPage: React.FC<DeepResearch2Props> = ({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme: systemTheme = 'system',
  className = ''
}) => {
  const [theme, setTheme] = useState<Theme>('daytime');
  const [researchMode, setResearchMode] = useState<ResearchMode>('deep');
  const [modelMode, setModelMode] = useState<ModelMode>('claude');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('default');
  
  const themeConfig = themes[theme];
  
  // Mock data
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Climate Change Research',
      model: 'claude',
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 15,
      preview: 'Comprehensive analysis of climate change impacts on global agriculture...'
    },
    {
      id: '2',
      title: 'AI Ethics Discussion',
      model: 'gemini',
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 8,
      preview: 'Exploring ethical implications of artificial intelligence in healthcare...'
    },
    {
      id: '3',
      title: 'Quantum Computing Breakthrough',
      model: 'collaboration',
      timestamp: new Date(Date.now() - 259200000),
      messageCount: 23,
      preview: 'Analysis of recent quantum computing developments and their implications...'
    }
  ]);

  const handleSendMessage = useCallback((content: string, attachments: Attachment[]) => {
    const userMessage: Message = {
      id: Math.random().toString(36),
      content,
      role: 'user',
      timestamp: new Date(),
      attachments
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Math.random().toString(36),
        content: `I'll help you research "${content}". Let me analyze this thoroughly and provide you with comprehensive insights.`,
        role: modelMode === 'claude' ? 'claude' : 'gemini',
        timestamp: new Date(),
        isThinking: true,
        researchSteps: [
          {
            id: '1',
            description: 'Analyzing query parameters',
            status: 'completed',
            timestamp: new Date()
          },
          {
            id: '2',
            description: 'Searching academic databases',
            status: 'active',
            url: 'https://scholar.google.com',
            timestamp: new Date()
          },
          {
            id: '3',
            description: 'Cross-referencing sources',
            status: 'pending',
            timestamp: new Date()
          }
        ]
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
      
      // Simulate completion
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? {
                ...msg,
                isThinking: false,
                content: `Based on my research, here are the key findings about "${content}":\n\n1. Primary analysis shows significant correlations\n2. Multiple sources confirm the hypothesis\n3. Recommendations for further investigation\n\nWould you like me to dive deeper into any specific aspect?`,
                sources: [
                  {
                    id: '1',
                    title: 'Academic Research Paper',
                    url: 'https://example.com/paper1',
                    snippet: 'Relevant excerpt from the research...',
                    relevance: 0.95
                  }
                ]
              }
            : msg
        ));
      }, 3000);
    }, 1000);
  }, [modelMode]);

  const handleCollaborate = () => {
    if (messages.length === 0) return;
    
    const collaborationMessage: Message = {
      id: Math.random().toString(36),
      content: 'Initiating collaboration between Claude and Gemini for enhanced research analysis...',
      role: 'system',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, collaborationMessage]);
    setModelMode('collaboration');
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // In a real app, load chat messages here
    setMessages([]);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
  };

  return (
    <div className={cn("min-h-screen transition-all duration-500", themeConfig.background)}>
      {/* Theme Selector */}
      <div className="fixed top-4 right-4 z-50">
        <Card className={cn("p-2", themeConfig.card)}>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={theme === 'daytime' ? 'default' : 'ghost'}
              onClick={() => handleThemeChange('daytime')}
              className="text-xs"
            >
              ☀️ Day
            </Button>
            <Button
              size="sm"
              variant={theme === 'nighttime' ? 'default' : 'ghost'}
              onClick={() => handleThemeChange('nighttime')}
              className="text-xs"
            >
              🌙 Night
            </Button>
            <Button
              size="sm"
              variant={theme === 'neon' ? 'default' : 'ghost'}
              onClick={() => handleThemeChange('neon')}
              className="text-xs"
            >
              ✨ Neon
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex h-screen">
        {/* Sidebar - Research History */}
        {showHistory && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-80 border-r"
          >
            <ResearchHistory
              history={chatHistory}
              onSelectChat={handleSelectChat}
              theme={theme}
              isExpanded={isHistoryExpanded}
              onToggleExpanded={() => setIsHistoryExpanded(!isHistoryExpanded)}
            />
          </motion.div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className={cn("border-b p-4", themeConfig.card)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-4 h-4" />
                </Button>
                
                <h1 className={cn("text-2xl font-bold", themeConfig.text)}>
                  AI Deep Research
                </h1>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {researchMode === 'deep' ? 'Deep Research' : '8-bit Research'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResearchMode(researchMode === 'deep' ? '8bit' : 'deep')}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Model Selection */}
            <div className="flex gap-2">
              <NeonButton
                variant={modelMode === 'claude' ? 'solid' : 'default'}
                size="sm"
                onClick={() => setModelMode('claude')}
                neon={theme === 'neon'}
              >
                <Bot className="w-4 h-4 mr-2" />
                Claude
              </NeonButton>
              
              <NeonButton
                variant={modelMode === 'gemini' ? 'solid' : 'default'}
                size="sm"
                onClick={() => setModelMode('gemini')}
                neon={theme === 'neon'}
              >
                <Brain className="w-4 h-4 mr-2" />
                Gemini
              </NeonButton>
              
              <NeonButton
                variant={modelMode === 'collaboration' ? 'solid' : 'default'}
                size="sm"
                onClick={() => setModelMode('collaboration')}
                neon={theme === 'neon'}
              >
                <Users className="w-4 h-4 mr-2" />
                Collaboration
              </NeonButton>
              
              {messages.length > 0 && modelMode !== 'collaboration' && (
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={handleCollaborate}
                  neon={theme === 'neon'}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Collaborate
                </NeonButton>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            {modelMode === 'collaboration' ? (
              <div className="h-full grid grid-cols-2 gap-4 p-4">
                {/* Claude Side */}
                <Card className={cn("h-full", themeConfig.card)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bot className="w-5 h-5" />
                      Claude Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="space-y-4">
                        {messages.filter(m => m.role === 'claude' || m.role === 'user').map((message) => (
                          <MessageBubble key={message.id} message={message} theme={theme} />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {/* Gemini Side */}
                <Card className={cn("h-full", themeConfig.card)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="w-5 h-5" />
                      Gemini Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="space-y-4">
                        {messages.filter(m => m.role === 'gemini' || m.role === 'user').map((message) => (
                          <MessageBubble key={message.id} message={message} theme={theme} />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ScrollArea className="h-full p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className={cn("text-6xl mb-4", themeConfig.text)}>🔬</div>
                      <h2 className={cn("text-2xl font-bold mb-2", themeConfig.text)}>
                        Welcome to AI Deep Research
                      </h2>
                      <p className={cn("text-lg mb-6", themeConfig.text, "opacity-70")}>
                        Ask me anything and I'll conduct comprehensive research using advanced AI models
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Card className={cn("p-4 cursor-pointer hover:shadow-lg transition-shadow", themeConfig.card)}>
                          <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <h3 className="font-medium">Market Analysis</h3>
                          </div>
                          <p className="text-sm opacity-70">
                            Analyze market trends and investment opportunities
                          </p>
                        </Card>
                        
                        <Card className={cn("p-4 cursor-pointer hover:shadow-lg transition-shadow", themeConfig.card)}>
                          <div className="flex items-center gap-3 mb-2">
                            <Database className="w-5 h-5 text-green-500" />
                            <h3 className="font-medium">Research Papers</h3>
                          </div>
                          <p className="text-sm opacity-70">
                            Find and summarize academic research
                          </p>
                        </Card>
                        
                        <Card className={cn("p-4 cursor-pointer hover:shadow-lg transition-shadow", themeConfig.card)}>
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-purple-500" />
                            <h3 className="font-medium">Global Events</h3>
                          </div>
                          <p className="text-sm opacity-70">
                            Track and analyze world events and news
                          </p>
                        </Card>
                        
                        <Card className={cn("p-4 cursor-pointer hover:shadow-lg transition-shadow", themeConfig.card)}>
                          <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="w-5 h-5 text-orange-500" />
                            <h3 className="font-medium">Innovation Trends</h3>
                          </div>
                          <p className="text-sm opacity-70">
                            Discover emerging technologies and innovations
                          </p>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <MessageBubble key={message.id} message={message} theme={theme} />
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onAttachFile={handleFileUpload}
            theme={theme}
            disabled={isThinking}
          />
        </div>
      </div>
    </div>
  );
};

export default AIDeepResearchPage;
export type { DeepResearch2Props };

