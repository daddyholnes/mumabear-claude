"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorSpeaker,
  Send,
  Paperclip,
  Image,
  Smile,
  Copy,
  Settings,
  ChevronDown,
  MessageCircle,
  History,
  Palette,
  Upload,
  Globe,
  Search,
  Database,
  Zap,
  Bot,
  User,
  Sparkles,
  Cloud,
  Moon,
  Sun,
  Volume2,
  Thermometer,
  FileText,
  X,
  PanelRight,
  PanelRightClose
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Custom hooks
function useAutoResizeTextarea({ minHeight = 48, maxHeight = 164 }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (reset = false) => {
    if (textareaRef.current) {
      if (reset) {
        textareaRef.current.style.height = `${minHeight}px`;
      } else {
        textareaRef.current.style.height = `${minHeight}px`;
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      }
    }
  };

  return { textareaRef, adjustHeight };
}

// Text Shimmer Component
interface TextShimmerProps {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}

function TextShimmer({
  children,
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <motion.div
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </motion.div>
  );
}

// Particles Component
interface MousePosition {
  x: number;
  y: number;
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

// Main Component
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLive?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const themes = {
  'purple-haze': {
    name: 'Purple Haze',
    gradient: 'bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900',
    particles: '#8b5cf6'
  },
  'midnight-sparkles': {
    name: 'Midnight Sparkles',
    gradient: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    particles: '#ffffff'
  },
  'daytime-clouds': {
    name: 'Daytime Clouds',
    gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    particles: '#ffffff'
  }
};

const geminiModels = [
  { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
];

const voices = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'nova', label: 'Nova' },
  { value: 'shimmer', label: 'Shimmer' }
];

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '🎉', '🚀', '⭐'];

interface LiveStudio6Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

