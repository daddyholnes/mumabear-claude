import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  files?: File[]
  images?: string[]
}

export interface MamaBearVariant {
  id: string
  name: string
  description: string
  personality: string
  capabilities: string[]
  avatar?: string
}

export interface ChatSession {
  id: string
  title: string
  variant: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface MCPTool {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: string
  rating: number
  downloads: number
  installed: boolean
  repository?: string
  documentation?: string
}

export interface ScrapybaraEnvironment {
  id: string
  name: string
  type: 'cloud' | 'local'
  status: 'running' | 'stopped' | 'creating'
  url?: string
  created_at: string
}

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

// Mama Bear Chat API
export const sendChatMessage = async (
  message: string,
  variant: string = 'general_helper',
  sessionId?: string,
  files?: File[]
) => {
  const formData = new FormData()
  formData.append('message', message)
  formData.append('variant', variant)
  if (sessionId) formData.append('session_id', sessionId)
  
  // Add files if provided
  if (files) {
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file)
    })
  }

  const response = await api.post('/mama-bear/chat', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Get available Mama Bear variants
export const getMamaBearVariants = async (): Promise<MamaBearVariant[]> => {
  const response = await api.get('/mama-bear/variants')
  return response.data.variants || []
}

// Get Mama Bear status
export const getMamaBearStatus = async () => {
  const response = await api.get('/mama-bear/status')
  return response.data
}

// Chat Sessions
export const getChatSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get('/mama-bear/sessions')
  return response.data.sessions || []
}

export const createChatSession = async (title: string, variant: string): Promise<ChatSession> => {
  const response = await api.post('/mama-bear/sessions', { title, variant })
  return response.data
}

export const deleteChatSession = async (sessionId: string) => {
  const response = await api.delete(`/mama-bear/sessions/${sessionId}`)
  return response.data
}

// MCP Marketplace API
export const getMCPTools = async (): Promise<MCPTool[]> => {
  const response = await api.get('/mcp/tools')
  return response.data.tools || []
}

export const installMCPTool = async (toolId: string) => {
  const response = await api.post(`/mcp/tools/${toolId}/install`)
  return response.data
}

export const uninstallMCPTool = async (toolId: string) => {
  const response = await api.post(`/mcp/tools/${toolId}/uninstall`)
  return response.data
}

export const searchMCPTools = async (query: string): Promise<MCPTool[]> => {
  const response = await api.get(`/mcp/tools/search?q=${encodeURIComponent(query)}`)
  return response.data.tools || []
}

// Scrapybara Integration
export const getScrapybaraEnvironments = async (): Promise<ScrapybaraEnvironment[]> => {
  const response = await api.get('/scrapybara/environments')
  return response.data.environments || []
}

export const createScrapybaraEnvironment = async (
  name: string,
  type: 'cloud' | 'local' = 'cloud'
): Promise<ScrapybaraEnvironment> => {
  const response = await api.post('/scrapybara/environments', { name, type })
  return response.data
}

export const deleteScrapybaraEnvironment = async (envId: string) => {
  const response = await api.delete(`/scrapybara/environments/${envId}`)
  return response.data
}

// CopyCopy API
export const copyCopyWebsite = async (url: string) => {
  const response = await api.post('/scrapybara/copycopy', { url })
  return response.data
}

export const analyzeCopyCopyResult = async (data: any) => {
  const response = await api.post('/scrapybara/copycopy/analyze', { data })
  return response.data
}

// Computer Use API
export const getCUAProviders = async () => {
  const response = await api.get('/computer-use/providers')
  return response.data.providers || []
}

export const executeComputerAction = async (
  action: string,
  parameters: any,
  provider: string = 'openai'
) => {
  const response = await api.post('/computer-use/execute', {
    action,
    parameters,
    provider,
  })
  return response.data
}

export const getComputerScreenshot = async () => {
  const response = await api.get('/computer-use/screenshot')
  return response.data
}

// Live API Studio (Gemini)
export const startGeminiLiveSession = async (model: string = 'gemini-2.0-flash-exp') => {
  const response = await api.post('/gemini/live/start', { model })
  return response.data
}

export const sendGeminiLiveMessage = async (
  sessionId: string,
  message: string,
  type: 'text' | 'audio' = 'text'
) => {
  const response = await api.post(`/gemini/live/${sessionId}/message`, {
    message,
    type,
  })
  return response.data
}

export const endGeminiLiveSession = async (sessionId: string) => {
  const response = await api.post(`/gemini/live/${sessionId}/end`)
  return response.data
}

// Multi-Model Chat
export const sendMultiModelMessage = async (
  message: string,
  models: string[] = ['gpt-4o', 'claude-3-5-sonnet', 'gemini-2.0-flash-exp'],
  files?: File[]
) => {
  const formData = new FormData()
  formData.append('message', message)
  formData.append('models', JSON.stringify(models))
  
  if (files) {
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file)
    })
  }

  const response = await api.post('/multi-model/chat', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Memory System
export const getMemoryEntries = async (userId: string = 'default') => {
  const response = await api.get(`/memory/entries?user_id=${userId}`)
  return response.data
}

export const searchMemory = async (query: string, userId: string = 'default') => {
  const response = await api.get(`/memory/search?q=${encodeURIComponent(query)}&user_id=${userId}`)
  return response.data
}

export const addMemoryEntry = async (
  content: string,
  metadata: any = {},
  userId: string = 'default'
) => {
  const response = await api.post('/memory/add', {
    content,
    metadata,
    user_id: userId,
  })
  return response.data
}

// WebSocket connection for real-time features
export const createWebSocketConnection = (onMessage?: (data: any) => void) => {
  const ws = new WebSocket(`ws://localhost:5001/ws`)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage?.(data)
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }
  
  return ws
}

export default api