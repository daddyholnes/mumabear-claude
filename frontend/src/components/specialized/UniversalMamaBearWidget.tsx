import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const UniversalMamaBearWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm Mama Bear, your AI companion. I'm here to help with anything you need - from coding questions to creative projects. What would you like to work on together?",
    },
  ])
  const [input, setInput] = useState('')

  const toggleWidget = () => setIsOpen(!isOpen)

  const sendMessage = () => {
    if (!input.trim()) return
    // Add message sending logic here
    setInput('')
  }

  return (
    <>
      <motion.div
        className="fixed bottom-5 right-5 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <Button onClick={toggleWidget} className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700">
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-5 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="w-96 h-[60vh] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mama Bear</CardTitle>
                <Button variant="ghost" size="icon" onClick={toggleWidget}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex-grow overflow-y-auto">
                  {/* Chat messages will go here */}
                </div>
                <div className="mt-4 flex gap-2">
                  <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Mama Bear..." />
                  <Button onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default UniversalMamaBearWidget