import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '@/store/store'
import { 
  toggleChatWidget, 
  toggleChatWidgetExpanded, 
  setChatWidgetPosition 
} from '@/store/slices/uiSlice'
import { 
  addMessage, 
  setMamaBearVariant, 
  setIsTyping 
} from '@/store/slices/chatSlice'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// UI Components
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'

// Icons
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Paperclip, 
  Mic, 
  Settings,
  Sparkles,
  ChevronDown,
  User,
  Bot,
  Move,
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  variant?: string
}

export function ExpandableChatWidget() {
  const dispatch = useDispatch()
  const { 
    chatWidgetOpen, 
    chatWidgetExpanded, 
    chatWidgetPosition 
  } = useSelector((state: RootState) => state.ui)
  const { 
    mamaBearVariant, 
    isTyping 
  } = useSelector((state: RootState) => state.chat)
  const { theme, neurodivergentMode, reducedMotion } = useTheme()
  
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m Mama Bear, your AI assistant. I\'m here to help you with anything you need across all your experiences. How can I assist you today?',
      timestamp: new Date(),
      variant: 'default',
    }
  ])
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const chatRef = useRef<HTMLDivElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when widget opens
  useEffect(() => {
    if (chatWidgetOpen && !chatWidgetExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [chatWidgetOpen, chatWidgetExpanded])

  const mamaBearVariants = [
    { id: 'default', name: 'Default', icon: '🐻', description: 'Balanced and helpful' },
    { id: 'creative', name: 'Creative', icon: '🎨', description: 'Imaginative and artistic' },
    { id: 'analytical', name: 'Analytical', icon: '📊', description: 'Data-driven and logical' },
    { id: 'coding', name: 'Coding', icon: '💻', description: 'Programming focused' },
    { id: 'research', name: 'Research', icon: '🔍', description: 'Deep research and analysis' },
    { id: 'planning', name: 'Planning', icon: '📋', description: 'Organization and strategy' },
    { id: 'emotional', name: 'Emotional', icon: '💝', description: 'Empathetic and supportive' },
  ]

  const currentVariant = mamaBearVariants.find(v => v.id === mamaBearVariant) || mamaBearVariants[0]

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    dispatch(setIsTyping(true))

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you said "${message}". As your ${currentVariant.name} assistant, I'm here to help! This is a demo response from the expandable chat widget.`,
        timestamp: new Date(),
        variant: mamaBearVariant,
      }
      
      setMessages(prev => [...prev, assistantMessage])
      dispatch(setIsTyping(false))
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleToggleOpen = () => {
    dispatch(toggleChatWidget())
  }

  const handleToggleExpanded = () => {
    dispatch(toggleChatWidgetExpanded())
  }

  const handleVariantChange = (variantId: string) => {
    dispatch(setMamaBearVariant(variantId as any))
  }

  // Position classes based on chatWidgetPosition
  const getPositionClasses = () => {
    switch (chatWidgetPosition) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      default:
        return 'bottom-4 right-4'
    }
  }

  // Widget size based on expanded state
  const getWidgetSize = () => {
    if (!chatWidgetOpen) return 'w-14 h-14'
    if (chatWidgetExpanded) return 'w-96 h-[32rem]'
    return 'w-80 h-96'
  }

  return (
    <motion.div
      ref={chatRef}
      initial={reducedMotion ? {} : { scale: 0, opacity: 0 }}
      animate={reducedMotion ? {} : { scale: 1, opacity: 1 }}
      transition={reducedMotion ? {} : { duration: 0.3 }}
      className={cn(
        "fixed z-50 transition-all duration-300",
        getPositionClasses(),
        getWidgetSize(),
        neurodivergentMode && "shadow-2xl"
      )}
    >
      {!chatWidgetOpen ? (
        // Collapsed Chat Button
        <Button
          onClick={handleToggleOpen}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            neurodivergentMode && "w-16 h-16"
          )}
        >
          <MessageCircle className={cn(
            "h-6 w-6",
            neurodivergentMode && "h-7 w-7"
          )} />
        </Button>
      ) : (
        // Expanded Chat Widget
        <motion.div
          layout
          className={cn(
            "bg-sanctuary-surface border border-sanctuary-border rounded-lg shadow-xl overflow-hidden",
            "flex flex-col h-full",
            neurodivergentMode && "border-2"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-sanctuary-border bg-muted/50">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-lg">{currentVariant.icon}</span>
                <div>
                  <h3 className={cn(
                    "font-medium text-sm",
                    neurodivergentMode && "text-base"
                  )}>
                    Mama Bear
                  </h3>
                  <p className={cn(
                    "text-xs text-muted-foreground",
                    neurodivergentMode && "text-sm"
                  )}>
                    {currentVariant.name}
                  </p>
                </div>
              </div>
              
              {/* Variant Selector */}
              <div className="relative group">
                <Button variant="ghost" size="sm" className="h-6 px-1">
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-popover border border-sanctuary-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2 space-y-1">
                    {mamaBearVariants.map(variant => (
                      <Button
                        key={variant.id}
                        variant={variant.id === mamaBearVariant ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleVariantChange(variant.id)}
                        className="w-full justify-start text-xs h-8"
                      >
                        <span className="mr-2">{variant.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{variant.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {variant.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpanded}
                className={cn(
                  "h-7 w-7 p-0",
                  neurodivergentMode && "h-8 w-8"
                )}
              >
                {chatWidgetExpanded ? 
                  <Minimize2 className="h-4 w-4" /> : 
                  <Maximize2 className="h-4 w-4" />
                }
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleOpen}
                className={cn(
                  "h-7 w-7 p-0",
                  neurodivergentMode && "h-8 w-8"
                )}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start space-x-2",
                    msg.role === 'user' && "flex-row-reverse space-x-reverse"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    {msg.role === 'user' ? 
                      <User className="h-4 w-4" /> : 
                      <Bot className="h-4 w-4" />
                    }
                  </div>
                  
                  <div className={cn(
                    "max-w-[80%] p-2 rounded-lg",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                    neurodivergentMode && "p-3"
                  )}>
                    <p className={cn(
                      "text-sm",
                      neurodivergentMode && "text-base leading-relaxed"
                    )}>
                      {msg.content}
                    </p>
                    <p className={cn(
                      "text-xs mt-1 opacity-70",
                      neurodivergentMode && "text-sm"
                    )}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted p-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-sanctuary-border">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${currentVariant.name}...`}
                  className={cn(
                    "w-full px-3 py-2 pr-20 bg-sanctuary-bg border border-sanctuary-border rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "placeholder:text-muted-foreground",
                    neurodivergentMode && "py-3 text-base"
                  )}
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Paperclip className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Mic className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="sm"
                className={cn(
                  "px-3",
                  neurodivergentMode && "px-4 py-3"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
