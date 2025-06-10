"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Zap, 
  Plus, 
  Search, 
  FileText, 
  Lightbulb, 
  BarChart3, 
  GraduationCap,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  Cloud,
  Moon,
  Mic,
  Video,
  Upload,
  Image,
  Monitor,
  GripVertical,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
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
  color?: string;
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
  quantity = 50,
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = "#ffffff",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
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

  const circleParams = () => {
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

  const drawCircle = (circle: any, update = false) => {
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
    circles.current.forEach((circle: any, i: number) => {
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
      circle.x += circle.dx;
      circle.y += circle.dy;
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

interface TextShimmerProps {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}

const TextShimmer: React.FC<TextShimmerProps> = ({
  children,
  className,
  duration = 2,
  spread = 2,
}) => {
  const dynamicSpread = children.length * spread;

  return (
    <motion.div
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#ffffff]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
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
};

interface GlowEffectProps {
  className?: string;
  colors?: string[];
  mode?: 'rotate' | 'pulse' | 'static';
  blur?: 'medium' | 'soft' | 'strong';
  scale?: number;
  duration?: number;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
  className,
  colors = ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9'],
  mode = 'rotate',
  blur = 'medium',
  scale = 1,
  duration = 5,
}) => {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: duration,
    ease: 'linear',
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(', ')})`,
      ],
      transition: BASE_TRANSITION,
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        ...BASE_TRANSITION,
        repeatType: 'mirror' as const,
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    },
  };

  const getBlurClass = (blur: string) => {
    const presets = {
      soft: 'blur',
      medium: 'blur-md',
      strong: 'blur-lg',
    };
    return presets[blur as keyof typeof presets];
  };

  return (
    <motion.div
      style={
        {
          '--scale': scale,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        } as React.CSSProperties
      }
      animate={animations[mode]}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        'scale-[var(--scale)] transform-gpu',
        getBlurClass(blur),
        className
      )}
    />
  );
};

interface ThemeConfig {
  name: string;
  background: string;
  particles: string;
  accent: string;
  glow: string[];
  icon: React.ReactNode;
}

const themes: ThemeConfig[] = [
  {
    name: "Nightie Stars",
    background: "from-slate-900 via-purple-900 to-slate-900",
    particles: "#8B5CF6",
    accent: "text-purple-300",
    glow: ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9'],
    icon: <Star className="h-4 w-4" />
  },
  {
    name: "Daytime Clouds",
    background: "from-blue-100 via-white to-blue-100",
    particles: "#60A5FA",
    accent: "text-blue-600",
    glow: ['#60A5FA', '#3B82F6', '#1D4ED8', '#1E40AF'],
    icon: <Cloud className="h-4 w-4" />
  },
  {
    name: "Purple Haze",
    background: "from-purple-900 via-pink-900 to-indigo-900",
    particles: "#EC4899",
    accent: "text-pink-300",
    glow: ['#EC4899', '#F472B6', '#A855F7', '#8B5CF6'],
    icon: <Moon className="h-4 w-4" />
  }
];

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TimelineStep {
  id: string;
  text: string;
  status: 'pending' | 'running' | 'completed';
  timestamp: Date;
  duration?: number;
}

interface TaskStep {
  id: string;
  text: string;
  status: 'pending' | 'running' | 'completed';
  expanded?: boolean;
  subSteps?: string[];
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

interface ScoutUI4Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

const MumaBearWorkspace: React.FC<ScoutUI4Props> = ({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme: systemTheme = 'system',
  className = ''
}) => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [taskSteps, setTaskSteps] = useState<TaskStep[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
  const [workspaceCollapsed, setWorkspaceCollapsed] = useState(false);
  const [chatWidth, setChatWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);

  const themeConfig = themes[currentTheme];

    const files: FileItem[] = [
    {
      name: "seo-calculator",
      type: "folder",
      children: [
        { name: "index.html", type: "file" },
        { name: "styles.css", type: "file" },
        { name: "script.js", type: "file" },
        {
          name: "images",
          type: "folder",
          children: [
            { name: "favicon.png", type: "file" },
            { name: "logo.png", type: "file" },
            { name: "profile.jpg", type: "file" }
          ]
        }
      ]
    }
  ];

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setChatWidth(Math.max(20, Math.min(80, newWidth)));
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle file upload logic
      console.log('Files uploaded:', files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      // Handle dropped files
      console.log('Files dropped:', files);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          // Handle pasted image
          console.log('Image pasted:', blob);
        }
      }
    }
  };

    const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsWorking(true);
    setShowWorkspace(true);
    
    const steps: TaskStep[] = [
      { id: '1', text: 'Analyzing your request...', status: 'running' },
      { id: '2', text: 'Researching Nathan and starting website development', status: 'pending' },
      { id: '3', text: 'Found 7 sources', status: 'pending', subSteps: ['LinkedIn Profile', 'YouTube Channel', 'Personal Website', 'Facebook Page'] },
      { id: '4', text: 'Downloading media and assets', status: 'pending' },
      { id: '5', text: 'Generating HTML structure', status: 'pending' },
      { id: '6', text: 'Creating interactive SEO calculator', status: 'pending' },
      { id: '7', text: 'Styling with modern CSS', status: 'pending' },
      { id: '8', text: 'Integrating external links and media', status: 'pending' }
    ];

    setTaskSteps(steps);

    const timelineSteps: TimelineStep[] = steps.map(step => ({
      id: step.id,
      text: step.text,
      status: step.status,
      timestamp: new Date()
    }));
    setTimelineSteps(timelineSteps);

    // Add initial chat message
    setChatMessages([{
      id: '1',
      type: 'assistant',
      content: `Starting work on: ${prompt}`,
      timestamp: new Date()
    }]);

    // Simulate step progression
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTaskSteps(prev => prev.map((step, index) => {
        if (index === i) return { ...step, status: 'completed' };
        if (index === i + 1) return { ...step, status: 'running' };
        return step;
      }));
      
      setTimelineSteps(prev => prev.map((step, index) => {
        if (index === i) return { ...step, status: 'completed', duration: 1500 };
        if (index === i + 1) return { ...step, status: 'running' };
        return step;
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsWorking(false);
  };

  const toggleStepExpansion = (stepId: string) => {
    setTaskSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, expanded: !step.expanded } : step
    ));
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ marginLeft: `${depth * 16}px` }}>
        <div 
          className={cn(
            "flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-muted/50",
            selectedFile === item.name && "bg-muted"
          )}
          onClick={() => item.type === 'file' && setSelectedFile(item.name)}
        >
          <span className="text-xs">
            {item.type === 'folder' ? '📁' : '📄'}
          </span>
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className={cn("min-h-screen relative overflow-hidden bg-gradient-to-br", themeConfig.background)}>
      {/* Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={60}
        color={themeConfig.particles}
        size={0.6}
      />

      {/* Glow Effects */}
      <div className="absolute inset-0 opacity-30">
        <GlowEffect
          colors={themeConfig.glow}
          mode="rotate"
          blur="strong"
          duration={8}
        />
      </div>

      {/* Theme Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex gap-2 bg-background/80 backdrop-blur-sm rounded-full p-2 border border-border/50">
          {themes.map((t, index) => (
            <Button
              key={index}
              variant={currentTheme === index ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTheme(index)}
              className="rounded-full"
            >
              {t.icon}
            </Button>
          ))}
        </div>
      </div>

      {!showWorkspace ? (
        /* Landing Page */
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
                        <h1 className={cn("text-6xl md:text-8xl font-bold mb-6", themeConfig.accent)}>
              Hey Nathan,
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Got work? Let's jam!
            </h2>
            
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <GlowEffect
                  colors={themeConfig.glow}
                  mode="pulse"
                  blur="medium"
                  className="rounded-2xl"
                />
                <div className="relative bg-background/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Zap className={cn("h-5 w-5", themeConfig.accent)} />
                    <span className={cn("font-semibold", themeConfig.accent)}>Fast AF</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1" />
                    <Button size="sm" className="rounded-full">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </div>
                  
                                    <div className="relative">
                    <Input
                      placeholder="Let Muma-Bear do it for you"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="text-lg py-6 bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground/70 pr-32"
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      onDrop={handleDrop}
                      onPaste={handlePaste}
                      onDragOver={(e) => e.preventDefault()}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn("h-8 w-8 p-0", isRecording && "bg-red-500/20 text-red-500")}
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn("h-8 w-8 p-0", isVideoRecording && "bg-red-500/20 text-red-500")}
                        onClick={() => setIsVideoRecording(!isVideoRecording)}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <label>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                          <span>
                            <Upload className="h-4 w-4" />
                          </span>
                        </Button>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { icon: Search, label: "Research" },
                { icon: FileText, label: "Create" },
                { icon: Lightbulb, label: "Plan" },
                { icon: BarChart3, label: "Analyze" },
                { icon: GraduationCap, label: "Learn" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-16 flex flex-col gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70"
                    onClick={handleSubmit}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>

                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              Muma-Bear Alpha - Experiencing high demand
            </Badge>
          </motion.div>
        </div>
      ) : (
        /* Workspace */
        <div className="relative z-10 min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="relative">
                <GlowEffect
                  colors={themeConfig.glow}
                  mode="pulse"
                  blur="medium"
                  className="rounded-xl"
                />
                <div className="relative bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 p-4">
                  <div className="flex items-center gap-4">
                    <Zap className={cn("h-5 w-5", themeConfig.accent)} />
                                        <div className="relative flex-1">
                      <Input
                        placeholder="Let Muma-Bear do it for you"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-transparent border-0 focus-visible:ring-0 pr-32"
                        onDrop={handleDrop}
                        onPaste={handlePaste}
                        onDragOver={(e) => e.preventDefault()}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn("h-6 w-6 p-0", isRecording && "bg-red-500/20 text-red-500")}
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn("h-6 w-6 p-0", isVideoRecording && "bg-red-500/20 text-red-500")}
                          onClick={() => setIsVideoRecording(!isVideoRecording)}
                        >
                          <Video className="h-3 w-3" />
                        </Button>
                        <label>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                            <span>
                              <Upload className="h-3 w-3" />
                            </span>
                          </Button>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </div>
                </div>
              </div>
            </div>

                        {/* Workspace Toggle Button */}
            {!workspaceCollapsed && (
              <div className="fixed bottom-6 right-6 z-50">
                <Button
                  onClick={() => setWorkspaceCollapsed(true)}
                  className="rounded-full h-12 w-12 p-0"
                  variant="outline"
                >
                  <Monitor className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Split Workspace */}
            <div className={cn(
              "h-[calc(100vh-200px)] flex transition-all duration-300",
              workspaceCollapsed && "hidden"
            )}>
              {/* Chat Pane */}
              <div 
                className="relative bg-background/90 backdrop-blur-sm border border-border/50 rounded-l-xl overflow-hidden"
                style={{ width: `${chatWidth}%` }}
              >
                <GlowEffect
                  colors={themeConfig.glow}
                  mode="static"
                  blur="soft"
                  className="rounded-l-xl"
                />
                <div className="relative h-full p-6">
                  <div className="h-full flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Muma-Bear's Workflow</h3>
                        <p className="text-sm text-muted-foreground">
                          {prompt || "Build an SEO calculator website for Nathan"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setWorkspaceCollapsed(true)}
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                        <TabsTrigger value="workflow">Workflow</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "p-3 rounded-lg max-w-[80%]",
                                message.type === 'user' 
                                  ? "bg-primary text-primary-foreground ml-auto" 
                                  : "bg-muted"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="relative">
                          <Input
                            placeholder="Chat with Muma-Bear..."
                            className="pr-10"
                          />
                          <Button size="sm" className="absolute right-1 top-1 h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="workflow" className="flex-1 overflow-y-auto mt-4">
                        <div className="space-y-3">
                          {taskSteps.map((step) => (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="relative"
                            >
                              <div 
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                                  step.status === 'completed' && "bg-green-500/10 border-green-500/30",
                                  step.status === 'running' && "bg-blue-500/10 border-blue-500/30",
                                  step.status === 'pending' && "bg-muted/50 border-border/50"
                                )}
                                onClick={() => step.subSteps && toggleStepExpansion(step.id)}
                              >
                                {step.status === 'running' && (
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                )}
                                {step.status === 'completed' && (
                                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                  </div>
                                )}
                                {step.status === 'pending' && (
                                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50" />
                                )}
                                
                                <span className="flex-1 text-sm">{step.text}</span>
                                
                                {step.subSteps && (
                                  <ChevronDown className={cn(
                                    "h-4 w-4 transition-transform",
                                    step.expanded && "rotate-180"
                                  )} />
                                )}
                              </div>
                              
                              {step.subSteps && step.expanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="ml-7 mt-2 space-y-1"
                                >
                                  {step.subSteps.map((subStep, index) => (
                                    <div key={index} className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                                      {subStep}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                          
                          {!isWorking && taskSteps.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
                            >
                              <TextShimmer className="text-green-400 font-semibold">
                                Muma-Bear is done with the task!
                              </TextShimmer>
                            </motion.div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="timeline" className="flex-1 overflow-y-auto mt-4">
                        <div className="space-y-2">
                          {timelineSteps.map((step) => (
                            <div
                              key={step.id}
                              className={cn(
                                "p-3 rounded-lg border text-sm",
                                step.status === 'completed' && "bg-green-500/10 border-green-500/30",
                                step.status === 'running' && "bg-blue-500/10 border-blue-500/30",
                                step.status === 'pending' && "bg-muted/50 border-border/50"
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{step.text}</span>
                                <span className="text-xs text-muted-foreground">
                                  {step.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              {step.duration && (
                                <div className="text-xs text-muted-foreground">
                                  Duration: {step.duration}ms
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Resize Handle */}
              <div
                className="w-1 bg-border/50 hover:bg-border cursor-col-resize flex items-center justify-center group"
                onMouseDown={handleDragStart}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>

              {/* Workspace Pane */}
              <div 
                className="relative bg-background/90 backdrop-blur-sm border border-border/50 rounded-r-xl overflow-hidden"
                style={{ width: `${100 - chatWidth}%` }}
              >
                <GlowEffect
                  colors={themeConfig.glow}
                  mode="static"
                  blur="soft"
                  className="rounded-r-xl"
                />
                <div className="relative h-full">
                  <Tabs defaultValue="preview" className="h-full flex flex-col">
                    <div className="p-4 border-b border-border/50">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="preview">Live Preview</TabsTrigger>
                        <TabsTrigger value="files">Files</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="preview" className="flex-1 p-4">
                      <div className="h-full bg-white rounded-lg border border-border/50 p-6">
                        <div className="text-center">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            SEO ROI Calculator
                          </h1>
                          <p className="text-gray-600 mb-8">
                            Calculate your SEO investment returns with Nathan
                          </p>
                          
                          <div className="max-w-md mx-auto space-y-4">
                            <Input placeholder="Monthly SEO Budget ($)" />
                            <Input placeholder="Current Monthly Revenue ($)" />
                            <Input placeholder="Target Growth (%)" />
                            <Button className="w-full">Calculate ROI</Button>
                          </div>
                          
                          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">About Nathan</h3>
                            <p className="text-sm text-gray-600">
                              SEO Expert & Digital Marketing Consultant
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download all
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in new tab
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="files" className="flex-1 p-4">
                      <div className="h-full">
                        <h3 className="font-semibold mb-4">Project Files</h3>
                        <div className="space-y-1">
                          {renderFileTree(files)}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code" className="flex-1 p-4">
                      <div className="h-full bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-auto">
                        <div className="mb-2 text-gray-500">// index.html</div>
                        <div>&lt;!DOCTYPE html&gt;</div>
                        <div>&lt;html lang="en"&gt;</div>
                        <div>&nbsp;&nbsp;&lt;head&gt;</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;SEO Calculator - Nathan&lt;/title&gt;</div>
                        <div>&nbsp;&nbsp;&lt;/head&gt;</div>
                        <div>&nbsp;&nbsp;&lt;body&gt;</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;SEO ROI Calculator&lt;/h1&gt;</div>
                        <div>&nbsp;&nbsp;&lt;/body&gt;</div>
                        <div>&lt;/html&gt;</div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Collapsed Chat View */}
            {workspaceCollapsed && (
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="relative">
                  <GlowEffect
                    colors={themeConfig.glow}
                    mode="pulse"
                    blur="medium"
                    className="rounded-t-xl"
                  />
                  <div className="relative bg-background/95 backdrop-blur-sm border-t border-l border-r border-border/50 rounded-t-xl p-4 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Muma-Bear</h3>
                        <div className="flex gap-1">
                          {taskSteps.filter(s => s.status === 'running').length > 0 && (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {taskSteps.filter(s => s.status === 'completed').length}/{taskSteps.length} completed
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setWorkspaceCollapsed(false)}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {taskSteps.slice(-3).map((step) => (
                        <div
                          key={step.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm whitespace-nowrap",
                            step.status === 'completed' && "bg-green-500/10 border-green-500/30",
                            step.status === 'running' && "bg-blue-500/10 border-blue-500/30",
                            step.status === 'pending' && "bg-muted/50 border-border/50"
                          )}
                        >
                          {step.status === 'running' && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          {step.status === 'completed' && (
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                          )}
                          {step.status === 'pending' && (
                            <div className="h-3 w-3 rounded-full border border-muted-foreground/50" />
                          )}
                          <span>{step.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <Input
                        placeholder="Chat with Muma-Bear..."
                        className="pr-10"
                      />
                      <Button size="sm" className="absolute right-1 top-1 h-8 w-8 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MumaBearWorkspace;
export type { ScoutUI4Props };