export function GeminiLiveStudio({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme = 'system',
  className = ''
}: LiveStudio6Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Gemini AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWindowSharing, setIsWindowSharing] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [temperature, setTemperature] = useState([0.7]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [ragEnabled, setRagEnabled] = useState(false);
  const [functionCallingEnabled, setFunctionCallingEnabled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('purple-haze');
  const [liveBubbles, setLiveBubbles] = useState<string[]>([]);
  const [chatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Previous Chat 1', lastMessage: 'How does AI work?', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', title: 'Previous Chat 2', lastMessage: 'Explain quantum computing', timestamp: new Date(Date.now() - 172800000) },
    { id: '3', title: 'Previous Chat 3', lastMessage: 'Help with coding', timestamp: new Date(Date.now() - 259200000) },
    { id: '4', title: 'Previous Chat 4', lastMessage: 'Creative writing tips', timestamp: new Date(Date.now() - 345600000) },
    { id: '5', title: 'Previous Chat 5', lastMessage: 'Science questions', timestamp: new Date(Date.now() - 432000000) }
  ]);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 164 });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    adjustHeight(true);
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a simulated AI response. In a real implementation, this would connect to the Gemini Live API.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  const handleImagePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          console.log('Image pasted:', blob);
        }
      }
    }
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    if (!isLiveMode) {
      // Start live mode - simulate live bubbles
      const interval = setInterval(() => {
        setLiveBubbles(prev => {
          const newBubbles = [...prev, `Live message ${Date.now()}`];
          if (newBubbles.length > 3) {
            newBubbles.shift();
          }
          return newBubbles;
        });
      }, 2000);

      setTimeout(() => clearInterval(interval), 10000);
    }
  };

  const themeConfig = themes[currentTheme];

  return (
    <TooltipProvider>
      <div className={cn("min-h-screen flex", themeConfig.gradient)}>
        <Particles
          className="absolute inset-0"
          quantity={150}
          ease={80}
          color={themeConfig.particles}
          refresh
        />
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/10 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                <TextShimmer className="text-white">Gemini Live Studio</TextShimmer>
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Media Controls */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all duration-300",
                      isRecording 
                        ? "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/30" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all duration-300",
                      isVideoOn 
                        ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/30" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {isVideoOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all duration-300",
                      isScreenSharing 
                        ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/30" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    <Monitor className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsWindowSharing(!isWindowSharing)}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all duration-300",
                      isWindowSharing 
                        ? "bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/30" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    <MonitorSpeaker className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isWindowSharing ? 'Stop Window Share' : 'Share Window'}
                </TooltipContent>
              </Tooltip>

              <Button
                onClick={toggleLiveMode}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isLiveMode 
                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {isLiveMode ? 'Stop Live' : 'Go Live'}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                {sidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-sm",
                    message.sender === 'user'
                      ? 'bg-blue-500/80 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-white border border-white/20'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}

            {/* Thinking Animation */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/10 text-white border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <TextShimmer className="text-white">Thinking...</TextShimmer>
                </div>
              </motion.div>
            )}

            {/* Live Bubbles */}
            <AnimatePresence>
              {isLiveMode && liveBubbles.map((bubble, index) => (
                <motion.div
                  key={`${bubble}-${index}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 justify-start"
                >
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
                      <Volume2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-red-500/20 text-white border border-red-500/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
                    <Badge variant="secondary" className="mb-2">Live</Badge>
                    <p className="text-sm">{bubble}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-black/10 backdrop-blur-sm border-t border-white/10">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    adjustHeight();
                  }}
                  onPaste={handleImagePaste}
                  placeholder="Type your message or paste an image..."
                  className="w-full bg-transparent border-none text-white placeholder:text-white/60 resize-none focus-visible:ring-0 p-4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                
                <div className="flex items-center justify-between p-4 pt-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach File</TooltipContent>
                    </Tooltip>

                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Upload Image</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowEmojis(!showEmojis)}
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add Emoji</TooltipContent>
                    </Tooltip>

                    {showEmojis && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-full left-0 mb-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 grid grid-cols-6 gap-1"
                      >
                        {emojis.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-lg hover:bg-white/10"
                            onClick={() => {
                              setInput(prev => prev + emoji);
                              setShowEmojis(false);
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className="rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-300"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 bg-black/20 backdrop-blur-sm border-l border-white/10 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Model Selection */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {geminiModels.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Voice Selection */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Voice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  </CardContent>
                </Card>

                {/* Temperature */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature: {temperature[0]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="web-search" className="text-white text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Web Search
                      </Label>
                      <Switch
                        id="web-search"
                        checked={webSearchEnabled}
                        onCheckedChange={setWebSearchEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rag" className="text-white text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        RAG
                      </Label>
                      <Switch
                        id="rag"
                        checked={ragEnabled}
                        onCheckedChange={setRagEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="function-calling" className="text-white text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Function Calling
                      </Label>
                      <Switch
                        id="function-calling"
                        checked={functionCallingEnabled}
                        onCheckedChange={setFunctionCallingEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Themes */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Themes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(themes).map(([key, theme]) => (
                      <Button
                        key={key}
                        variant={currentTheme === key ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          currentTheme === key 
                            ? "bg-white/20 text-white" 
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => setCurrentTheme(key as keyof typeof themes)}
                      >
                        {key === 'purple-haze' && <Moon className="h-4 w-4 mr-2" />}
                        {key === 'midnight-sparkles' && <Sparkles className="h-4 w-4 mr-2" />}
                        {key === 'daytime-clouds' && <Cloud className="h-4 w-4 mr-2" />}
                        {theme.name}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Chat History */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Chats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {chatHistory.slice(0, 5).map((chat) => (
                      <Button
                        key={chat.id}
                        variant="ghost"
                        className="w-full justify-start text-left p-2 h-auto text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium truncate w-full">
                            {chat.title}
                          </span>
                          <span className="text-xs opacity-60 truncate w-full">
                            {chat.lastMessage}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}

export default GeminiLiveStudio;
export type { LiveStudio6Props };
