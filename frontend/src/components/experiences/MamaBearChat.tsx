import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Sparkles, Heart, Star, Zap, 
  Settings, MoreVertical, FileText, Image, Code, 
  Download, Copy, ExternalLink, Mic, MicOff, 
  Volume2, VolumeX, RefreshCw, Trash2, Search,
  Bot, User, Crown, Shield, Wand2, Coffee, Moon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendMessage, clearChat, updateChatSettings } from '../../store/slices/chatSlice';

interface MamaBearVariant {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  personality: string;
  capabilities: string[];
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mama-bear';
  timestamp: Date;
  variant?: string;
  attachments?: Array<{
    type: 'file' | 'image' | 'code';
    name: string;
    url: string;
  }>;
  reactions?: Array<{
    emoji: string;
    count: number;
  }>;
}

const mamaBearVariants: MamaBearVariant[] = [
  {
    id: 'sanctuary',
    name: 'Sanctuary Guide',
    icon: <Heart className="w-4 h-4" />,
    description: 'Compassionate, nurturing, and understanding',
    color: 'bg-pink-500',
    personality: 'Warm and empathetic, perfect for emotional support',
    capabilities: ['Emotional Support', 'Gentle Guidance', 'Comfort & Care']
  },
  {
    id: 'scholar',
    name: 'Scholar',
    icon: <Star className="w-4 h-4" />,
    description: 'Brilliant researcher and knowledge synthesizer',
    color: 'bg-blue-500',
    personality: 'Intellectual and thorough, loves deep conversations',
    capabilities: ['Research', 'Analysis', 'Knowledge Synthesis']
  },
  {
    id: 'creator',
    name: 'Creator',
    icon: <Wand2 className="w-4 h-4" />,
    description: 'Innovative artist and creative problem solver',
    color: 'bg-purple-500',
    personality: 'Imaginative and inspiring, thinks outside the box',
    capabilities: ['Creative Writing', 'Art Direction', 'Innovation']
  },
  {
    id: 'guardian',
    name: 'Guardian',
    icon: <Shield className="w-4 h-4" />,
    description: 'Protective and security-focused',
    color: 'bg-green-500',
    personality: 'Vigilant and protective, ensures safety first',
    capabilities: ['Security Analysis', 'Risk Assessment', 'Protection']
  },
  {
    id: 'sage',
    name: 'Sage',
    icon: <Crown className="w-4 h-4" />,
    description: 'Wise counselor with deep insights',
    color: 'bg-yellow-500',
    personality: 'Ancient wisdom meets modern understanding',
    capabilities: ['Life Guidance', 'Philosophy', 'Strategic Thinking']
  },
  {
    id: 'companion',
    name: 'Companion',
    icon: <Coffee className="w-4 h-4" />,
    description: 'Friendly conversationalist and daily helper',
    color: 'bg-orange-500',
    personality: 'Cheerful and supportive, like a best friend',
    capabilities: ['Daily Planning', 'Casual Chat', 'Motivation']
  },
  {
    id: 'dreamer',
    name: 'Dreamer',
    icon: <Moon className="w-4 h-4" />,
    description: 'Intuitive and spiritually connected',
    color: 'bg-indigo-500',
    personality: 'Mystical and intuitive, connects to deeper meanings',
    capabilities: ['Dream Analysis', 'Intuition', 'Spiritual Guidance']
  }
];

export default function MamaBearChat() {
  const dispatch = useAppDispatch();
  // Mock chat state since we don't have the full store setup yet
  const messages: Message[] = [];
  const loading = false;
  const currentVariant = 'sanctuary';
  const settings = {};
  const { currentTheme } = useAppSelector(state => state.ui);
  
  const [input, setInput] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<MamaBearVariant>(mamaBearVariants[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    dispatch(sendMessage({
      content: input,
      variant: selectedVariant.id
    }));
    
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="flex h-full bg-gradient-to-br from-sanctuary-bg via-sanctuary-surface to-sanctuary-accent/10">
        {/* Variant Selector Sidebar */}
        <div className="w-80 border-r border-sanctuary-border bg-sanctuary-surface/50 backdrop-blur-sm">
          <div className="p-4 border-b border-sanctuary-border">
            <h2 className="text-lg font-semibold text-sanctuary-text mb-2">Mama Bear Variants</h2>
            <p className="text-sm text-sanctuary-text/70">Choose your perfect AI companion</p>
          </div>
          
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {mamaBearVariants.map((variant) => (
                <motion.div
                  key={variant.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      selectedVariant.id === variant.id 
                        ? "ring-2 ring-sanctuary-primary bg-sanctuary-primary/10" 
                        : "hover:bg-sanctuary-surface/70"
                    )}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full text-white", variant.color)}>
                          {variant.icon}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{variant.name}</CardTitle>
                          <p className="text-xs text-sanctuary-text/60">{variant.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-sanctuary-text/70 mb-2">{variant.personality}</p>
                      <div className="flex flex-wrap gap-1">
                        {variant.capabilities.map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-sanctuary-border bg-sanctuary-surface/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full text-white", selectedVariant.color)}>
                  {selectedVariant.icon}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-sanctuary-text">
                    {selectedVariant.name}
                  </h1>
                  <p className="text-sm text-sanctuary-text/70">
                    {selectedVariant.description}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini 2.5
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sanctuary-text/40 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-sanctuary-surface border border-sanctuary-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sanctuary-primary"
                  />
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chat Settings</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => dispatch(clearChat())}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Chat</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "flex gap-3",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'mama-bear' && (
                      <div className={cn("p-2 rounded-full text-white flex-shrink-0", selectedVariant.color)}>
                        {selectedVariant.icon}
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[70%] rounded-lg p-4",
                      message.sender === 'user' 
                        ? "bg-sanctuary-primary text-white" 
                        : "bg-sanctuary-surface border border-sanctuary-border"
                    )}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              {attachment.type === 'file' && <FileText className="w-4 h-4" />}
                              {attachment.type === 'image' && <Image className="w-4 h-4" />}
                              {attachment.type === 'code' && <Code className="w-4 h-4" />}
                              <span>{attachment.name}</span>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-60">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Copy className="w-3 h-3" />
                          </Button>
                          {message.reactions && message.reactions.map((reaction, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {reaction.emoji} {reaction.count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="p-2 rounded-full bg-sanctuary-primary text-white flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn("p-2 rounded-full text-white", selectedVariant.color)}>
                    {selectedVariant.icon}
                  </div>
                  <div className="bg-sanctuary-surface border border-sanctuary-border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sanctuary-text/70">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      <span className="text-sm">Mama Bear is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-sanctuary-border bg-sanctuary-surface/50 backdrop-blur-sm">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Chat with ${selectedVariant.name}...`}
                  className="w-full p-3 bg-sanctuary-bg border border-sanctuary-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sanctuary-primary text-sanctuary-text placeholder-sanctuary-text/50"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isRecording ? "destructive" : "ghost"}
                      size="sm"
                      onClick={toggleRecording}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </TooltipContent>
                </Tooltip>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="bg-sanctuary-primary hover:bg-sanctuary-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
