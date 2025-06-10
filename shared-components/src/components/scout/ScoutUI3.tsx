"use client";

import React, { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Zap,
  Search,
  PlusCircle,
  BarChart3,
  BookOpen,
  Sparkles,
  Command,
  Send,
  Paperclip,
  X,
  Loader,
  FileText,
  Code,
  Image as ImageIcon,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  Globe,
  Linkedin,
  Youtube,
  Facebook
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
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

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-purple-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  status: "pending" | "active" | "completed";
  details?: string[];
  links?: { url: string; type: string }[];
}

interface FileItem {
  name: string;
  type: "html" | "css" | "js" | "image" | "other";
  size: string;
}

interface ThemeConfig {
  name: string;
  background: string;
  accent: string;
  glow: string;
  text: string;
}

const themes: Record<string, ThemeConfig> = {
  nightie: {
    name: "Nightie Stars",
    background: "from-slate-900 via-purple-900 to-slate-900",
    accent: "from-purple-400 to-pink-400",
    glow: "bg-purple-500/20",
    text: "text-purple-100"
  },
  daytime: {
    name: "Daytime Clouds",
    background: "from-blue-100 via-white to-blue-50",
    accent: "from-blue-500 to-cyan-400",
    glow: "bg-blue-500/20",
    text: "text-blue-900"
  },
  purple: {
    name: "Purple Haze",
    background: "from-purple-900 via-fuchsia-900 to-indigo-900",
    accent: "from-fuchsia-400 to-purple-400",
    glow: "bg-fuchsia-500/20",
    text: "text-purple-100"
  }
};

