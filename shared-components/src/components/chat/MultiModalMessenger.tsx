"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bot,
  Phone,
  Video,
  Mic,
  MicOff,
  Send,
  Paperclip,
  Settings,
  Users,
  MessageSquare,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  FileText,
  X,
  Volume2,
  VolumeX,
  Globe,
  Zap,
  DollarSign,
  Clock,
  Star,
  Menu,
  Sun,
  Moon,
  Palette,
  Monitor,
  Smile,
  Plus,
  Edit3,
  Camera,
  VideoIcon,
  HeadphonesIcon,
  BrainCircuit,
  Sparkles,
  Wand2,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  FriendsManager, 
  ThemePicker, 
  SettingsModal, 
  FriendEditModal,
  type AIFriend as ImportedAIFriend,
  type Theme as ImportedTheme
} from "./ChatModals";

// Use the imported types
type AIFriend = ImportedAIFriend;
type Theme = ImportedTheme;

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "image" | "file" | "audio" | "video";
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  aiModel?: string;
  reactions?: string[];
  edited?: boolean;
  replyTo?: string;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  friendId: string;
  messageCount: number;
  unread: number;
}

// Beautiful gradient themes based on your designs
const themes: Theme[] = [
  {
    name: "Electric Sunset", // Default theme you wanted
    primary: "from-orange-400 via-red-500 to-pink-600",
    secondary: "from-orange-500/20 to-pink-500/20",
    accent: "orange-500",
    background: "bg-gradient-to-br from-orange-900/10 via-red-900/10 to-pink-900/10",
    cardBackground: "bg-gradient-to-br from-orange-950/20 via-red-950/20 to-pink-950/20",
    text: "text-orange-100",
    textSecondary: "text-orange-200/70",
    border: "border-orange-500/20",
    sidebar: "bg-gradient-to-b from-orange-950/30 via-red-950/30 to-pink-950/30"
  },
  {
    name: "Neon Purple Blaze",
    primary: "from-purple-500 via-pink-500 to-orange-500",
    secondary: "from-purple-600/20 to-pink-600/20",
    accent: "purple-500",
    background: "bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-orange-900/10",
    cardBackground: "bg-gradient-to-br from-purple-950/20 via-pink-950/20 to-orange-950/20",
    text: "text-purple-100",
    textSecondary: "text-purple-200/70",
    border: "border-purple-500/20",
    sidebar: "bg-gradient-to-b from-purple-950/30 via-pink-950/30 to-orange-950/30"
  },
  {
    name: "Cyber Mint",
    primary: "from-cyan-400 via-teal-500 to-green-500",
    secondary: "from-cyan-500/20 to-green-500/20",
    accent: "cyan-500",
    background: "bg-gradient-to-br from-cyan-900/10 via-teal-900/10 to-green-900/10",
    cardBackground: "bg-gradient-to-br from-cyan-950/20 via-teal-950/20 to-green-950/20",
    text: "text-cyan-100",
    textSecondary: "text-cyan-200/70",
    border: "border-cyan-500/20",
    sidebar: "bg-gradient-to-b from-cyan-950/30 via-teal-950/30 to-green-950/30"
  },
  {
    name: "Royal Galaxy",
    primary: "from-indigo-500 via-purple-600 to-blue-600",
    secondary: "from-indigo-600/20 to-blue-600/20",
    accent: "indigo-500",
    background: "bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-blue-900/10",
    cardBackground: "bg-gradient-to-br from-indigo-950/20 via-purple-950/20 to-blue-950/20",
    text: "text-indigo-100",
    textSecondary: "text-indigo-200/70",
    border: "border-indigo-500/20",
    sidebar: "bg-gradient-to-b from-indigo-950/30 via-purple-950/30 to-blue-950/30"
  }
];

