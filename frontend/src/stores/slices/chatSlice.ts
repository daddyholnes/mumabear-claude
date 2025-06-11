import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  variant?: string
  model?: string
  attachments?: any[]
  reactions?: string[]
  replyTo?: string
  edited?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  participantCount: number
  tags: string[]
  pinned: boolean
  archived: boolean
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  currentVariant: string
  isTyping: boolean
  draft: string
  searchQuery: string
  filteredConversations: Conversation[]
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  currentVariant: 'scout-commander', // Default Mama Bear variant
  isTyping: false,
  draft: '',
  searchQuery: '',
  filteredConversations: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
      state.filteredConversations = action.payload
    },
    
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload
    },
    
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) => {
      const { conversationId, message } = action.payload
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation) {
        conversation.messages.push(message)
        conversation.updatedAt = new Date().toISOString()
      }
    },
    
    updateMessage: (state, action: PayloadAction<{ conversationId: string; messageId: string; updates: Partial<ChatMessage> }>) => {
      const { conversationId, messageId, updates } = action.payload
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation) {
        const message = conversation.messages.find(m => m.id === messageId)
        if (message) {
          Object.assign(message, updates)
        }
      }
    },
    
    createConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload)
      state.filteredConversations = state.conversations
      state.activeConversationId = action.payload.id
    },
    
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload)
      state.filteredConversations = state.conversations
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null
      }
    },
    
    setCurrentVariant: (state, action: PayloadAction<string>) => {
      state.currentVariant = action.payload
    },
    
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    
    setDraft: (state, action: PayloadAction<string>) => {
      state.draft = action.payload
      // Auto-save draft to localStorage
      if (state.activeConversationId) {
        localStorage.setItem(`draft-${state.activeConversationId}`, action.payload)
      }
    },
    
    loadDraft: (state, action: PayloadAction<string>) => {
      const savedDraft = localStorage.getItem(`draft-${action.payload}`)
      if (savedDraft) {
        state.draft = savedDraft
      } else {
        state.draft = ''
      }
    },
    
    clearDraft: (state) => {
      state.draft = ''
      if (state.activeConversationId) {
        localStorage.removeItem(`draft-${state.activeConversationId}`)
      }
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      
      if (action.payload.trim() === '') {
        state.filteredConversations = state.conversations
      } else {
        state.filteredConversations = state.conversations.filter(conversation =>
          conversation.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          conversation.messages.some(message =>
            message.content.toLowerCase().includes(action.payload.toLowerCase())
          )
        )
      }
    },
    
    togglePin: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c.id === action.payload)
      if (conversation) {
        conversation.pinned = !conversation.pinned
      }
    },
    
    toggleArchive: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c.id === action.payload)
      if (conversation) {
        conversation.archived = !conversation.archived
      }
    },
    
    addReaction: (state, action: PayloadAction<{ conversationId: string; messageId: string; reaction: string }>) => {
      const { conversationId, messageId, reaction } = action.payload
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation) {
        const message = conversation.messages.find(m => m.id === messageId)
        if (message) {
          if (!message.reactions) {
            message.reactions = []
          }
          if (!message.reactions.includes(reaction)) {
            message.reactions.push(reaction)
          }
        }
      }
    },
  },
})

export const {
  setConversations,
  setActiveConversation,
  addMessage,
  updateMessage,
  createConversation,
  deleteConversation,
  setCurrentVariant,
  setTyping,
  setDraft,
  loadDraft,
  clearDraft,
  setSearchQuery,
  togglePin,
  toggleArchive,
  addReaction,
} = chatSlice.actions

export default chatSlice.reducer