export function ScoutAIWorkspace() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("purple");
    const [currentView, setCurrentView] = useState<"landing" | "workspace">("landing");
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const [workspaceTab, setWorkspaceTab] = useState<"files" | "preview" | "chat">("chat");
  const [chatWidth, setChatWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const theme = themes[currentTheme];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setChatWidth(Math.min(Math.max(newWidth, 20), 80));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const commandSuggestions: CommandSuggestion[] = [
    {
      icon: <Search className="w-4 h-4" />,
      label: "Research",
      description: "Research topics and gather information",
      prefix: "/research"
    },
    {
      icon: <PlusCircle className="w-4 h-4" />,
      label: "Create",
      description: "Create websites, apps, and content",
      prefix: "/create"
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: "Analyze",
      description: "Analyze data and provide insights",
      prefix: "/analyze"
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Learn",
      description: "Learn new concepts and skills",
      prefix: "/learn"
    }
  ];

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    setCurrentView("workspace");
    setIsProcessing(true);

    // Simulate workflow steps
    const steps: WorkflowStep[] = [
      {
        id: "1",
        title: "Researching Julian Goldie and starting website development",
        status: "active",
        details: ["Analyzing requirements", "Gathering information"]
      },
      {
        id: "2",
        title: "Found 7 sources",
        status: "pending",
        links: [
          { url: "https://linkedin.com/in/juliangoldieseo", type: "linkedin" },
          { url: "https://youtube.com/@juliangoldie", type: "youtube" },
          { url: "https://facebook.com/juliangoldie", type: "facebook" }
        ]
      },
      {
        id: "3",
        title: "Generating website structure and components",
        status: "pending"
      },
      {
        id: "4",
        title: "Creating interactive SEO calculator",
        status: "pending"
      },
      {
        id: "5",
        title: "Finalizing design and deployment",
        status: "pending"
      }
    ];

    setWorkflowSteps(steps);

    // Simulate step progression
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setWorkflowSteps(prev => 
        prev.map((step, index) => ({
          ...step,
          status: index < currentStep ? "completed" : index === currentStep ? "active" : "pending"
        }))
      );

      currentStep++;
      if (currentStep > steps.length) {
        clearInterval(progressInterval);
        setIsProcessing(false);
        
        // Generate mock files
        setGeneratedFiles([
          { name: "index.html", type: "html", size: "12.4 KB" },
          { name: "styles.css", type: "css", size: "8.2 KB" },
          { name: "script.js", type: "js", size: "5.1 KB" },
          { name: "julian_profile.jpg", type: "image", size: "156 KB" },
          { name: "logo.png", type: "image", size: "24 KB" }
        ]);
        setSelectedFile("index.html");
      }
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < commandSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : commandSuggestions.length - 1
        );
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setInputValue(selectedCommand.prefix + ' ');
          setShowCommandPalette(false);
        }
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (inputValue.startsWith('/') && !inputValue.includes(' ')) {
      setShowCommandPalette(true);
      const matchingIndex = commandSuggestions.findIndex(
        cmd => cmd.prefix.startsWith(inputValue)
      );
      setActiveSuggestion(matchingIndex >= 0 ? matchingIndex : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [inputValue]);

  const renderLandingPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className={cn("absolute top-20 left-1/4 w-96 h-96 rounded-full mix-blend-normal filter blur-[128px]", theme.glow)}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className={cn("absolute bottom-20 right-1/4 w-96 h-96 rounded-full mix-blend-normal filter blur-[128px]", theme.glow)}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className={cn("absolute top-1/3 right-1/3 w-64 h-64 rounded-full mix-blend-normal filter blur-[96px]", theme.glow)}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className={cn("absolute inset-0 bg-gradient-to-br", theme.background)} />

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap className={cn("w-8 h-8", theme.text)} />
            <h1 className={cn("text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", theme.accent)}>
              Scout.new
            </h1>
          </div>
          
          <h2 className={cn("text-2xl font-medium", theme.text)}>
            Hey there! Got work? Let's jam!
          </h2>
          
          <p className={cn("text-lg opacity-80", theme.text)}>
            Let Scout do it for you
          </p>
        </motion.div>

        {/* Main Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
            <div className="relative">
              <AnimatePresence>
                {showCommandPalette && (
                  <motion.div
                    className="absolute bottom-full mb-2 left-0 right-0 backdrop-blur-xl bg-black/90 rounded-lg border border-white/20 overflow-hidden z-50"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {commandSuggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.prefix}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                          activeSuggestion === index ? "bg-white/20" : "hover:bg-white/10"
                        )}
                        onClick={() => {
                          setInputValue(suggestion.prefix + ' ');
                          setShowCommandPalette(false);
                        }}
                      >
                        {suggestion.icon}
                        <div>
                          <div className="font-medium text-white">{suggestion.label}</div>
                          <div className="text-sm text-white/60">{suggestion.description}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Build an SEO calculator website for Julian Goldie..."
                className="w-full bg-transparent border-none text-white placeholder:text-white/50 text-lg resize-none focus-visible:ring-0"
                showRing={false}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Fast AF
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white"
                    onClick={() => setShowCommandPalette(!showCommandPalette)}
                  >
                    <Command className="w-4 h-4 mr-1" />
                    Commands
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "bg-gradient-to-r text-white font-medium",
                    theme.accent,
                    "hover:scale-105 transition-transform"
                  )}
                >
                  <Send className="w-4 h-4 mr-2" />
                  + New
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {commandSuggestions.map((cmd, index) => (
            <Button
              key={cmd.prefix}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                setInputValue(cmd.prefix + ' ');
                textareaRef.current?.focus();
              }}
            >
              {cmd.icon}
              {cmd.label}
            </Button>
          ))}
        </motion.div>

        {/* Theme Switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-2"
        >
          {Object.entries(themes).map(([key, themeConfig]) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentTheme(key as keyof typeof themes)}
              className={cn(
                "text-xs",
                currentTheme === key ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
              )}
            >
              {themeConfig.name}
            </Button>
          ))}
        </motion.div>

        {/* Alpha Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Scout Alpha - High demand. Join Discord for updates
          </Badge>
        </motion.div>
      </div>
    </div>
  );

    const renderChatView = () => (
    <>
      {/* Original Prompt */}
      <div className="p-4 border-b border-white/10">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-white/80 text-sm">{inputValue}</p>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {workflowSteps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {step.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : step.status === "active" ? (
                    <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 text-white/40" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn("font-medium", 
                    step.status === "completed" ? "text-green-300" :
                    step.status === "active" ? "text-purple-300" : "text-white/60"
                  )}>
                    {step.title}
                  </h3>
                  
                  {step.details && (
                    <div className="mt-2 space-y-1">
                      {step.details.map((detail, index) => (
                        <p key={index} className="text-sm text-white/60">• {detail}</p>
                      ))}
                    </div>
                  )}
                  
                  {step.links && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.links.map((link, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {link.type === "linkedin" && <Linkedin className="w-3 h-3 mr-1" />}
                          {link.type === "youtube" && <Youtube className="w-3 h-3 mr-1" />}
                          {link.type === "facebook" && <Facebook className="w-3 h-3 mr-1" />}
                          {link.url}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {!isProcessing && workflowSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Scout is done with the task!
            </Badge>
          </motion.div>
        )}
      </div>

      {/* New Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask for modifications or new tasks..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            rows={2}
          />
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  const renderFilesView = () => (
    <div className="flex h-full">
      {/* File Tree */}
      <div className="w-1/3 border-r border-white/10 p-4">
        <h3 className="font-medium text-white mb-3">Files</h3>
        <div className="space-y-2">
          {generatedFiles.map((file) => (
            <div
              key={file.name}
              className={cn(
                "flex items-center gap-3 p-2 rounded cursor-pointer transition-colors",
                selectedFile === file.name ? "bg-purple-500/20" : "hover:bg-white/5"
              )}
              onClick={() => setSelectedFile(file.name)}
            >
              {file.type === "html" && <FileText className="w-4 h-4 text-orange-400" />}
              {file.type === "css" && <Code className="w-4 h-4 text-blue-400" />}
              {file.type === "js" && <Code className="w-4 h-4 text-yellow-400" />}
              {file.type === "image" && <ImageIcon className="w-4 h-4 text-green-400" />}
              <div className="flex-1">
                <div className="text-white text-sm">{file.name}</div>
                <div className="text-white/40 text-xs">{file.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white">{selectedFile || "Select a file"}</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-white/20 text-white">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        
        <Card className="h-full bg-white/5 border-white/10 p-4">
          {selectedFile ? (
            <div className="h-full bg-gray-900 rounded border overflow-hidden">
              <div className="p-4 text-green-400 font-mono text-sm">
                {selectedFile === "index.html" && (
                  <pre>{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO ROI Calculator - Julian Goldie</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>SEO ROI Calculator</h1>
            <p>Calculate your SEO investment returns with Julian Goldie</p>
        </header>
        
        <main>
            <div class="calculator">
                <div class="input-group">
                    <label for="revenue">Monthly Revenue ($)</label>
                    <input type="number" id="revenue" placeholder="10000">
                </div>
                <div class="input-group">
                    <label for="investment">SEO Investment ($)</label>
                    <input type="number" id="investment" placeholder="2000">
                </div>
                <div class="input-group">
                    <label for="growth">Expected Growth (%)</label>
                    <input type="number" id="growth" placeholder="25">
                </div>
                <button onclick="calculateROI()">Calculate ROI</button>
            </div>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`}</pre>
                )}
                {selectedFile === "styles.css" && (
                  <pre>{`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
}

.calculator {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    max-width: 400px;
    margin: 0 auto;
}

.input-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #5a6fd8;
}`}</pre>
                )}
                {selectedFile === "script.js" && (
                  <pre>{`function calculateROI() {
    const revenue = parseFloat(document.getElementById('revenue').value);
    const investment = parseFloat(document.getElementById('investment').value);
    const growth = parseFloat(document.getElementById('growth').value);
    
    if (!revenue || !investment || !growth) {
        alert('Please fill in all fields');
        return;
    }
    
    const monthlyGrowth = (revenue * growth) / 100;
    const monthlyROI = ((monthlyGrowth - investment) / investment) * 100;
    const yearlyROI = monthlyROI * 12;
    
    const result = \`
        Monthly Growth: $\${monthlyGrowth.toFixed(2)}
        Monthly ROI: \${monthlyROI.toFixed(2)}%
        Yearly ROI: \${yearlyROI.toFixed(2)}%
    \`;
    
    alert(result);
}`}</pre>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/60">
              <div className="text-center">
                <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a file to view code</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  const renderPreviewView = () => (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white">Live Preview</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-white/20 text-white">
            <Download className="w-4 h-4 mr-1" />
            Download all
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white">
            <ExternalLink className="w-4 h-4 mr-1" />
            Open in new tab
          </Button>
        </div>
      </div>
      
      <Card className="h-full bg-white/5 border-white/10 p-4">
        <div className="h-full bg-white rounded border overflow-hidden">
          <div className="p-6 text-gray-900">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO ROI Calculator</h1>
              <p className="text-gray-600">Calculate your SEO investment returns with Julian Goldie</p>
            </div>
            
            <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Revenue ($)</label>
                  <input type="number" className="w-full p-2 border rounded" placeholder="10000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Investment ($)</label>
                  <input type="number" className="w-full p-2 border rounded" placeholder="2000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Growth (%)</label>
                  <input type="number" className="w-full p-2 border rounded" placeholder="25" />
                </div>
                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                  Calculate ROI
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderWorkspace = () => (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.background)}>
      <div className="flex h-screen">
        {/* Left Panel - Chat */}
        <div 
          className="border-r border-white/10 flex flex-col"
          style={{ width: `${chatWidth}%` }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("landing")}
                className="text-white/60 hover:text-white"
              >
                ← Back
              </Button>
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-white">Scout Workspace</span>
            </div>
          </div>

          {renderChatView()}
        </div>

        {/* Resizer */}
        <div 
          className="w-1 bg-white/10 hover:bg-white/20 cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Tabbed Views */}
        <div 
          className="flex flex-col"
          style={{ width: `${100 - chatWidth}%` }}
        >
          {/* Tab Header */}
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-1">
              <Button
                variant={workspaceTab === "files" ? "default" : "ghost"}
                size="sm"
                onClick={() => setWorkspaceTab("files")}
                className={cn(
                  "text-sm",
                  workspaceTab === "files" 
                    ? "bg-purple-600 text-white" 
                    : "text-white/60 hover:text-white"
                )}
              >
                <FileText className="w-4 h-4 mr-1" />
                Files
              </Button>
              <Button
                variant={workspaceTab === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setWorkspaceTab("preview")}
                className={cn(
                  "text-sm",
                  workspaceTab === "preview" 
                    ? "bg-purple-600 text-white" 
                    : "text-white/60 hover:text-white"
                )}
              >
                <Globe className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                variant={workspaceTab === "chat" ? "default" : "ghost"}
                size="sm"
                onClick={() => setWorkspaceTab("chat")}
                className={cn(
                  "text-sm",
                  workspaceTab === "chat" 
                    ? "bg-purple-600 text-white" 
                    : "text-white/60 hover:text-white"
                )}
              >
                <Send className="w-4 h-4 mr-1" />
                Chat
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {workspaceTab === "files" && renderFilesView()}
            {workspaceTab === "preview" && renderPreviewView()}
            {workspaceTab === "chat" && (
              <div className="flex flex-col h-full">
                {renderChatView()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return currentView === "landing" ? renderLandingPage() : renderWorkspace();
}

interface ScoutUI3Props {
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
}: ScoutUI3Props) {
  return <ScoutAIWorkspace />;
}

export type { ScoutUI3Props };