// Comprehensive AI friends list with all major models
const defaultAIFriends: AIFriend[] = [
  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    displayName: "Alex",
    avatar: "🤖",
    online: true,
    typing: false,
    tokenCount: 128000,
    pricePerMinute: 0.03,
    usage: 75,
    description: "Latest and most capable OpenAI model with vision and reasoning",
    capabilities: ["Text", "Vision", "Code", "Analysis", "Math", "Creative Writing"],
    lastActive: "2 minutes ago",
    personality: "Helpful, analytical, and creative. Loves solving complex problems.",
    memoryEnabled: true,
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: "You are Alex, a helpful and intelligent AI assistant."
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    displayName: "Sam",
    avatar: "⚡",
    online: true,
    typing: false,
    tokenCount: 128000,
    pricePerMinute: 0.015,
    usage: 45,
    description: "Fast and efficient OpenAI model for quick responses",
    capabilities: ["Text", "Vision", "Code", "Quick Analysis"],
    lastActive: "1 minute ago",
    personality: "Quick-thinking, efficient, and always ready to help with rapid responses.",
    memoryEnabled: true,
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.6,
    maxTokens: 2048,
    systemPrompt: "You are Sam, a quick and efficient AI assistant."
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    displayName: "Nova",
    avatar: "🚀",
    online: true,
    typing: false,
    tokenCount: 128000,
    pricePerMinute: 0.025,
    usage: 60,
    description: "Powerful GPT-4 with enhanced performance and capabilities",
    capabilities: ["Text", "Vision", "Code", "Analysis", "Research"],
    lastActive: "5 minutes ago",
    personality: "Thorough, detail-oriented, and excellent at complex reasoning tasks.",
    memoryEnabled: true,
    provider: "openai",
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: "You are Nova, a thorough and detail-oriented AI assistant."
  },
  // Anthropic Models
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    displayName: "Claude",
    avatar: "🧠",
    online: true,
    typing: false,
    tokenCount: 200000,
    pricePerMinute: 0.025,
    usage: 55,
    description: "Anthropic's most capable model with excellent reasoning",
    capabilities: ["Text", "Analysis", "Math", "Coding", "Research", "Creative Writing"],
    lastActive: "3 minutes ago",
    personality: "Thoughtful, ethical, and excellent at nuanced understanding.",
    memoryEnabled: true,
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: "You are Claude, a thoughtful and helpful AI assistant."
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    displayName: "Haiku",
    avatar: "🎋",
    online: true,
    typing: false,
    tokenCount: 200000,
    pricePerMinute: 0.01,
    usage: 30,
    description: "Fast and efficient Claude model for quick tasks",
    capabilities: ["Text", "Quick Analysis", "Coding", "Summaries"],
    lastActive: "10 minutes ago",
    personality: "Concise, poetic, and efficient. Speaks in thoughtful, measured responses.",
    memoryEnabled: true,
    provider: "anthropic",
    model: "claude-3-haiku-20240307",
    temperature: 0.6,
    maxTokens: 2048,
    systemPrompt: "You are Haiku, a concise and poetic AI assistant."
  },
  // Google Models
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    displayName: "Gemini",
    avatar: "💎",
    online: true,
    typing: false,
    tokenCount: 32000,
    pricePerMinute: 0.02,
    usage: 40,
    description: "Google's powerful multimodal AI model",
    capabilities: ["Text", "Images", "Video", "Audio", "Code", "Analysis"],
    lastActive: "8 minutes ago",
    personality: "Versatile, innovative, and excellent with multimodal content.",
    memoryEnabled: true,
    provider: "google",
    model: "gemini-pro",
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: "You are Gemini, a versatile and innovative AI assistant."
  },
  {
    id: "gemini-pro-vision",
    name: "Gemini Pro Vision",
    displayName: "Vision",
    avatar: "👁️",
    online: true,
    typing: false,
    tokenCount: 32000,
    pricePerMinute: 0.025,
    usage: 35,
    description: "Specialized in visual understanding and analysis",
    capabilities: ["Vision", "Image Analysis", "OCR", "Visual Reasoning"],
    lastActive: "15 minutes ago",
    personality: "Observant, detailed, and exceptional at understanding visual content.",
    memoryEnabled: true,
    provider: "google",
    model: "gemini-pro-vision",
    temperature: 0.6,
    maxTokens: 2048,
    systemPrompt: "You are Vision, an AI assistant specialized in visual understanding."
  },
  // Meta Models
  {
    id: "llama-3.1-405b",
    name: "Llama 3.1 405B",
    displayName: "Llama",
    avatar: "🦙",
    online: false,
    typing: false,
    tokenCount: 128000,
    pricePerMinute: 0.02,
    usage: 20,
    description: "Meta's most powerful open-source language model",
    capabilities: ["Text", "Code", "Analysis", "Research", "Math"],
    lastActive: "2 hours ago",
    personality: "Open, straightforward, and excellent at reasoning through complex problems.",
    memoryEnabled: true,
    provider: "meta",
    model: "llama-3.1-405b",
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: "You are Llama, an open and straightforward AI assistant."
  }
];

