// Core types used throughout the application

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  model?: string
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  model: string
}

export interface ScoutModel {
  id: string
  name: string
  description: string
  status: 'active' | 'idle' | 'processing' | 'error'
  metrics: {
    tasksCompleted: number
    successRate: number
    avgResponseTime: number
  }
  lastActivity: number
}

export interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
  status: 'active' | 'training' | 'idle'
  performance: {
    tasks: number
    success: number
    learning: number
  }
  createdAt: number
}

export interface Workspace {
  id: string
  name: string
  description: string
  type: 'collaborative' | 'research' | 'development'
  members: string[]
  lastActivity: number
  status: 'active' | 'archived'
}

export interface SystemMetrics {
  cpu: number
  memory: number
  activeModels: number
  totalRequests: number
  responseTime: number
  timestamp: number
}

export interface LiveUpdate {
  id: string
  type: 'chat' | 'scout' | 'system' | 'agent' | 'workspace'
  data: any
  timestamp: number
}

export interface ThemeConfig {
  name: string
  displayName: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    dyslexiaFriendly: boolean
  }
}

export type Experience = 
  | 'home'
  | 'mama-bear-chat'
  | 'scout-orchestration'
  | 'agent-workbench'
  | 'collaborative-workspaces'
  | 'mcp-marketplace'
  | 'mini-apps'
  | 'cua-workbench'
  | 'research-library'
  | 'api-studio'
  | 'integration-workbench'
  | 'theme-customization'

export interface ExperienceConfig {
  id: Experience
  name: string
  description: string
  icon: string
  component: React.ComponentType
  requiresAuth?: boolean
  beta?: boolean
}
