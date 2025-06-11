import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SystemState {
  health: SystemHealth
  metrics: SystemMetrics
  services: Record<string, ServiceStatus>
  liveUpdates: LiveUpdate[]
  errors: SystemError[]
  maintenance: MaintenanceStatus
  version: VersionInfo
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical' | 'maintenance'
  uptime: number
  lastCheck: string
  overallScore: number
  issues: HealthIssue[]
}

export interface HealthIssue {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'performance' | 'connectivity' | 'resource' | 'security'
  message: string
  timestamp: string
  resolved: boolean
}

export interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temperature?: number
  }
  memory: {
    used: number
    total: number
    available: number
  }
  disk: {
    used: number
    total: number
    available: number
  }
  network: {
    incoming: number
    outgoing: number
    latency: number
  }
  aiModels: {
    activeConnections: number
    totalRequests: number
    averageResponseTime: number
    errorRate: number
  }
  database: {
    connections: number
    queryTime: number
    cacheHitRate: number
  }
}

export interface ServiceStatus {
  name: string
  status: 'running' | 'stopped' | 'error' | 'starting' | 'stopping'
  uptime: number
  url?: string
  version?: string
  dependencies: string[]
  healthCheck: {
    lastCheck: string
    responseTime: number
    status: 'pass' | 'fail' | 'warn'
  }
}

export interface LiveUpdate {
  id: string
  type: 'system' | 'ai' | 'user' | 'security' | 'performance'
  severity: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  source: string
  metadata?: Record<string, any>
}

export interface SystemError {
  id: string
  level: 'error' | 'warning' | 'info' | 'debug'
  source: string
  message: string
  stack?: string
  timestamp: string
  resolved: boolean
  context?: Record<string, any>
}

export interface MaintenanceStatus {
  active: boolean
  scheduled: MaintenanceWindow[]
  message?: string
  estimatedDuration?: number
}

export interface MaintenanceWindow {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  type: 'scheduled' | 'emergency' | 'update'
  affectedServices: string[]
}

export interface VersionInfo {
  frontend: string
  backend: string
  database: string
  lastUpdated: string
  releaseNotes?: string
}

const initialState: SystemState = {
  health: {
    status: 'healthy',
    uptime: 0,
    lastCheck: new Date().toISOString(),
    overallScore: 100,
    issues: [],
  },
  metrics: {
    cpu: {
      usage: 0,
      cores: 4,
    },
    memory: {
      used: 0,
      total: 8192,
      available: 8192,
    },
    disk: {
      used: 0,
      total: 512000,
      available: 512000,
    },
    network: {
      incoming: 0,
      outgoing: 0,
      latency: 0,
    },
    aiModels: {
      activeConnections: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
    },
    database: {
      connections: 0,
      queryTime: 0,
      cacheHitRate: 0,
    },
  },
  services: {},
  liveUpdates: [],
  errors: [],
  maintenance: {
    active: false,
    scheduled: [],
  },
  version: {
    frontend: '1.0.0',
    backend: '1.0.0',
    database: '1.0.0',
    lastUpdated: new Date().toISOString(),
  },
}

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    // Health
    updateHealth: (state, action: PayloadAction<Partial<SystemHealth>>) => {
      state.health = {
        ...state.health,
        ...action.payload,
        lastCheck: new Date().toISOString(),
      }
    },
    
    addHealthIssue: (state, action: PayloadAction<Omit<HealthIssue, 'id' | 'timestamp'>>) => {
      const issue: HealthIssue = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }
      state.health.issues.push(issue)
    },
    
    resolveHealthIssue: (state, action: PayloadAction<string>) => {
      const issue = state.health.issues.find(i => i.id === action.payload)
      if (issue) {
        issue.resolved = true
      }
    },
    
    clearResolvedIssues: (state) => {
      state.health.issues = state.health.issues.filter(issue => !issue.resolved)
    },
    
    // Metrics
    updateMetrics: (state, action: PayloadAction<Partial<SystemMetrics>>) => {
      state.metrics = {
        ...state.metrics,
        ...action.payload,
      }
    },
    
    // Services
    updateService: (state, action: PayloadAction<{ id: string; service: ServiceStatus }>) => {
      state.services[action.payload.id] = action.payload.service
    },
    
    updateServiceStatus: (state, action: PayloadAction<{ id: string; status: ServiceStatus['status'] }>) => {
      const service = state.services[action.payload.id]
      if (service) {
        service.status = action.payload.status
      }
    },
    
    // Live updates
    addLiveUpdate: (state, action: PayloadAction<Omit<LiveUpdate, 'id' | 'timestamp'>>) => {
      const update: LiveUpdate = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }
      state.liveUpdates.unshift(update)
      
      // Keep only the last 100 updates
      if (state.liveUpdates.length > 100) {
        state.liveUpdates = state.liveUpdates.slice(0, 100)
      }
    },
    
    clearLiveUpdates: (state) => {
      state.liveUpdates = []
    },
    
    // Errors
    addError: (state, action: PayloadAction<Omit<SystemError, 'id' | 'timestamp'>>) => {
      const error: SystemError = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }
      state.errors.unshift(error)
      
      // Keep only the last 50 errors
      if (state.errors.length > 50) {
        state.errors = state.errors.slice(0, 50)
      }
    },
    
    resolveError: (state, action: PayloadAction<string>) => {
      const error = state.errors.find(e => e.id === action.payload)
      if (error) {
        error.resolved = true
      }
    },
    
    clearResolvedErrors: (state) => {
      state.errors = state.errors.filter(error => !error.resolved)
    },
    
    clearAllErrors: (state) => {
      state.errors = []
    },
    
    // Maintenance
    setMaintenanceMode: (state, action: PayloadAction<{ active: boolean; message?: string; estimatedDuration?: number }>) => {
      state.maintenance.active = action.payload.active
      state.maintenance.message = action.payload.message
      state.maintenance.estimatedDuration = action.payload.estimatedDuration
    },
    
    addMaintenanceWindow: (state, action: PayloadAction<MaintenanceWindow>) => {
      state.maintenance.scheduled.push(action.payload)
    },
    
    removeMaintenanceWindow: (state, action: PayloadAction<string>) => {
      state.maintenance.scheduled = state.maintenance.scheduled.filter(w => w.id !== action.payload)
    },
    
    // Version
    updateVersion: (state, action: PayloadAction<Partial<VersionInfo>>) => {
      state.version = {
        ...state.version,
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      }
    },
  },
})

export const {
  // Health
  updateHealth,
  addHealthIssue,
  resolveHealthIssue,
  clearResolvedIssues,
  
  // Metrics
  updateMetrics,
  
  // Services
  updateService,
  updateServiceStatus,
  
  // Live updates
  addLiveUpdate,
  clearLiveUpdates,
  
  // Errors
  addError,
  resolveError,
  clearResolvedErrors,
  clearAllErrors,
  
  // Maintenance
  setMaintenanceMode,
  addMaintenanceWindow,
  removeMaintenanceWindow,
  
  // Version
  updateVersion,
} = systemSlice.actions

export default systemSlice.reducer
