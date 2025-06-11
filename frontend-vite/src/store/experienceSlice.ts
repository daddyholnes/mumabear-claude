// Experience management for UI hub
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Experience {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'chat' | 'workspace' | 'tools' | 'studio' | 'research' | 'marketplace';
  isActive: boolean;
  url?: string;
  metadata?: {
    lastAccessed?: Date;
    favorited?: boolean;
    notifications?: number;
    customization?: Record<string, any>;
  };
}

export interface LiveTicker {
  id: string;
  experience: string;
  type: 'notification' | 'update' | 'alert' | 'metric';
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
}

interface ExperienceState {
  experiences: Record<string, Experience>;
  activeExperience: string | null;
  tickers: LiveTicker[];
  notifications: Record<string, number>;
  layout: 'grid' | 'list' | 'cards';
  customizations: Record<string, any>;
}

const defaultExperiences: Record<string, Experience> = {
  'mama-bear': {
    id: 'mama-bear',
    name: 'Mama Bear Chat',
    icon: '🐻',
    description: 'Primary AI chat with Gemini 2.5',
    category: 'chat',
    isActive: false,
    metadata: { favorited: true, notifications: 0 },
  },  'scout-orchestration': {
    id: 'scout-orchestration',
    name: 'Scout Orchestration',
    icon: '🔍',
    description: 'Agent workflow management',
    category: 'workspace',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'dev-workspaces': {
    id: 'dev-workspaces',
    name: 'Development Workspaces',
    icon: '💻',
    description: 'VSCode-like development environment',
    category: 'workspace',
    isActive: false,
    metadata: { favorited: true, notifications: 0 },
  },
  'agent-workbench': {
    id: 'agent-workbench',
    name: 'Agent Creation Workbench',
    icon: '🔧',
    description: 'Design and build AI agents',
    category: 'studio',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'research-library': {
    id: 'research-library',
    name: 'Deep Research Library',
    icon: '📚',
    description: 'Knowledge base and research tools',
    category: 'research',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'api-studio': {
    id: 'api-studio',
    name: 'Live API Studio',
    icon: '⚡',
    description: 'Real-time API testing and development',
    category: 'tools',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'theme-studio': {
    id: 'theme-studio',
    name: 'Theme Studio',
    icon: '🎨',
    description: 'Customize themes and accessibility',
    category: 'tools',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'collaborative-workspace': {
    id: 'collaborative-workspace',
    name: 'Collaborative Workspace',
    icon: '👥',
    description: 'Team collaboration and project management',
    category: 'workspace',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'mcp-marketplace': {
    id: 'mcp-marketplace',
    name: 'MCP Marketplace',
    icon: '🏪',
    description: 'Model Context Protocol extensions',
    category: 'marketplace',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'mini-apps': {
    id: 'mini-apps',
    name: 'Mini Apps',
    icon: '📱',
    description: 'Quick utility applications',
    category: 'tools',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'cua-workbench': {
    id: 'cua-workbench',
    name: 'CUA Workbench',
    icon: '🎛️',
    description: 'Computer Use Agent interface',
    category: 'studio',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'integration-workbench': {
    id: 'integration-workbench',
    name: 'Integration Workbench',
    icon: '🔗',
    description: 'Service integrations and workflows',
    category: 'tools',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
  'live-metrics': {
    id: 'live-metrics',
    name: 'Live Metrics Dashboard',
    icon: '📊',
    description: 'Real-time system monitoring',
    category: 'tools',
    isActive: false,
    metadata: { favorited: false, notifications: 0 },
  },
};

const initialState: ExperienceState = {
  experiences: defaultExperiences,
  activeExperience: null,
  tickers: [],
  notifications: {},
  layout: 'grid',
  customizations: {},
};

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    setActiveExperience: (state, action: PayloadAction<string>) => {
      // Set previous experience as inactive
      if (state.activeExperience && state.experiences[state.activeExperience]) {
        state.experiences[state.activeExperience].isActive = false;
      }
      
      state.activeExperience = action.payload;
      if (state.experiences[action.payload]) {
        state.experiences[action.payload].isActive = true;
        state.experiences[action.payload].metadata = {
          ...state.experiences[action.payload].metadata,
          lastAccessed: new Date(),
        };
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (state.experiences[action.payload]) {
        const current = state.experiences[action.payload].metadata?.favorited || false;
        state.experiences[action.payload].metadata = {
          ...state.experiences[action.payload].metadata,
          favorited: !current,
        };
      }
    },
    addTicker: (state, action: PayloadAction<Omit<LiveTicker, 'id' | 'timestamp' | 'isRead'>>) => {
      const ticker: LiveTicker = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        isRead: false,
      };
      state.tickers.unshift(ticker);
      
      // Update notification count for experience
      if (!state.notifications[action.payload.experience]) {
        state.notifications[action.payload.experience] = 0;
      }
      state.notifications[action.payload.experience]++;
      
      // Keep only latest 100 tickers
      if (state.tickers.length > 100) {
        state.tickers = state.tickers.slice(0, 100);
      }
    },
    markTickerRead: (state, action: PayloadAction<string>) => {
      const ticker = state.tickers.find(t => t.id === action.payload);
      if (ticker && !ticker.isRead) {
        ticker.isRead = true;
        if (state.notifications[ticker.experience] > 0) {
          state.notifications[ticker.experience]--;
        }
      }
    },
    clearNotifications: (state, action: PayloadAction<string>) => {
      state.notifications[action.payload] = 0;
      state.tickers.forEach(ticker => {
        if (ticker.experience === action.payload) {
          ticker.isRead = true;
        }
      });
    },
    setLayout: (state, action: PayloadAction<'grid' | 'list' | 'cards'>) => {
      state.layout = action.payload;
    },
    updateCustomization: (state, action: PayloadAction<{ experienceId: string; customization: Record<string, any> }>) => {
      const { experienceId, customization } = action.payload;
      state.customizations[experienceId] = {
        ...state.customizations[experienceId],
        ...customization,
      };
    },
  },
});

export const {
  setActiveExperience,
  toggleFavorite,
  addTicker,
  markTickerRead,
  clearNotifications,
  setLayout,
  updateCustomization,
} = experienceSlice.actions;

export default experienceSlice.reducer;
