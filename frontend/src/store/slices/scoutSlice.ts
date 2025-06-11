import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ScoutState {
  models: ScoutModel[]
  activeWorkflows: ScoutWorkflow[]
  taskQueue: ScoutTask[]
  quotaStatus: Record<string, QuotaInfo>
  orchestrationMetrics: OrchestrationMetrics
  autonomousMode: boolean
  preferences: ScoutPreferences
}

export interface ScoutModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  status: 'available' | 'busy' | 'maintenance' | 'offline'
  performance: {
    averageResponseTime: number
    successRate: number
    tasksCompleted: number
  }
  quota: QuotaInfo
  specializations: string[]
}

export interface ScoutWorkflow {
  id: string
  name: string
  description: string
  status: 'planning' | 'executing' | 'completed' | 'failed' | 'paused'
  steps: WorkflowStep[]
  currentStepIndex: number
  startTime: string
  estimatedCompletion?: string
  assignedModels: string[]
  context: Record<string, any>
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  assignedModel?: string
  inputs: Record<string, any>
  outputs?: Record<string, any>
  duration?: number
  error?: string
}

export interface ScoutTask {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'queued' | 'running' | 'completed' | 'failed'
  assignedModel?: string
  createdAt: string
  estimatedDuration?: number
  progress: number
  metadata?: Record<string, any>
}

export interface QuotaInfo {
  used: number
  limit: number
  resetTime: string
  warningThreshold: number
}

export interface OrchestrationMetrics {
  totalTasksToday: number
  successRate: number
  averageTaskTime: number
  modelUtilization: Record<string, number>
  peakHours: string[]
  costAnalysis: {
    todaysCost: number
    projectedMonthlyCost: number
    costPerTask: number
  }
}

export interface ScoutPreferences {
  autoSelectModel: boolean
  parallelExecution: boolean
  priorityMode: 'speed' | 'quality' | 'cost'
  notifyOnCompletion: boolean
  maxConcurrentTasks: number
  preferredModels: string[]
}

const initialState: ScoutState = {
  models: [],
  activeWorkflows: [],
  taskQueue: [],
  quotaStatus: {},
  orchestrationMetrics: {
    totalTasksToday: 0,
    successRate: 0,
    averageTaskTime: 0,
    modelUtilization: {},
    peakHours: [],
    costAnalysis: {
      todaysCost: 0,
      projectedMonthlyCost: 0,
      costPerTask: 0,
    },
  },
  autonomousMode: false,
  preferences: {
    autoSelectModel: true,
    parallelExecution: true,
    priorityMode: 'quality',
    notifyOnCompletion: true,
    maxConcurrentTasks: 5,
    preferredModels: [],
  },
}

const scoutSlice = createSlice({
  name: 'scout',
  initialState,
  reducers: {
    // Models
    setModels: (state, action: PayloadAction<ScoutModel[]>) => {
      state.models = action.payload
    },
    
    updateModelStatus: (state, action: PayloadAction<{ modelId: string; status: ScoutModel['status'] }>) => {
      const model = state.models.find(m => m.id === action.payload.modelId)
      if (model) {
        model.status = action.payload.status
      }
    },
    
    updateModelQuota: (state, action: PayloadAction<{ modelId: string; quota: QuotaInfo }>) => {
      const model = state.models.find(m => m.id === action.payload.modelId)
      if (model) {
        model.quota = action.payload.quota
      }
      state.quotaStatus[action.payload.modelId] = action.payload.quota
    },
    
    // Workflows
    addWorkflow: (state, action: PayloadAction<ScoutWorkflow>) => {
      state.activeWorkflows.push(action.payload)
    },
    
    updateWorkflow: (state, action: PayloadAction<{ id: string; updates: Partial<ScoutWorkflow> }>) => {
      const workflowIndex = state.activeWorkflows.findIndex(w => w.id === action.payload.id)
      if (workflowIndex !== -1) {
        state.activeWorkflows[workflowIndex] = {
          ...state.activeWorkflows[workflowIndex],
          ...action.payload.updates,
        }
      }
    },
    
    updateWorkflowStep: (state, action: PayloadAction<{ workflowId: string; stepId: string; updates: Partial<WorkflowStep> }>) => {
      const workflow = state.activeWorkflows.find(w => w.id === action.payload.workflowId)
      if (workflow) {
        const stepIndex = workflow.steps.findIndex(s => s.id === action.payload.stepId)
        if (stepIndex !== -1) {
          workflow.steps[stepIndex] = {
            ...workflow.steps[stepIndex],
            ...action.payload.updates,
          }
        }
      }
    },
    
    removeWorkflow: (state, action: PayloadAction<string>) => {
      state.activeWorkflows = state.activeWorkflows.filter(w => w.id !== action.payload)
    },
    
    // Tasks
    addTask: (state, action: PayloadAction<ScoutTask>) => {
      state.taskQueue.push(action.payload)
    },
    
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<ScoutTask> }>) => {
      const taskIndex = state.taskQueue.findIndex(t => t.id === action.payload.id)
      if (taskIndex !== -1) {
        state.taskQueue[taskIndex] = {
          ...state.taskQueue[taskIndex],
          ...action.payload.updates,
        }
      }
    },
    
    removeTask: (state, action: PayloadAction<string>) => {
      state.taskQueue = state.taskQueue.filter(t => t.id !== action.payload)
    },
    
    clearCompletedTasks: (state) => {
      state.taskQueue = state.taskQueue.filter(t => t.status !== 'completed')
    },
    
    // Metrics
    updateMetrics: (state, action: PayloadAction<Partial<OrchestrationMetrics>>) => {
      state.orchestrationMetrics = {
        ...state.orchestrationMetrics,
        ...action.payload,
      }
    },
    
    // Autonomous mode
    setAutonomousMode: (state, action: PayloadAction<boolean>) => {
      state.autonomousMode = action.payload
    },
    
    // Preferences
    updatePreferences: (state, action: PayloadAction<Partial<ScoutPreferences>>) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      }
    },
    
    addPreferredModel: (state, action: PayloadAction<string>) => {
      if (!state.preferences.preferredModels.includes(action.payload)) {
        state.preferences.preferredModels.push(action.payload)
      }
    },
    
    removePreferredModel: (state, action: PayloadAction<string>) => {
      state.preferences.preferredModels = state.preferences.preferredModels.filter(
        modelId => modelId !== action.payload
      )
    },
  },
})

export const {
  // Models
  setModels,
  updateModelStatus,
  updateModelQuota,
  
  // Workflows
  addWorkflow,
  updateWorkflow,
  updateWorkflowStep,
  removeWorkflow,
  
  // Tasks
  addTask,
  updateTask,
  removeTask,
  clearCompletedTasks,
  
  // Metrics
  updateMetrics,
  
  // Autonomous mode
  setAutonomousMode,
  
  // Preferences
  updatePreferences,
  addPreferredModel,
  removePreferredModel,
} = scoutSlice.actions

export default scoutSlice.reducer
