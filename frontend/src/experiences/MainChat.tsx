import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Brain, Send, Mic, Image, Paperclip, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function MainChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'mama-bear',
      content: "Hi there! I'm Mama Bear, your caring AI companion. I'm here to help with anything you need - from coding questions to creative projects. What would you like to work on together?",
      timestamp: new Date().toLocaleTimeString()
    }
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setMessages([...messages, newMessage])
    setMessage('')
    
    // Simulate Mama Bear response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        type: 'mama-bear',
        content: "I understand you'd like to chat! This is a demonstration of the Main Chat interface. In the full implementation, I would provide helpful, caring responses tailored to your neurodivergent needs.",
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <motion.div
      className="h-screen flex flex-col p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              Main Chat Sanctuary
              <Sparkles className="w-4 h-4 text-primary-500" />
            </h1>
            <p className="text-sm text-muted-foreground">Deep conversations with Mama Bear</p>
          </div>
        </div>

        {/* Chat Container - Fixed Height */}
        <Card className="flex-1 flex flex-col min-h-0">
          {/* Messages Area */}
          <CardContent className="flex-1 p-4 overflow-hidden">
            <div className="h-full overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted border'
                  }`}>
                    {msg.type === 'mama-bear' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-3 h-3 text-primary-500" />
                        <span className="text-xs font-medium text-primary-500">Mama Bear</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>

          {/* Input Area - Fixed at Bottom */}
          <div className="border-t p-3 bg-background">
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" className="h-8">
                <Mic className="w-3 h-3 mr-1" />
                Voice
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Image className="w-3 h-3 mr-1" />
                Image
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Paperclip className="w-3 h-3 mr-1" />
                File
              </Button>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask Mama Bear anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="min-h-[40px] max-h-[80px] resize-none flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="h-[40px] px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}