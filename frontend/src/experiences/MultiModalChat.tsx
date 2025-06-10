import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Mic, Video, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'

const modelCategories = [
  {
    name: 'Gemini 2.5',
    models: [
      { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash' },
    ]
  },
  {
    name: 'Gemini 2.0',
    models: [
      { id: 'gemini-2.0-pro-exp', name: 'Gemini 2.0 Pro' },
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
    ]
  },
  {
    name: 'Gemini 1.5',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    ]
  },
  {
    name: 'Claude',
    models: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    ]
  }
]

const MultiModalChat = () => {
  const { effectLevel } = useSanctuaryStore()
  const [selectedModel, setSelectedModel] = useState(modelCategories[0].models[0].id)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    // Add message sending logic here
    setInput('')
  }

  return (
    <div className="p-8 h-full flex gap-8">
      {/* Model Selection */}
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Select a Model</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            {modelCategories.map(category => (
              <div key={category.name} className="mb-4">
                <h3 className="font-semibold mb-2">{category.name}</h3>
                {category.models.map(model => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start mb-1"
                    onClick={() => setSelectedModel(model.id)}
                  >
                    {model.name}
                  </Button>
                ))}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="w-3/4 flex flex-col">
        <CardHeader>
          <CardTitle>Multi-Modal Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow bg-muted rounded-lg p-4">
            {/* Chat messages will go here */}
          </ScrollArea>
          <div className="mt-4">
            <div className="relative">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message or drop a file..."
                className="pr-24"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <Button variant="ghost" size="icon"><Paperclip className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Mic className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><ImageIcon className="w-4 h-4" /></Button>
                <Button onClick={sendMessage}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MultiModalChat