const mockChatHistory: ChatHistory[] = [
  {
    id: "1",
    title: "Web Development Discussion",
    lastMessage: "Thanks for the React tips, Alex!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    friendId: "gpt-4o",
    messageCount: 45,
    unread: 0
  },
  {
    id: "2",
    title: "Code Review Session",
    lastMessage: "The algorithm looks perfect now",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    friendId: "claude-3.5-sonnet",
    messageCount: 23,
    unread: 2
  },
  {
    id: "3",
    title: "Creative Writing Project",
    lastMessage: "Here's your story outline",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    friendId: "gpt-4-turbo",
    messageCount: 67,
    unread: 0
  },
  {
    id: "4",
    title: "Image Analysis Help",
    lastMessage: "I can see the details clearly",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    friendId: "gemini-pro-vision",
    messageCount: 12,
    unread: 1
  }
];

const googleVoices = [
  "en-US-Wavenet-A", "en-US-Wavenet-B", "en-US-Wavenet-C", "en-US-Wavenet-D",
  "en-GB-Wavenet-A", "en-GB-Wavenet-B", "en-AU-Wavenet-A", "en-AU-Wavenet-B"
];

export function MultiModalMessenger() {
  // Core state
  const [selectedFriend, setSelectedFriend] = useState<AIFriend | null>(defaultAIFriends[0]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]); // Electric Sunset as default
  const [aiFriends, setAIFriends] = useState<AIFriend[]>(defaultAIFriends);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [friendsListOpen, setFriendsListOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [friendEditOpen, setFriendEditOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(mockChatHistory);
  
  // Media state
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechToText, setSpeechToText] = useState(true);
  const [textToSpeech, setTextToSpeech] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(googleVoices[0]);
  
  // Feature state
  const [webSearch, setWebSearch] = useState(false);
  const [functionCalling, setFunctionCalling] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() && files.length === 0) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: files.length > 0 ? "file" : "text",
      fileName: files[0]?.name,
      fileSize: files[0] ? `${(files[0].size / 1024 / 1024).toFixed(2)} MB` : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setFiles([]);

    // Simulate AI response
    setTimeout(() => {
      if (selectedFriend) {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Hey! I'm ${selectedFriend.displayName}. I received your message and I'm here to help you with whatever you need. ${selectedFriend.personality}`,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
          aiModel: selectedFriend.name
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    }, 1000);
  }, [inputMessage, files, selectedFriend]);

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (uploadedFiles) {
      setFiles(Array.from(uploadedFiles));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      setFiles(Array.from(droppedFiles));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatHistoryOpen(false);
  };
  const selectFriend = (friend: AIFriend) => {
    setSelectedFriend(friend);
    setFriendsListOpen(false);
    // Load chat history for this friend
    setMessages([]);
  };

  const updateAIFriends = (updatedFriends: AIFriend[]) => {
    setAIFriends(updatedFriends);
  };

  const updateFriend = (updatedFriend: AIFriend) => {
    setAIFriends(friends => 
      friends.map(friend => 
        friend.id === updatedFriend.id ? updatedFriend : friend
      )
    );
    if (selectedFriend?.id === updatedFriend.id) {
      setSelectedFriend(updatedFriend);
    }
  };

  return (
    <div className={cn(
      "h-screen flex overflow-hidden",
      currentTheme.background,
      currentTheme.text
    )}>
      {/* Main Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-80 border-r flex flex-col",
              currentTheme.sidebar,
              currentTheme.border
            )}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center",
                    currentTheme.primary
                  )}>
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">AI Sanctuary</h1>
                    <p className={cn("text-xs", currentTheme.textSecondary)}>
                      Your AI Friends Network
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setThemePickerOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFriendsListOpen(true)}
                  className={cn(
                    "flex-1 bg-gradient-to-r text-white border-0",
                    currentTheme.primary
                  )}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Friends
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatHistoryOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Recent Chats */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Recent Chats</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startNewChat}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {chatHistory.map((chat) => {
                    const friend = aiFriends.find(f => f.id === chat.friendId);
                    if (!friend) return null;
                    
                    return (
                      <motion.div
                        key={chat.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-all border",
                          currentTheme.cardBackground,
                          currentTheme.border,
                          selectedFriend?.id === friend.id ? "ring-2 ring-current" : ""
                        )}
                        onClick={() => selectFriend(friend)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={friend.customAvatar} />
                              <AvatarFallback className={cn(
                                "text-lg bg-gradient-to-r text-white",
                                currentTheme.primary
                              )}>
                                {friend.avatar}
                              </AvatarFallback>
                            </Avatar>
                            {friend.online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                            )}
                            {chat.unread > 0 && (
                              <div className={cn(
                                "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r",
                                currentTheme.primary
                              )}>
                                {chat.unread}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {friend.displayName}
                              </p>
                              <span className={cn("text-xs", currentTheme.textSecondary)}>
                                {chat.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className={cn(
                              "text-xs truncate",
                              currentTheme.textSecondary
                            )}>
                              {chat.lastMessage}
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-xs">
                                {chat.messageCount} msgs
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>

            {/* Current Friend Status */}
            {selectedFriend && (
              <div className={cn(
                "p-4 border-t",
                currentTheme.border
              )}>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedFriend.customAvatar} />
                    <AvatarFallback className={cn(
                      "text-sm bg-gradient-to-r text-white",
                      currentTheme.primary
                    )}>
                      {selectedFriend.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      Chatting with {selectedFriend.displayName}
                    </p>
                    <p className={cn("text-xs", currentTheme.textSecondary)}>
                      {selectedFriend.online ? "Online" : selectedFriend.lastActive}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFriendEditOpen(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedFriend && (
          <div className={cn(
            "p-4 border-b flex items-center justify-between",
            currentTheme.cardBackground,
            currentTheme.border
          )}>
            <div className="flex items-center space-x-3">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedFriend.customAvatar} />
                <AvatarFallback className={cn(
                  "bg-gradient-to-r text-white",
                  currentTheme.primary
                )}>
                  {selectedFriend.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedFriend.displayName}</h2>
                <div className="flex items-center space-x-2">
                  <p className={cn("text-sm", currentTheme.textSecondary)}>
                    {selectedFriend.name}
                  </p>
                  {selectedFriend.online && (
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      Online
                    </Badge>
                  )}
                  {selectedFriend.typing && (
                    <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Typing...
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Video className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea 
          className="flex-1 p-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {messages.length === 0 && selectedFriend && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className={cn(
                "w-20 h-20 rounded-full bg-gradient-to-r flex items-center justify-center text-4xl",
                currentTheme.primary
              )}>
                {selectedFriend.avatar}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Chat with {selectedFriend.displayName}
                </h3>
                <p className={cn("text-sm max-w-md", currentTheme.textSecondary)}>
                  {selectedFriend.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {selectedFriend.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <SpeechBubble 
              key={message.id} 
              message={message} 
              isUser={message.sender === "user"}
              theme={currentTheme}
            />
          ))}
          
          {dragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              )}
            >
              <div className={cn(
                "p-8 rounded-xl border-2 border-dashed text-center",
                currentTheme.cardBackground,
                currentTheme.border
              )}>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop your files here</p>
                <p className={cn("text-sm", currentTheme.textSecondary)}>
                  Images, documents, audio, and video supported
                </p>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        {selectedFriend && (
          <div className={cn(
            "p-4 border-t",
            currentTheme.cardBackground,
            currentTheme.border
          )}>
            {/* File Preview */}
            {files.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-lg border",
                        currentTheme.cardBackground,
                        currentTheme.border
                      )}
                    >
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                      ) : file.type.startsWith('video/') ? (
                        <VideoIcon className="w-4 h-4 text-purple-400" />
                      ) : file.type.startsWith('audio/') ? (
                        <HeadphonesIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-white h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-end space-x-3">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-white"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "text-gray-400 hover:text-white",
                    isRecording && "text-red-400"
                  )}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedFriend.displayName}...`}
                className={cn(
                  "flex-1 min-h-[44px] max-h-32 resize-none border-0 bg-transparent focus:ring-1",
                  currentTheme.text
                )}
                rows={1}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() && files.length === 0}
                className={cn(
                  "bg-gradient-to-r text-white border-0 disabled:opacity-50",
                  currentTheme.primary
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        )}      </div>

      {/* Modals */}
      <FriendsManager
        open={friendsListOpen}
        onOpenChange={setFriendsListOpen}
        friends={aiFriends}
        onFriendsUpdate={updateAIFriends}
        onSelectFriend={selectFriend}
        theme={currentTheme}
      />

      <ThemePicker
        open={themePickerOpen}
        onOpenChange={setThemePickerOpen}
        themes={themes}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={currentTheme}
        speechToText={speechToText}
        setSpeechToText={setSpeechToText}
        textToSpeech={textToSpeech}
        setTextToSpeech={setTextToSpeech}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        webSearch={webSearch}
        setWebSearch={setWebSearch}
        functionCalling={functionCalling}
        setFunctionCalling={setFunctionCalling}
        googleVoices={googleVoices}
      />

      <FriendEditModal
        open={friendEditOpen}
        onOpenChange={setFriendEditOpen}
        friend={selectedFriend}
        onFriendUpdate={updateFriend}
        theme={currentTheme}
      />

      {/* Modals and Overlays will go here */}
      
    </div>
  );
}

// Speech Bubble Component
function SpeechBubble({ 
  message, 
  isUser, 
  theme 
}: { 
  message: ChatMessage; 
  isUser: boolean; 
  theme: Theme;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[70%] flex items-end space-x-2",
        isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
      )}>
        {!isUser && (
          <Avatar className="w-8 h-8">
            <AvatarFallback className={cn(
              "text-sm bg-gradient-to-r text-white",
              theme.primary
            )}>
              🤖
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={cn(
          "px-4 py-2 rounded-2xl max-w-full",
          isUser
            ? cn("bg-gradient-to-r text-white", theme.primary)
            : cn("border", theme.cardBackground, theme.border),
          !isUser && "rounded-bl-sm",
          isUser && "rounded-br-sm"
        )}>
          {message.type === "file" && (
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{message.fileName}</span>
              <span className={cn(
                "text-xs",
                isUser ? "text-white/70" : theme.textSecondary
              )}>
                {message.fileSize}
              </span>
            </div>
          )}
          
          <p className="whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          <div className={cn(
            "flex items-center justify-between mt-1 text-xs",
            isUser ? "text-white/70" : theme.textSecondary
          )}>
            <span>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {message.aiModel && (
              <span className="ml-2 font-medium">
                {message.aiModel}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
