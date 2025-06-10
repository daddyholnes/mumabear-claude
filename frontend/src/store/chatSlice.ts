// Chat management for Mama Bear expandable widget
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mama-bear';
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'code';
  metadata?: {
    experience?: string;
    context?: string;
    attachments?: string[];
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  experience: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  widgetExpanded: boolean;
  widgetPosition: { x: number; y: number };
  isTyping: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

const initialState: ChatState = {
  conversations: {},
  activeConversationId: null,
  widgetExpanded: false,
  widgetPosition: { x: 20, y: 20 },
  isTyping: false,
  connectionStatus: 'disconnected',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleWidget: (state) => {
      state.widgetExpanded = !state.widgetExpanded;
    },
    setWidgetPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.widgetPosition = action.payload;
    },
    addConversation: (state, action: PayloadAction<{ experience: string; title?: string }>) => {
      const id = Date.now().toString();
      const conversation: Conversation = {
        id,
        title: action.payload.title || `Chat - ${action.payload.experience}`,
        messages: [],
        experience: action.payload.experience,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      state.conversations[id] = conversation;
      state.activeConversationId = id;
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      // Mark previous conversation as inactive
      if (state.activeConversationId && state.conversations[state.activeConversationId]) {
        state.conversations[state.activeConversationId].isActive = false;
      }
      
      state.activeConversationId = action.payload;
      if (state.conversations[action.payload]) {
        state.conversations[action.payload].isActive = true;
        state.conversations[action.payload].updatedAt = new Date();
      }
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Omit<Message, 'id' | 'timestamp'> }>) => {
      const { conversationId, message } = action.payload;
      if (state.conversations[conversationId]) {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        state.conversations[conversationId].messages.push(newMessage);
        state.conversations[conversationId].updatedAt = new Date();
      }
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<'connected' | 'disconnected' | 'reconnecting'>) => {
      state.connectionStatus = action.payload;
    },
    clearConversation: (state, action: PayloadAction<string>) => {
      if (state.conversations[action.payload]) {
        state.conversations[action.payload].messages = [];
        state.conversations[action.payload].updatedAt = new Date();
      }
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload];
      if (state.activeConversationId === action.payload) {
        const remainingConversations = Object.keys(state.conversations);
        state.activeConversationId = remainingConversations.length > 0 ? remainingConversations[0] : null;
      }
    },
  },
});

export const {
  toggleWidget,
  setWidgetPosition,
  addConversation,
  setActiveConversation,
  addMessage,
  setTyping,
  setConnectionStatus,
  clearConversation,
  deleteConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
