import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Terminal, GitBranch, Cloud, Server, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { cn } from '@/lib/utils'

interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'scrapybara' | 'local' | 'cloud';
  status: 'running' | 'stopped' | 'pending';
}

const DevWorkspaces = () => {
  const { effectLevel } = useSanctuaryStore()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (!inputMessage.trim()) return
    // Add message sending logic here
    setInputMessage('')
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dev Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-500" />
              Plan Your Workspace with Mama Bear
            </CardTitle>
            <CardDescription>
              Describe the environment you need, and Mama Bear will help you set it up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg p-4 overflow-y-auto mb-4">
              {/* Chat messages will go here */}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="e.g., I need a Python environment with Flask and Scrapy..."
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Workspaces */}
        {workspaces.map(ws => (
          <Card key={ws.id}>
            <CardHeader>
              <CardTitle>{ws.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{ws.description}</p>
            </CardContent>
          </Card>
        ))}

        {/* Create New Workspace */}
        <motion.div
          whileHover={{ scale: effectLevel === 'full' ? 1.05 : 1 }}
          className="col-span-1"
        >
          <Card className="h-full flex items-center justify-center border-dashed border-2">
            <Button variant="ghost" className="text-lg">
              <Plus className="w-6 h-6 mr-2" />
              Create New Workspace
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default DevWorkspaces