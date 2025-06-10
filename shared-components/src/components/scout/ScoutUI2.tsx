"use client";

import React, { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Zap,
  Search,
  FileText,
  BarChart3,
  BookOpen,
  ArrowUpIcon,
  Paperclip,
  Command,
  SendIcon,
  LoaderIcon,
  Sparkles,
  Plus,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Image as ImageIcon,
  Code,
  Folder,
  Star,
  Moon,
  Sun,
  Cloud
} from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface ThemeConfig {
  name: string;
  background: string;
  accent: string;
  glow: string;
  particles: React.ReactNode;
}

interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed";
  expanded?: boolean;
  substeps?: string[];
}

interface GeneratedFile {
  name: string;
  type: "html" | "css" | "js" | "image" | "other";
  content?: string;
  size: string;
}

const themes: Record<string, ThemeConfig> = {
  nightStars: {
    name: "Nighty Stars",
    background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    accent: "from-purple-400 to-pink-400",
    glow: "shadow-purple-500/25",
    particles: <StarField />
  },
  daytimeClouds: {
    name: "Daytime Clouds",
    background: "bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500",
    accent: "from-blue-600 to-cyan-600",
    glow: "shadow-blue-500/25",
    particles: <CloudField />
  },
  purpleHaze: {
    name: "Purple Haze",
    background: "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600",
    accent: "from-fuchsia-400 to-violet-400",
    glow: "shadow-violet-500/25",
    particles: <HazeField />
  }
};

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function CloudField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/10 rounded-full blur-xl"
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${50 + Math.random() * 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [-20, 20, -20],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function HazeField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl"
          style={{
            width: `${200 + Math.random() * 300}px`,
            height: `${200 + Math.random() * 300}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-current rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function ScoutAIWorkspace() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("purpleHaze");
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [tasks, setTasks] = useState<TaskStep[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const theme = themes[currentTheme];

  const handleSubmit = () => {
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    setShowWorkspace(true);

    // Simulate Scout's workflow
    const mockTasks: TaskStep[] = [
      {
        id: "1",
        title: "Analyzing request",
        description: "Understanding your requirements and breaking down the task",
        status: "completed",
        substeps: ["Parsing natural language input", "Identifying key requirements", "Planning execution strategy"]
      },
      {
        id: "2",
        title: "Research phase",
        description: "Gathering information and resources",
        status: "completed",
        substeps: ["Searching for relevant data", "Analyzing best practices", "Collecting assets"]
      },
      {
        id: "3",
        title: "Code generation",
        description: "Creating HTML, CSS, and JavaScript files",
        status: "running",
        substeps: ["Generating HTML structure", "Writing responsive CSS", "Implementing interactive features"]
      },
      {
        id: "4",
        title: "Asset integration",
        description: "Processing and optimizing media files",
        status: "pending",
        substeps: ["Image optimization", "Icon generation", "Asset bundling"]
      },
      {
        id: "5",
        title: "Final assembly",
        description: "Combining all components into deployable package",
        status: "pending",
        substeps: ["File organization", "Dependency resolution", "Package creation"]
      }
    ];

    setTasks(mockTasks);

    // Simulate task progression
    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.id === "3" ? { ...task, status: "completed" } : task
      ));
      setTasks(prev => prev.map(task => 
        task.id === "4" ? { ...task, status: "running" } : task
      ));
    }, 2000);

    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.id === "4" ? { ...task, status: "completed" } : task
      ));
      setTasks(prev => prev.map(task => 
        task.id === "5" ? { ...task, status: "running" } : task
      ));
    }, 4000);

    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.id === "5" ? { ...task, status: "completed" } : task
      ));
      setIsProcessing(false);
      
      // Generate mock files
      const mockFiles: GeneratedFile[] = [
        { name: "index.html", type: "html", size: "4.2 KB", content: "<!DOCTYPE html>..." },
        { name: "styles.css", type: "css", size: "2.8 KB", content: "/* Modern CSS styles */" },
        { name: "script.js", type: "js", size: "1.5 KB", content: "// Interactive features" },
        { name: "logo.png", type: "image", size: "12 KB" },
        { name: "favicon.ico", type: "image", size: "4 KB" }
      ];
      setGeneratedFiles(mockFiles);
      setSelectedFile(mockFiles[0]);
    }, 6000);
  };

  const toggleTaskExpansion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, expanded: !task.expanded } : task
    ));
  };

  const getFileIcon = (type: GeneratedFile["type"]) => {
    switch (type) {
      case "html": return <Globe className="w-4 h-4" />;
      case "css": return <Sparkles className="w-4 h-4" />;
      case "js": return <Code className="w-4 h-4" />;
      case "image": return <ImageIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (showWorkspace) {
    return (
      <div className={cn("min-h-screen w-full relative overflow-hidden", theme.background)}>
        {theme.particles}
        
        <div className="relative z-10 h-screen flex">
          {/* Left Panel - Chat & Workflow */}
          <div className="w-1/2 border-r border-white/10 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Scout Workspace</h2>
                <div className="flex items-center gap-2">
                  {Object.entries(themes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentTheme(key as keyof typeof themes)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        currentTheme === key ? "border-white scale-110" : "border-white/30",
                        t.background
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-b border-white/10">
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                <div className="text-sm text-white/60 mb-2">Your request:</div>
                <div className="text-white">{inputValue}</div>
              </div>
            </div>

            {/* Task Progress */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Scout's Progress</h3>
                
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: parseInt(task.id) * 0.1 }}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            task.status === "completed" ? "bg-green-400" :
                            task.status === "running" ? "bg-yellow-400 animate-pulse" :
                            "bg-gray-400"
                          )} />
                          <div>
                            <div className="text-white font-medium">{task.title}</div>
                            <div className="text-white/60 text-sm">{task.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.status === "running" && <TypingDots />}
                          {task.substeps && (
                            task.expanded ? <ChevronUp className="w-4 h-4 text-white/60" /> : 
                            <ChevronDown className="w-4 h-4 text-white/60" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {task.expanded && task.substeps && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10"
                        >
                          <div className="p-4 space-y-2">
                            {task.substeps.map((substep, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                {substep}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {!isProcessing && tasks.every(t => t.status === "completed") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
                  >
                    <div className="text-green-400 font-medium mb-2">🎉 Scout is done with the task!</div>
                    <div className="text-white/70 text-sm">Your project is ready for download and deployment</div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - File Browser & Preview */}
          <div className="w-1/2 flex flex-col">
            {/* File Browser */}
            <div className="h-1/3 border-b border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Generated Files</h3>
              <div className="space-y-2">
                {generatedFiles.map((file) => (
                  <motion.div
                    key={file.name}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                      selectedFile?.name === file.name ? 
                        "bg-white/20 border border-white/20" : 
                        "bg-black/10 hover:bg-black/20 border border-transparent"
                    )}
                    onClick={() => setSelectedFile(file)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: generatedFiles.indexOf(file) * 0.1 }}
                  >
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{file.name}</div>
                      <div className="text-white/60 text-xs">{file.size}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Live Preview</h3>
                <ButtonGroup>
                  <Button variant="outline" size="sm" className="text-white border-white/20">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline" size="sm" className="text-white border-white/20">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </ButtonGroup>
              </div>

              <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 h-full p-6">
                {selectedFile ? (
                  <div className="h-full">
                    {selectedFile.type === "html" ? (
                      <div className="bg-white rounded-lg h-full p-8 overflow-auto">
                        <div className="text-center">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">SEO Calculator</h1>
                          <p className="text-gray-600 mb-8">Calculate your SEO ROI with our advanced tool</p>
                          
                          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Monthly Traffic
                                </label>
                                <input 
                                  type="number" 
                                  className="w-full p-3 border border-gray-300 rounded-lg"
                                  placeholder="10000"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Conversion Rate (%)
                                </label>
                                <input 
                                  type="number" 
                                  className="w-full p-3 border border-gray-300 rounded-lg"
                                  placeholder="2.5"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Average Order Value ($)
                                </label>
                                <input 
                                  type="number" 
                                  className="w-full p-3 border border-gray-300 rounded-lg"
                                  placeholder="100"
                                />
                              </div>
                              <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700">
                                Calculate ROI
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white/60 h-full flex items-center justify-center">
                        <div>
                          {getFileIcon(selectedFile.type)}
                          <div className="mt-2">{selectedFile.name}</div>
                          <div className="text-sm mt-1">{selectedFile.size}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/60">
                    Select a file to preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen w-full relative overflow-hidden", theme.background)}>
      {theme.particles}
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Theme Selector */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {Object.entries(themes).map(([key, t]) => (
            <motion.button
              key={key}
              onClick={() => setCurrentTheme(key as keyof typeof themes)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all relative overflow-hidden",
                currentTheme === key ? "border-white scale-110" : "border-white/30",
                t.background
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-80" />
              {key === "nightStars" && <Star className="w-4 h-4 text-white absolute inset-0 m-auto" />}
              {key === "daytimeClouds" && <Cloud className="w-4 h-4 text-white absolute inset-0 m-auto" />}
              {key === "purpleHaze" && <Sparkles className="w-4 h-4 text-white absolute inset-0 m-auto" />}
            </motion.button>
          ))}
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hey there! Got work?{" "}
                <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", `from-${theme.accent.split(' ')[1]} to-${theme.accent.split(' ')[3]}`)}>
                  Let's jam!
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your AI super agent for research, creation, planning, analysis, and learning
              </motion.p>
            </div>

            {/* Main Input */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-medium">Fast AF</span>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    + New
                  </Badge>
                </div>
                
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Let Scout do it for you..."
                  className="w-full bg-transparent border-none text-white placeholder:text-white/50 text-lg resize-none focus:ring-0"
                  style={{ minHeight: "60px" }}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                      <Command className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isProcessing}
                    className={cn(
                      "bg-gradient-to-r text-white font-medium",
                      theme.accent,
                      theme.glow
                    )}
                  >
                    {isProcessing ? (
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <SendIcon className="w-4 h-4 mr-2" />
                    )}
                    {isProcessing ? "Processing..." : "Send"}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: <Search className="w-5 h-5" />, label: "Research" },
                { icon: <FileText className="w-5 h-5" />, label: "Create" },
                { icon: <BarChart3 className="w-5 h-5" />, label: "Plan" },
                { icon: <BarChart3 className="w-5 h-5" />, label: "Analyze" },
                { icon: <BookOpen className="w-5 h-5" />, label: "Learn" }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  className="flex items-center gap-2 px-6 py-3 bg-black/20 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => setInputValue(action.label.toLowerCase() + " ")}
                >
                  {action.icon}
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Alpha Notice */}
            <motion.div
              className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-yellow-400 text-sm font-medium">
                ⚡ Scout Alpha - Experiencing high demand
              </div>
              <div className="text-white/70 text-xs mt-1">
                Join our Discord and X for updates
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface ScoutUI2Props {
  reducedMotion?: boolean
  neurodivergentMode?: boolean
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

export default function Demo({ 
  reducedMotion = false, 
  neurodivergentMode = false, 
  theme = 'system',
  className = ''
}: ScoutUI2Props) {
  return <ScoutAIWorkspace />;
}

export type { ScoutUI2Props };
