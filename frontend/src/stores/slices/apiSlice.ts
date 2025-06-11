import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define types for our API responses
export interface MamaBearVariant {
  id: string
  name: string
  personality: string
  specialties: string[]
  preferredModels: string[]
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'error'
  modelCount: number
  activeModels: number
  responseTime: number
  uptime: number
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  variant?: string
  model?: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Conversation', 'SystemHealth', 'Models'],
  endpoints: (builder) => ({
    // Mama Bear Chat API
    sendChatMessage: builder.mutation<ChatMessage, { message: string; variantId?: string }>({
      query: ({ message, variantId }) => ({
        url: 'orchestra/mama-bear/chat',
        method: 'POST',
        body: { message, variant_id: variantId },
      }),
    }),

    // System Health API
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => 'orchestra/orchestra/status',
      providesTags: ['SystemHealth'],
    }),

    // Scout Models API
    getScoutModels: builder.query<any[], void>({
      query: () => 'scout/models',
      providesTags: ['Models'],
    }),

    // Execution Router API
    analyzeTask: builder.mutation<any, { task: string }>({
      query: ({ task }) => ({
        url: 'execution/analyze',
        method: 'POST',
        body: { task },
      }),
    }),

    routeExecution: builder.mutation<any, { taskId: string; environment?: string }>({
      query: ({ taskId, environment }) => ({
        url: 'execution/route',
        method: 'POST',
        body: { task_id: taskId, environment },
      }),
    }),

    // Agent Creation API
    getAgentTemplates: builder.query<any[], void>({
      query: () => 'agents/templates',
    }),

    createAgent: builder.mutation<any, { template: string; config: any }>({
      query: ({ template, config }) => ({
        url: 'agents/create',
        method: 'POST',
        body: { template, config },
      }),
    }),

    // Conversations API
    getConversations: builder.query<Conversation[], void>({
      query: () => 'chat/conversations',
      providesTags: ['Conversation'],
    }),

    createConversation: builder.mutation<Conversation, { title: string }>({
      query: ({ title }) => ({
        url: 'chat/conversations/create',
        method: 'POST',
        body: { title },
      }),
      invalidatesTags: ['Conversation'],
    }),

    // Multimodal API
    uploadFile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: 'multimodal/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})
