import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define the base URL for the API
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    // Add auth headers if needed
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Chat',
    'Scout',
    'System',
    'Agent',
    'Workspace',
    'Integration',
    'Research',
  ],
  endpoints: (builder) => ({
    // Chat endpoints
    sendMessage: builder.mutation<ChatResponse, SendMessageRequest>({
      query: (data) => ({
        url: '/chat/send',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Chat'],
    }),
    
    getChatHistory: builder.query<ChatMessage[], { conversationId: string }>({
      query: ({ conversationId }) => `/chat/history/${conversationId}`,
      providesTags: ['Chat'],
    }),
    
    // Scout endpoints
    getScoutModels: builder.query<ScoutModel[], void>({
      query: () => '/scout/models',
      providesTags: ['Scout'],
    }),
    
    executeScoutTask: builder.mutation<ScoutTaskResponse, ScoutTaskRequest>({
      query: (data) => ({
        url: '/scout/execute',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Scout'],
    }),
    
    // System endpoints
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => '/system/health',
      providesTags: ['System'],
    }),
    
    getSystemMetrics: builder.query<SystemMetrics, void>({
      query: () => '/system/metrics',
      providesTags: ['System'],
    }),
    
    // Agent endpoints
    getAgentTemplates: builder.query<AgentTemplate[], void>({
      query: () => '/agents/templates',
      providesTags: ['Agent'],
    }),
    
    createAgent: builder.mutation<Agent, CreateAgentRequest>({
      query: (data) => ({
        url: '/agents/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Agent'],
    }),
    
    // Workspace endpoints
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => '/workspaces',
      providesTags: ['Workspace'],
    }),
    
    createWorkspace: builder.mutation<Workspace, CreateWorkspaceRequest>({
      query: (data) => ({
        url: '/workspaces/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Workspace'],
    }),
    
    // Integration endpoints
    getMCPTools: builder.query<MCPTool[], void>({
      query: () => '/integrations/mcp/tools',
      providesTags: ['Integration'],
    }),
    
    installMCPTool: builder.mutation<InstallResponse, { toolId: string }>({
      query: ({ toolId }) => ({
        url: `/integrations/mcp/install/${toolId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Integration'],
    }),
    
    // Research endpoints
    createResearchSession: builder.mutation<ResearchSession, CreateResearchRequest>({
      query: (data) => ({
        url: '/research/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Research'],
    }),
    
    getResearchSessions: builder.query<ResearchSession[], void>({
      query: () => '/research/sessions',
      providesTags: ['Research'],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useGetScoutModelsQuery,
  useExecuteScoutTaskMutation,
  useGetSystemHealthQuery,
  useGetSystemMetricsQuery,
  useGetAgentTemplatesQuery,
  useCreateAgentMutation,
  useGetWorkspacesQuery,
  useCreateWorkspaceMutation,
  useGetMCPToolsQuery,
  useInstallMCPToolMutation,
  useCreateResearchSessionMutation,
  useGetResearchSessionsQuery,
} = apiSlice

// Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  modelUsed?: string
  metadata?: Record<string, any>
}

export interface ChatResponse {
  message: ChatMessage
  conversationId: string
}

export interface SendMessageRequest {
  message: string
  conversationId?: string
  modelPreference?: string
  context?: Record<string, any>
}

export interface ScoutModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  status: 'active' | 'inactive' | 'busy'
  quota: {
    used: number
    limit: number
  }
}

export interface ScoutTaskRequest {
  task: string
  modelId: string
  context?: Record<string, any>
}

export interface ScoutTaskResponse {
  taskId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  error?: string
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  services: Record<string, 'up' | 'down'>
  uptime: number
  lastCheck: string
}

export interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: {
    incoming: number
    outgoing: number
  }
  activeConnections: number
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: string
  capabilities: string[]
  requiredInputs: string[]
  outputTypes: string[]
}

export interface Agent {
  id: string
  name: string
  description: string
  templateId: string
  config: Record<string, any>
  status: 'active' | 'inactive' | 'training'
  createdAt: string
  updatedAt: string
}

export interface CreateAgentRequest {
  name: string
  description: string
  templateId: string
  config: Record<string, any>
}

export interface Workspace {
  id: string
  name: string
  description: string
  type: 'collaborative' | 'individual' | 'research'
  participants: string[]
  tools: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateWorkspaceRequest {
  name: string
  description: string
  type: 'collaborative' | 'individual' | 'research'
  tools?: string[]
}

export interface MCPTool {
  id: string
  name: string
  description: string
  category: string
  author: string
  version: string
  rating: number
  downloads: number
  installed: boolean
}

export interface InstallResponse {
  success: boolean
  message: string
  toolId: string
}

export interface ResearchSession {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  participants: string[]
  sources: string[]
  findings: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateResearchRequest {
  title: string
  description: string
  participants?: string[]
}
