"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorSpeaker, 
  Phone, 
  PhoneOff,
  Settings,
  Upload,
  Image as ImageIcon,
  Paperclip,
  Send,
  Copy,
  RefreshCw,
  Smile,
  ChevronRight,
  ChevronLeft,
  History,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Cloud,
  X,
  Play,
  Pause,
  Volume2
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { cn } from "../../lib/utils";

// Hooks
const useDimensions = (ref: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [ref]);

  return dimensions;
};

const useAutoScroll = ({ smooth = false, content }: { smooth?: boolean; content: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, [smooth]);

  const disableAutoScroll = useCallback(() => {
    setAutoScrollEnabled(false);
  }, []);

  useEffect(() => {
    if (autoScrollEnabled && isAtBottom) {
      scrollToBottom();
    }
  }, [content, autoScrollEnabled, isAtBottom, scrollToBottom]);

  return {
    scrollRef,
    isAtBottom,
    autoScrollEnabled,
    scrollToBottom,
    disableAutoScroll,
  };
};

// Animated Gradient Component
interface AnimatedGradientProps {
  colors: string[];
  speed?: number;
  blur?: "light" | "medium" | "heavy";
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  speed = 5,
  blur = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  const circleSize = useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  );

  const blurClass =
    blur === "light"
      ? "blur-2xl"
      : blur === "medium"
      ? "blur-3xl"
      : "blur-[100px]";

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={cn(`absolute inset-0`, blurClass)}>
        {colors.map((color, index) => (
          <motion.svg
            key={index}
            className="absolute"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 50}%`,
            }}
            width={circleSize * 0.8}
            height={circleSize * 0.8}
            viewBox="0 0 100 100"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={color}
              className="opacity-30 dark:opacity-[0.15]"
            />
          </motion.svg>
        ))}
      </div>
    </div>
  );
};

// Response Stream Component
interface ResponseStreamProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const ResponseStream: React.FC<ResponseStreamProps> = ({
  text,
  speed = 50,
  className,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <div className={className}>{displayedText}</div>;
};

// Chat Bubble Components
interface ChatBubbleProps {
  variant?: "sent" | "received";
  children: React.ReactNode;
  className?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  variant = "received",
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 mb-4",
        variant === "sent" && "flex-row-reverse",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface ChatBubbleMessageProps {
  variant?: "sent" | "received";
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ChatBubbleMessage: React.FC<ChatBubbleMessageProps> = ({
  variant = "received",
  isLoading,
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl p-4 max-w-md relative",
        variant === "sent" 
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
          : "bg-muted border border-border",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-current rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
};

// Live Chat Bubble Component
interface LiveChatBubbleProps {
  text: string;
  variant: "sent" | "received";
  onComplete?: () => void;
}

const LiveChatBubble: React.FC<LiveChatBubbleProps> = ({
  text,
  variant,
  onComplete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3 mb-2",
        variant === "sent" && "flex-row-reverse"
      )}
    >
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          {variant === "sent" ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-2xl p-3 max-w-xs",
          variant === "sent"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-muted border border-border"
        )}
      >
        <ResponseStream
          text={text}
          speed={30}
          onComplete={onComplete}
        />
      </div>
    </motion.div>
  );
};

// Emoji Picker Component
const EmojiPicker: React.FC<{ onEmojiSelect: (emoji: string) => void }> = ({
  onEmojiSelect,
}) => {
  const emojis = ["😀", "😂", "😍", "🤔", "👍", "❤️", "🎉", "🔥", "💯", "🚀"];

  return (
        <div className="grid grid-cols-5 gap-2 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
      {emojis.map((emoji, index) => (
                <Button
          key={index}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20"
          onClick={() => onEmojiSelect(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
};

// Voice Visualizer Component
const VoiceVisualizer: React.FC<{ isActive: boolean; bars?: number }> = ({
  isActive,
  bars = 20,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-purple-500 rounded-full"
          animate={
            isActive
              ? {
                  height: [4, Math.random() * 20 + 4, 4],
                }
              : { height: 4 }
          }
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Main Component
interface LiveStudio5Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

const GeminiLiveStudio: React.FC<LiveStudio5Props> = ({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme = 'system',
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [temperature, setTemperature] = useState([0.7]);
  const [theme, setTheme] = useState("purple-haze");
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm Gemini. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [liveBubbles, setLiveBubbles] = useState<Array<{
    id: number;
    text: string;
    variant: "sent" | "received";
  }>>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [chatHistory] = useState([
    "Previous Chat 1",
    "Previous Chat 2", 
    "Previous Chat 3",
    "Previous Chat 4",
    "Previous Chat 5",
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const models = [
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro" },
  ];

  const voices = [
    { value: "alloy", label: "Alloy" },
    { value: "echo", label: "Echo" },
    { value: "fable", label: "Fable" },
    { value: "onyx", label: "Onyx" },
    { value: "nova", label: "Nova" },
    { value: "shimmer", label: "Shimmer" },
  ];

  const themes = [
    { value: "purple-haze", label: "Purple Haze", colors: ["#8B5CF6", "#A855F7", "#C084FC"] },
    { value: "midnight-sky", label: "Midnight Sky", colors: ["#1E293B", "#334155", "#475569"] },
    { value: "daytime-clouds", label: "Daytime Clouds", colors: ["#E0F2FE", "#BAE6FD", "#7DD3FC"] },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content: inputValue,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: "I understand your message. Let me help you with that.",
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    console.log("Files dropped:", files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const startLiveChat = () => {
    setIsLiveMode(true);
    setIsRecording(true);
    
    // Simulate live conversation
    const liveChatSimulation = [
      { text: "Hello, how are you?", variant: "sent" as const },
      { text: "I'm doing great! How can I help you today?", variant: "received" as const },
      { text: "I'd like to know about the weather", variant: "sent" as const },
      { text: "Sure! The weather today is sunny with a high of 75°F", variant: "received" as const },
    ];

    liveChatSimulation.forEach((bubble, index) => {
      setTimeout(() => {
        const bubbleId = Date.now() + index;
        setLiveBubbles(prev => [...prev, { ...bubble, id: bubbleId }]);
        
        // Remove bubble after 3 seconds
        setTimeout(() => {
          setLiveBubbles(prev => prev.filter(b => b.id !== bubbleId));
        }, 3000);
      }, index * 2000);
    });
  };

  const stopLiveChat = () => {
    setIsLiveMode(false);
    setIsRecording(false);
    setLiveBubbles([]);
  };

  return (
    <div className="h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedGradient colors={currentTheme.colors} speed={15} blur="heavy" />
      
            {/* Left Sidebar - Chat History */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border-r border-border/50 p-6 flex flex-col rounded-r-3xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="font-bold text-lg">Gemini Live Studio</h2>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Chats
          </h3>
                    <div className="space-y-2">
            {chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="p-3 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 cursor-pointer text-sm transition-all duration-300"
              >
                {chat}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Themes
          </h3>
          <div className="space-y-2">
            {themes.map((themeOption) => (
                            <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start rounded-2xl"
                onClick={() => setTheme(themeOption.value)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {themeOption.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {themeOption.label}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
                {/* Top Controls */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                            <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={isLiveMode ? stopLiveChat : startLiveChat}
                className="relative overflow-hidden rounded-2xl"
              >
                {isRecording ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                {isLiveMode ? "End Live Chat" : "Start Live Chat"}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 bg-red-500/20"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </Button>
              
                            <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className="rounded-2xl"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
                            <Button
                variant={isVideoOn ? "default" : "outline"}
                size="sm"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-2xl"
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              
                            <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="rounded-2xl"
              >
                {isScreenSharing ? <MonitorSpeaker className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </Button>
            </div>

                        <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-2xl"
            >
              {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Voice Visualizer */}
        {isRecording && (
                    <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 backdrop-blur-sm border-b border-border/50 rounded-b-3xl"
          >
            <VoiceVisualizer isActive={isRecording} />
          </motion.div>
        )}

        {/* Chat Messages */}
                <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                                <ChatBubbleMessage variant={message.sender === "user" ? "sent" : "received"} className="rounded-3xl">
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isTyping && (
              <ChatBubble variant="received">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                                <ChatBubbleMessage isLoading className="rounded-3xl" />
              </ChatBubble>
            )}
          </div>

          {/* Live Chat Bubbles Overlay */}
          <AnimatePresence>
            {isLiveMode && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-end">
                <AnimatePresence>
                  {liveBubbles.map((bubble) => (
                    <LiveChatBubble
                      key={bubble.id}
                      text={bubble.text}
                      variant={bubble.variant}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

                {/* Input Area */}
        <div
          className={cn(
            "p-6 border-t border-border/50 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-md rounded-t-3xl",
            dragActive && "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
                            <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message or drag files here..."
                className="min-h-[60px] max-h-32 resize-none pr-20 bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-purple-500/50 rounded-3xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>

              {showEmojiPicker && (
                <div className="absolute bottom-12 right-2">
                  <EmojiPicker
                    onEmojiSelect={(emoji) => {
                      setInputValue(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
            
                        <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-3xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <AnimatePresence>
        {sidebarOpen && (
                    <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="w-80 bg-gradient-to-bl from-orange-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-md border-l border-border/50 p-6 flex flex-col rounded-l-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5" />
              <h3 className="font-semibold">Settings</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Voice</label>
                                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Temperature: {temperature[0]}
                </label>
                                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full [&_[role=slider]]:rounded-full"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Features</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Function Calling</span>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Web Search</span>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">RAG</span>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Media Controls</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-record</span>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Video Quality</span>
                                    <Badge variant="secondary" className="rounded-full">HD</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeminiLiveStudio;
export type { LiveStudio5Props };
