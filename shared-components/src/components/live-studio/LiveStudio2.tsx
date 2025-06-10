"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Settings,
  ChevronRight,
  ChevronLeft,
  Upload,
  Image,
  Smile,
  Copy,
  Send,
  Square, // Changed from 'Stop' which doesn't exist
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  History,
  Palette,
  Sun,
  Moon,
  Cloud,
  X,
  File,
  FileText,
  Check,
  AlertCircle,
  Film,
  Music,
  Code,
  Archive,
  Maximize,
  Minimize,
  Trash2,
  Paperclip,
  ArrowUp,
  Loader2
} from 'lucide-react';

// Utility function
const cn = (...inputs: any[]) => {
  return inputs.filter(Boolean).join(' ');
};

// Types
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLive?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
  uploaded: boolean;
}

// Shining Text Component
const ShiningText = ({ text }: { text: string }) => {
  return (
    <motion.div
      className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent"
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.div>
  );
};

// File Upload Component
const FileUploader = ({ onFilesSelected }: { onFilesSelected: (files: FileItem[]) => void }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles).map(file => {
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview,
        progress: 0,
        uploaded: false
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelected(newFiles);
    
    newFiles.forEach(fileItem => {
      simulateUpload(fileItem.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId ? { ...f, progress, uploaded: true } : f
          )
        );
      } else {
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.startsWith('video/')) return <Film size={16} />;
    if (type.startsWith('audio/')) return <Music size={16} />;
    if (type.startsWith('text/')) return <FileText size={16} />;
    if (type.includes('compressed') || type.includes('zip')) return <Archive size={16} />;
    if (type.includes('json') || type.includes('javascript')) return <Code size={16} />;
    return <File size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
      >
        <Upload className="h-4 w-4 text-purple-400" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-black border border-purple-500/30 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500/30 p-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center mr-3">
              <Upload className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-white font-bold">File Upload</h2>
          </div>
          <button 
            className="h-7 w-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
            onClick={() => setExpanded(false)}
          >
            <X className="h-4 w-4 text-gray-300" />
          </button>
        </div>
        
        <div
          className={cn(
            "p-6 m-3 border border-dashed rounded-lg transition-colors cursor-pointer",
            isDragging ? "border-purple-400" : "border-gray-700 hover:border-gray-500"
          )}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            multiple
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="font-medium mb-2 text-white">
              {isDragging ? "Release to Upload" : "Drop files here"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium">
              SELECT FILES
            </div>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="mt-3 px-3 pb-3">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="relative group flex bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                  <div className="h-12 w-12 flex-shrink-0 bg-gray-800 flex items-center justify-center">
                    {file.preview ? (
                      <img src={file.preview} alt={file.file.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-purple-400">{getFileIcon(file.file.type)}</div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 p-2 pl-3">
                    <div className="truncate text-sm text-white font-medium">{file.file.name}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="text-xs text-gray-500">{formatFileSize(file.file.size)}</div>
                      <div className="text-xs flex items-center">
                        {file.uploaded ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <Check size={12} />
                            Complete
                          </span>
                        ) : (
                          <span className="text-purple-400">{file.progress}%</span>
                        )}
                      </div>
                    </div>
                    
                    {!file.uploaded && (
                      <div className="mt-1 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-blue-600 transition-all duration-200"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"
                    onClick={() => removeFile(file.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Emoji Picker Component
const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }: { 
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🚀', '💡'];

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full mb-2 left-0 bg-gray-900 border border-purple-500/30 rounded-lg p-3 grid grid-cols-6 gap-2">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onEmojiSelect(emoji);
            onClose();
          }}
          className="p-2 hover:bg-purple-500/20 rounded transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

// Main Component
interface LiveStudio2Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

const GeminiLiveStudio: React.FC<LiveStudio2Props> = ({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme = 'system',
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [temperature, setTemperature] = useState(0.7);
  const [functionCalling, setFunctionCalling] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [rag, setRag] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('purple-haze');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWindowSharing, setIsWindowSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const models = [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' }
  ];

  const voices = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'nova', name: 'Nova' },
    { id: 'shimmer', name: 'Shimmer' }
  ];

  const themes = [
    { id: 'purple-haze', name: 'Purple Haze', gradient: 'from-purple-900 via-purple-800 to-indigo-900' },
    { id: 'midnight-sky', name: 'Midnight Sky', gradient: 'from-gray-900 via-blue-900 to-black' },
    { id: 'daytime-clouds', name: 'Daytime Clouds', gradient: 'from-blue-400 via-blue-300 to-white' }
  ];

  const chatHistory: ChatHistory[] = [
    { id: '1', title: 'AI Model Comparison', lastMessage: 'Which model is best for coding?', timestamp: new Date() },
    { id: '2', title: 'Creative Writing Help', lastMessage: 'Help me write a story about...', timestamp: new Date() },
    { id: '3', title: 'Technical Documentation', lastMessage: 'How to implement OAuth?', timestamp: new Date() },
    { id: '4', title: 'Data Analysis', lastMessage: 'Analyze this dataset...', timestamp: new Date() },
    { id: '5', title: 'Code Review', lastMessage: 'Review my React component', timestamp: new Date() }
  ];

  const handleSendMessage = () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your request. Let me help you with that...",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 2000);
  };

  const handleLiveToggle = () => {
    setIsLiveMode(!isLiveMode);
    if (!isLiveMode) {
      // Start live mode
      setIsRecording(true);
    } else {
      // Stop live mode
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const fileItem: FileItem = {
            id: Date.now().toString(),
            file: blob,
            preview: URL.createObjectURL(blob),
            progress: 100,
            uploaded: true
          };
          setUploadedFiles(prev => [...prev, fileItem]);
        }
      }
    }
  };

  const currentThemeConfig = themes.find(t => t.id === currentTheme) || themes[0];

  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        const liveMessage: Message = {
          id: Date.now().toString(),
          content: "Live response...",
          role: 'assistant',
          timestamp: new Date(),
          isLive: true
        };
        setLiveMessages(prev => [...prev, liveMessage]);
        
        setTimeout(() => {
          setLiveMessages(prev => prev.filter(m => m.id !== liveMessage.id));
        }, 3000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentThemeConfig.gradient} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {currentTheme === 'midnight-sky' && (
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
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
        
        {currentTheme === 'daytime-clouds' && (
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
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="flex h-screen relative z-10">
        {/* Left Sidebar - Chat History */}
        <div className="w-64 bg-black/20 backdrop-blur-md border-r border-white/10 p-4">
          <div className="mb-6">
            <h2 className="text-white font-bold text-lg mb-2">Gemini Live Studio</h2>
            <p className="text-white/60 text-sm">AI-Powered Conversations</p>
          </div>

          <div className="mb-6">
            <h3 className="text-white/80 font-medium mb-3">Recent Chats</h3>
            <div className="space-y-2">
              {chatHistory.slice(0, 5).map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="text-white text-sm font-medium truncate">{chat.title}</div>
                  <div className="text-white/60 text-xs truncate mt-1">{chat.lastMessage}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white/80 font-medium mb-3">Themes</h3>
            <div className="space-y-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => setCurrentTheme(themeOption.id)}
                  className={cn(
                    "w-full p-2 rounded-lg text-left transition-colors",
                    currentTheme === themeOption.id ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="text-white text-sm">{themeOption.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <motion.div
              className="text-white/60 text-xs"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShiningText text="AI is thinking..." />
            </motion.div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {isRecording ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isVideoOn 
                    ? "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30" 
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isScreenSharing 
                    ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30" 
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {isScreenSharing ? <Monitor className="h-5 w-5 text-white" /> : <MonitorOff className="h-5 w-5 text-white" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isMuted 
                    ? "bg-gray-500 hover:bg-gray-600" 
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
              </button>

              <button
                onClick={handleLiveToggle}
                className={cn(
                  "px-4 py-2 rounded-full font-medium transition-all duration-300",
                  isLiveMode 
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30" 
                    : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                )}
              >
                {isLiveMode ? "Stop Live" : "Go Live"}
              </button>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {sidebarOpen ? <ChevronRight className="h-5 w-5 text-white" /> : <ChevronLeft className="h-5 w-5 text-white" />}
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-white/10 backdrop-blur-md text-white border border-white/20"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Live Messages */}
              {liveMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-start"
                >
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/30 backdrop-blur-md">
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                      <p className="text-xs opacity-70">Live</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Thinking Animation */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <ShiningText text="AI is thinking..." />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-4">
            <div className="relative">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onPaste={handlePaste}
                    placeholder="Type your message..."
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 pr-24 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Smile className="h-4 w-4 text-white" />
                      </button>
                      <EmojiPicker
                        isOpen={showEmojiPicker}
                        onClose={() => setShowEmojiPicker(false)}
                        onEmojiSelect={(emoji) => setInput(prev => prev + emoji)}
                      />
                    </div>
                    
                    <button
                      onClick={() => setShowFileUploader(true)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Paperclip className="h-4 w-4 text-white" />
                    </button>
                    
                    <button
                      onClick={() => navigator.clipboard.writeText(input)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Copy className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() && uploadedFiles.length === 0}
                  className={cn(
                    "p-3 rounded-full transition-all duration-300",
                    input.trim() || uploadedFiles.length > 0
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30"
                      : "bg-white/10 cursor-not-allowed"
                  )}
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative group">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                        {file.preview ? (
                          <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <File className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <button
                        onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-black/20 backdrop-blur-md border-l border-white/10 p-4 overflow-y-auto"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Model Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Model</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {models.map((model) => (
                          <option key={model.id} value={model.id} className="bg-gray-900">
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Voice</label>
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {voices.map((voice) => (
                          <option key={voice.id} value={voice.id} className="bg-gray-900">
                            {voice.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Temperature: {temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">Features</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={functionCalling}
                        onChange={(e) => setFunctionCalling(e.target.checked)}
                        className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                      />
                      <span className="text-white/80">Function Calling</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={webSearch}
                        onChange={(e) => setWebSearch(e.target.checked)}
                        className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                      />
                      <span className="text-white/80">Web Search</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={rag}
                        onChange={(e) => setRag(e.target.checked)}
                        className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                      />
                      <span className="text-white/80">RAG</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowFileUploader(true)}
                      className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-left flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Files</span>
                    </button>

                    <button className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-left flex items-center space-x-2">
                      <Image className="h-4 w-4" />
                      <span>Upload Image</span>
                    </button>

                    <button className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-left flex items-center space-x-2">
                      <History className="h-4 w-4" />
                      <span>Chat History</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Uploader Modal */}
      {showFileUploader && (
        <FileUploader
          onFilesSelected={(files) => {
            setUploadedFiles(prev => [...prev, ...files]);
            setShowFileUploader(false);
          }}
        />
      )}
    </div>
  );
};

export default GeminiLiveStudio;
export type { LiveStudio2Props };
