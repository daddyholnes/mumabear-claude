import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ChatState {
  conversations: Record<string, Conversation>
  activeConversationId: string | null
  mamaBearVariant: MamaBearVariant
  messageHistory: ChatMessage[]
  isTyping: boolean
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  quickReplies: string[]
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  modelUsed: string
  context?: Record<string, any>
}

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  modelUsed?: string
  metadata?: {
    tokens?: number
    cost?: number
    processingTime?: number
    attachments?: Attachment[]
  }
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'document' | 'audio' | 'video' | 'code'
  url: string
  size: number
}

export type MamaBearVariant = 
  | 'default'
  | 'creative'
  | 'analytical'
  | 'coding'
  | 'research'
  | 'planning'
  | 'emotional'

const initialState: ChatState = {
  conversations: {},
  activeConversationId: null,
  mamaBearVariant: 'default',
  messageHistory: [],
  isTyping: false,
  connectionStatus: 'disconnected',
  quickReplies: [
    "Help me understand this better",
    "Can you provide more details?",
    "What are the next steps?",
    "Can you explain this differently?",
    "Show me an example",
  ],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Conversations
    createConversation: (state, action: PayloadAction<Omit<Conversation, 'messages' | 'createdAt' | 'updatedAt'>>) => {
      const conversation: Conversation = {
        ...action.payload,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.conversations[conversation.id] = conversation
      state.activeConversationId = conversation.id
    },
    
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload
    },
    
    updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const conversation = state.conversations[action.payload.id]
      if (conversation) {
        conversation.title = action.payload.title
        conversation.updatedAt = new Date().toISOString()
      }
    },
    
    deleteConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload]
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null
      }
    },
    
    // Messages
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const conversation = state.conversations[action.payload.conversationId]
      if (conversation) {
        conversation.messages.push(action.payload)
        conversation.updatedAt = new Date().toISOString()
      }
      state.messageHistory.push(action.payload)
    },
    
    updateMessage: (state, action: PayloadAction<{ id: string; updates: Partial<ChatMessage> }>) => {
      const messageIndex = state.messageHistory.findIndex(m => m.id === action.payload.id)
      if (messageIndex !== -1) {
        state.messageHistory[messageIndex] = {
          ...state.messageHistory[messageIndex],
          ...action.payload.updates,
        }
      }
      
      // Update in conversation as well
      Object.values(state.conversations).forEach(conversation => {
        const msgIndex = conversation.messages.findIndex(m => m.id === action.payload.id)
        if (msgIndex !== -1) {
          conversation.messages[msgIndex] = {
            ...conversation.messages[msgIndex],
            ...action.payload.updates,
          }
          conversation.updatedAt = new Date().toISOString()
        }
      })
    },
    
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messageHistory = state.messageHistory.filter(m => m.id !== action.payload)
      
      Object.values(state.conversations).forEach(conversation => {
        conversation.messages = conversation.messages.filter(m => m.id !== action.payload)
      })
    },
    
    clearMessageHistory: (state) => {
      state.messageHistory = []
    },
    
    // Mama Bear variant
    setMamaBearVariant: (state, action: PayloadAction<MamaBearVariant>) => {
      state.mamaBearVariant = action.payload
    },
    
    // UI states
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    
    setConnectionStatus: (state, action: PayloadAction<ChatState['connectionStatus']>) => {
      state.connectionStatus = action.payload
    },
    
    // Quick replies
    setQuickReplies: (state, action: PayloadAction<string[]>) => {
      state.quickReplies = action.payload
    },
    
    addQuickReply: (state, action: PayloadAction<string>) => {
      if (!state.quickReplies.includes(action.payload)) {
        state.quickReplies.push(action.payload)
      }
    },
    
    removeQuickReply: (state, action: PayloadAction<string>) => {
      state.quickReplies = state.quickReplies.filter(reply => reply !== action.payload)
    },
  },
})

export const {
  // Conversations
  createConversation,
  setActiveConversation,
  updateConversationTitle,
  deleteConversation,
  
  // Messages
  addMessage,
  updateMessage,
  deleteMessage,
  clearMessageHistory,
  
  // Mama Bear variant
  setMamaBearVariant,
  
  // UI states
  setIsTyping,
  setConnectionStatus,
  
  // Quick replies
  setQuickReplies,
  addQuickReply,
  removeQuickReply,
} = chatSlice.actions

// Async actions for external use
export const sendMessage = (message: { content: string; variant?: string }) => {
  return async (dispatch: any) => {
    // TODO: Implement actual message sending logic
    console.log('Sending message:', message);
  };
};

export const clearChat = () => {
  return (dispatch: any) => {
    dispatch(clearMessageHistory());
    // Clear active conversation if needed
  };
};

export const updateChatSettings = (settings: any) => {
  return async (dispatch: any) => {
    // TODO: Implement settings update logic
    console.log('Updating chat settings:', settings);
  };
};

export default chatSlice.reducer
