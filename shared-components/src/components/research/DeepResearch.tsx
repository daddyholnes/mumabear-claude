"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  Video,
  Image as ImageIcon,
  Upload,
  X,
  Settings,
  History,
  Users,
  Brain,
  Zap,
  Globe,
  Moon,
  Sun,
  Stars,
  Cloud,
  Palette,
  Play,
  Pause,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Calendar,
  Tag,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  FileText,
  Download,
  Share,
  Copy,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";

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
    
    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const newCursor = Math.floor(startingCursor + (parts.length - startingCursor) * progress);
      setCursor(newCursor);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [startingCursor, text, delimiter]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
}

// Types
interface Message {
  id: string;
  content: string;
  sender: "user" | "claude" | "gemini" | "collaboration";
  timestamp: Date;
  status: "thinking" | "researching" | "complete" | "error";
  researchSteps?: ResearchStep[];
  sources?: Source[];
  attachments?: Attachment[];
  isAnimating?: boolean;
}

interface ResearchStep {
  id: string;
  description: string;
  status: "pending" | "active" | "complete";
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

interface Attachment {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  size: number;
}

interface ChatHistory {
  id: string;
  title: string;
  model: "claude" | "gemini" | "collaboration";
  timestamp: Date;
  messageCount: number;
  preview: string;
}

type Theme = "daylight" | "nighttime" | "purple-haze";
type ResearchMode = "deep" | "8-bit";
type Model = "claude" | "gemini" | "collaboration";

// Theme configurations
const themes = {
  daylight: {
    background: "bg-gradient-to-br from-blue-50 via-white to-blue-100",
    card: "bg-white/80 backdrop-blur-sm border-blue-200",
    text: "text-gray-900",
    accent: "text-blue-600",
    button: "bg-blue-500 hover:bg-blue-600 text-white",
    input: "bg-white/50 border-blue-200 focus:border-blue-400",
    glow: "shadow-blue-200/50",
  },
  nighttime: {
    background: "bg-gradient-to-br from-gray-900 via-black to-blue-900",
    card: "bg-gray-800/80 backdrop-blur-sm border-gray-700",
    text: "text-gray-100",
    accent: "text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
    input: "bg-gray-800/50 border-gray-600 focus:border-blue-400",
    glow: "shadow-blue-400/20",
  },
  "purple-haze": {
    background: "bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900",
    card: "bg-purple-800/30 backdrop-blur-sm border-purple-500/30",
    text: "text-purple-100",
    accent: "text-pink-400",
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
    input: "bg-purple-800/30 border-purple-500/30 focus:border-pink-400",
    glow: "shadow-purple-500/30",
  },
};

// Neon Button Component
const NeonButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  theme: Theme;
}> = ({ children, onClick, variant = "primary", className = "", disabled = false, theme }) => {
  const themeConfig = themes[theme];
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-4 py-2 rounded-lg font-medium transition-all duration-300
        ${themeConfig.button}
        ${theme === "purple-haze" ? "animate-pulse" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {theme === "purple-haze" && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Thinking Animation Component
const ThinkingAnimation: React.FC<{ theme: Theme }> = ({ theme }) => {
  const themeConfig = themes[theme];
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`flex space-x-1 ${themeConfig.accent}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-current"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span className={`text-sm ${themeConfig.text}`}>Thinking...</span>
    </div>
  );
};

// Research Ticker Component
const ResearchTicker: React.FC<{
  steps: ResearchStep[];
  theme: Theme;
}> = ({ steps, theme }) => {
  const themeConfig = themes[theme];
  
  return (
    <div className={`p-3 rounded-lg ${themeConfig.card} ${themeConfig.glow} shadow-lg`}>
      <div className="flex items-center space-x-2 mb-2">
        <Globe className={`w-4 h-4 ${themeConfig.accent}`} />
        <span className={`text-sm font-medium ${themeConfig.text}`}>Research Progress</span>
      </div>
      <div className="space-y-2">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className={`w-2 h-2 rounded-full ${
              step.status === "complete" ? "bg-green-500" :
              step.status === "active" ? "bg-yellow-500 animate-pulse" :
              "bg-gray-400"
            }`} />
            <span className={`text-xs ${themeConfig.text}`}>{step.description}</span>
            {step.url && (
              <a
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs ${themeConfig.accent} hover:underline`}
              >
                {new URL(step.url).hostname}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{
  message: Message;
  theme: Theme;
  onCollaborate?: () => void;
}> = ({ message, theme, onCollaborate }) => {
  const themeConfig = themes[theme];
  const animatedContent = useAnimatedText(message.isAnimating ? message.content : message.content, "");
  
  const getSenderColor = (sender: string) => {
    switch (sender) {
      case "claude": return "bg-orange-500";
      case "gemini": return "bg-blue-500";
      case "collaboration": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg ${themeConfig.card} ${themeConfig.glow} shadow-lg`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${getSenderColor(message.sender)}`} />
        <span className={`font-medium ${themeConfig.text} capitalize`}>{message.sender}</span>
        <span className={`text-xs ${themeConfig.text} opacity-60`}>
          {message.timestamp.toLocaleTimeString()}
        </span>
        {message.status === "thinking" && <ThinkingAnimation theme={theme} />}
      </div>
      
      <div className={`${themeConfig.text} whitespace-pre-wrap`}>
        {message.isAnimating ? animatedContent : message.content}
      </div>
      
      {message.researchSteps && message.researchSteps.length > 0 && (
        <div className="mt-3">
          <ResearchTicker steps={message.researchSteps} theme={theme} />
        </div>
      )}
      
      {message.sources && message.sources.length > 0 && (
        <div className="mt-3 space-y-2">
          <span className={`text-sm font-medium ${themeConfig.text}`}>Sources:</span>
          {message.sources.map((source) => (
            <div key={source.id} className={`p-2 rounded ${themeConfig.input}`}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-medium ${themeConfig.accent} hover:underline`}
              >
                {source.title}
              </a>
              <p className={`text-xs ${themeConfig.text} opacity-80 mt-1`}>{source.snippet}</p>
            </div>
          ))}
        </div>
      )}
      
      {message.status === "complete" && message.sender !== "collaboration" && onCollaborate && (
        <div className="mt-3">
          <NeonButton
            onClick={onCollaborate}
            variant="secondary"
            theme={theme}
            className="text-sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Collaborate
          </NeonButton>
        </div>
      )}
    </motion.div>
  );
};

// Chat History Sidebar
const ChatHistorySidebar: React.FC<{
  history: ChatHistory[];
  theme: Theme;
  isOpen: boolean;
  onToggle: () => void;
  onSelectChat: (chat: ChatHistory) => void;
}> = ({ history, theme, isOpen, onToggle, onSelectChat }) => {
  const themeConfig = themes[theme];
  const [showAll, setShowAll] = useState(false);
  const displayedHistory = showAll ? history : history.slice(0, 10);
  
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 320 : 60 }}
      className={`h-full ${themeConfig.card} border-r ${themeConfig.glow} shadow-lg`}
    >
      <div className="p-4">
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className={`w-full ${themeConfig.text}`}
        >
          <History className="w-5 h-5" />
        </Button>
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${themeConfig.text}`}>Research Library</h3>
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {displayedHistory.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectChat(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${themeConfig.input} hover:opacity-80`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        chat.model === "claude" ? "bg-orange-500" :
                        chat.model === "gemini" ? "bg-blue-500" :
                        "bg-purple-500"
                      }`} />
                      <span className={`text-sm font-medium ${themeConfig.text}`}>
                        {chat.title}
                      </span>
                    </div>
                    <p className={`text-xs ${themeConfig.text} opacity-60 truncate`}>
                      {chat.preview}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${themeConfig.text} opacity-40`}>
                        {chat.timestamp.toLocaleDateString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {chat.messageCount}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {history.length > 10 && (
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="ghost"
                  className={`w-full mt-4 ${themeConfig.text}`}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show All ({history.length - 10} more)
                    </>
                  )}
                </Button>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// File Upload Component
const FileUpload: React.FC<{
  onFileSelect: (files: File[]) => void;
  theme: Theme;
}> = ({ onFileSelect, theme }) => {
  const themeConfig = themes[theme];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        border-2 border-dashed rounded-lg p-4 transition-colors
        ${isDragging ? "border-blue-500 bg-blue-50/10" : `border-gray-300 ${themeConfig.input}`}
      `}
    >
      <div className="text-center">
        <Upload className={`w-8 h-8 mx-auto mb-2 ${themeConfig.text} opacity-60`} />
        <p className={`text-sm ${themeConfig.text} opacity-80`}>
          Drag & drop files here, or{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`${themeConfig.accent} hover:underline`}
          >
            browse
          </button>
        </p>
        <p className={`text-xs ${themeConfig.text} opacity-60 mt-1`}>
          Supports images, videos, audio, and documents
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFileSelect(Array.from(e.target.files));
          }
        }}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

// Main Component
interface DeepResearchProps {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

const AIDeepResearchPage: React.FC<DeepResearchProps> = ({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme: systemTheme = 'system',
  className = ''
}) => {
  const [theme, setTheme] = useState<Theme>("nighttime");
  const [model, setModel] = useState<Model>("claude");
  const [researchMode, setResearchMode] = useState<ResearchMode>("deep");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isCollaborationMode, setIsCollaborationMode] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Climate Change Research",
      model: "collaboration",
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 15,
      preview: "Comprehensive analysis of climate change impacts...",
    },
    {
      id: "2",
      title: "AI Ethics Discussion",
      model: "claude",
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 8,
      preview: "Exploring ethical implications of AI development...",
    },
  ]);
  
  const themeConfig = themes[theme];
  
  const handleSendMessage = () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      status: "complete",
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'll help you research that topic using ${researchMode} research mode. Let me analyze your request and gather comprehensive information.`,
        sender: isCollaborationMode ? "collaboration" : model,
        timestamp: new Date(),
        status: "thinking",
        isAnimating: true,
        researchSteps: [
          {
            id: "1",
            description: "Analyzing query parameters",
            status: "complete",
            timestamp: new Date(),
          },
          {
            id: "2",
            description: "Searching academic databases",
            status: "active",
            url: "https://scholar.google.com",
            timestamp: new Date(),
          },
          {
            id: "3",
            description: "Cross-referencing sources",
            status: "pending",
            timestamp: new Date(),
          },
        ],
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate research completion
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { 
                ...msg, 
                status: "complete",
                isAnimating: false,
                content: `Based on my ${researchMode} research, I've found comprehensive information about your query. Here are the key findings and insights from multiple authoritative sources.`,
                sources: [
                  {
                    id: "1",
                    title: "Research Paper on Topic",
                    url: "https://example.com/paper1",
                    snippet: "This comprehensive study provides detailed analysis...",
                    relevance: 0.95,
                  },
                  {
                    id: "2",
                    title: "Expert Analysis",
                    url: "https://example.com/analysis",
                    snippet: "Leading experts in the field discuss implications...",
                    relevance: 0.88,
                  },
                ],
              }
            : msg
        ));
      }, 3000);
    }, 1000);
  };
  
  const handleCollaborate = () => {
    const collaborationMessage: Message = {
      id: Date.now().toString(),
      content: "Initiating collaboration between Claude and Gemini. Both models will research independently and then synthesize their findings.",
      sender: "collaboration",
      timestamp: new Date(),
      status: "thinking",
      isAnimating: true,
    };
    
    setMessages(prev => [...prev, collaborationMessage]);
    setIsCollaborationMode(true);
  };
  
  const handleFileSelect = (files: File[]) => {
    const newAttachments: Attachment[] = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: file.type.startsWith("image/") ? "image" :
            file.type.startsWith("video/") ? "video" :
            file.type.startsWith("audio/") ? "audio" : "document",
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };
  
  return (
    <div className={`min-h-screen ${themeConfig.background}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <ChatHistorySidebar
          history={chatHistory}
          theme={theme}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
          onSelectChat={(chat) => console.log("Selected chat:", chat)}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className={`p-4 border-b ${themeConfig.card} ${themeConfig.glow} shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className={`text-2xl font-bold ${themeConfig.text}`}>
                  AI Deep Research
                </h1>
                <Badge variant="secondary" className={themeConfig.accent}>
                  {isCollaborationMode ? "Collaboration Mode" : model.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Theme Selector */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant={theme === "daylight" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setTheme("daylight")}
                  >
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === "nighttime" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setTheme("nighttime")}
                  >
                    <Moon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === "purple-haze" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setTheme("purple-haze")}
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Model Selector */}
                <div className="flex items-center space-x-2">
                  <NeonButton
                    onClick={() => { setModel("claude"); setIsCollaborationMode(false); }}
                    variant={model === "claude" && !isCollaborationMode ? "primary" : "secondary"}
                    theme={theme}
                  >
                    Claude
                  </NeonButton>
                  <NeonButton
                    onClick={() => { setModel("gemini"); setIsCollaborationMode(false); }}
                    variant={model === "gemini" && !isCollaborationMode ? "primary" : "secondary"}
                    theme={theme}
                  >
                    Gemini
                  </NeonButton>
                  <NeonButton
                    onClick={() => setIsCollaborationMode(true)}
                    variant={isCollaborationMode ? "primary" : "secondary"}
                    theme={theme}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Collaborate
                  </NeonButton>
                </div>
              </div>
            </div>
            
            {/* Research Mode Toggle */}
            <div className="flex items-center space-x-4 mt-4">
              <span className={`text-sm ${themeConfig.text}`}>Research Mode:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant={researchMode === "deep" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setResearchMode("deep")}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Deep Research
                </Button>
                <Button
                  variant={researchMode === "8-bit" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setResearchMode("8-bit")}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  8-bit Research
                </Button>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex">
            {isCollaborationMode ? (
              <div className="flex-1 grid grid-cols-2 gap-4 p-4">
                {/* Claude Side */}
                <div className={`${themeConfig.card} rounded-lg p-4`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className={`font-medium ${themeConfig.text}`}>Claude Research</span>
                  </div>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {messages
                        .filter(msg => msg.sender === "claude" || msg.sender === "user")
                        .map(message => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            theme={theme}
                            onCollaborate={handleCollaborate}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Gemini Side */}
                <div className={`${themeConfig.card} rounded-lg p-4`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className={`font-medium ${themeConfig.text}`}>Gemini Research</span>
                  </div>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {messages
                        .filter(msg => msg.sender === "gemini" || msg.sender === "user")
                        .map(message => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            theme={theme}
                            onCollaborate={handleCollaborate}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.map(message => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        theme={theme}
                        onCollaborate={handleCollaborate}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className={`p-4 border-t ${themeConfig.card}`}>
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${themeConfig.input}`}
                    >
                      {attachment.type === "image" && <ImageIcon className="w-4 h-4" />}
                      {attachment.type === "video" && <Video className="w-4 h-4" />}
                      {attachment.type === "audio" && <Mic className="w-4 h-4" />}
                      {attachment.type === "document" && <FileText className="w-4 h-4" />}
                      <span className={`text-sm ${themeConfig.text}`}>{attachment.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(attachment.id)}
                        className="h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* File Upload */}
              <FileUpload onFileSelect={handleFileSelect} theme={theme} />
              
              {/* Input */}
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything for deep research..."
                    className={`min-h-[60px] resize-none ${themeConfig.input} ${themeConfig.text}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <NeonButton
                    onClick={handleSendMessage}
                    disabled={!input.trim() && attachments.length === 0}
                    theme={theme}
                  >
                    <Send className="w-4 h-4" />
                  </NeonButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDeepResearchPage;
export type { DeepResearchProps };
