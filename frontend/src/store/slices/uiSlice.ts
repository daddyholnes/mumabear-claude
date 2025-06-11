import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  // Navigation
  currentExperience: string
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Chat widget
  chatWidgetOpen: boolean
  chatWidgetExpanded: boolean
  chatWidgetPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  
  // Live ticker
  liveTickerVisible: boolean
  liveTickerPosition: 'top' | 'bottom'
  
  // Notifications
  notifications: Notification[]
  
  // Loading states
  loading: Record<string, boolean>
  
  // Modals and dialogs
  modals: Record<string, boolean>
  
  // Preferences
  preferences: {
    autoSave: boolean
    notifications: boolean
    sounds: boolean
    backgroundEffects: boolean
    compactMode: boolean
  }
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  persistent?: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: string
  primary?: boolean
}

const initialState: UIState = {
  // Navigation
  currentExperience: 'home',
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  // Chat widget
  chatWidgetOpen: false,
  chatWidgetExpanded: false,
  chatWidgetPosition: 'bottom-right',
  
  // Live ticker
  liveTickerVisible: true,
  liveTickerPosition: 'top',
  
  // Notifications
  notifications: [],
  
  // Loading states
  loading: {},
  
  // Modals and dialogs
  modals: {},
  
  // Preferences
  preferences: {
    autoSave: true,
    notifications: true,
    sounds: true,
    backgroundEffects: true,
    compactMode: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Navigation
    setCurrentExperience: (state, action: PayloadAction<string>) => {
      state.currentExperience = action.payload
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    
    // Chat widget
    setChatWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.chatWidgetOpen = action.payload
    },
    
    setChatWidgetExpanded: (state, action: PayloadAction<boolean>) => {
      state.chatWidgetExpanded = action.payload
    },
    
    setChatWidgetPosition: (state, action: PayloadAction<UIState['chatWidgetPosition']>) => {
      state.chatWidgetPosition = action.payload
    },
    
    toggleChatWidget: (state) => {
      state.chatWidgetOpen = !state.chatWidgetOpen
    },
    
    toggleChatWidgetExpanded: (state) => {
      state.chatWidgetExpanded = !state.chatWidgetExpanded
    },
    
    // Live ticker
    setLiveTickerVisible: (state, action: PayloadAction<boolean>) => {
      state.liveTickerVisible = action.payload
    },
    
    setLiveTickerPosition: (state, action: PayloadAction<UIState['liveTickerPosition']>) => {
      state.liveTickerPosition = action.payload
    },
    
    toggleLiveTicker: (state) => {
      state.liveTickerVisible = !state.liveTickerVisible
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }
      state.notifications.unshift(notification)
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    clearReadNotifications: (state) => {
      state.notifications = state.notifications.filter(n => !n.read || n.persistent)
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading
    },
    
    // Modals and dialogs
    setModal: (state, action: PayloadAction<{ key: string; open: boolean }>) => {
      state.modals[action.payload.key] = action.payload.open
    },
    
    toggleModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = !state.modals[action.payload]
    },
    
    // Preferences
    setPreference: (state, action: PayloadAction<{ key: keyof UIState['preferences']; value: boolean }>) => {
      state.preferences[action.payload.key] = action.payload.value
    },
    
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
  },
})

export const {
  // Navigation
  setCurrentExperience,
  setSidebarOpen,
  setSidebarCollapsed,
  toggleSidebar,
  toggleSidebarCollapsed,
  
  // Chat widget
  setChatWidgetOpen,
  setChatWidgetExpanded,
  setChatWidgetPosition,
  toggleChatWidget,
  toggleChatWidgetExpanded,
  
  // Live ticker
  setLiveTickerVisible,
  setLiveTickerPosition,
  toggleLiveTicker,
  
  // Notifications
  addNotification,
  removeNotification,
  markNotificationRead,
  clearNotifications,
  clearReadNotifications,
  
  // Loading states
  setLoading,
  
  // Modals and dialogs
  setModal,
  toggleModal,
  
  // Preferences
  setPreference,
  updatePreferences,
} = uiSlice.actions

export default uiSlice.reducer
