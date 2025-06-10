// frontend/src/components/monitoring/ProductionMonitoringDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, AlertTriangle, BarChart3, Brain, CheckCircle, Clock, 
  DollarSign, Gauge, LineChart, Monitor, RefreshCw, Server, 
  Settings, Shield, TrendingDown, TrendingUp, Users, Zap,
  AlertCircle, Bell, ChevronDown, ChevronUp, Eye, Filter,
  Download, ExternalLink, Maximize2, MoreHorizontal, Play,
  Pause, RotateCcw, Search, Target, Thermometer, Wifi
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  AreaChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ModelMetrics {
  id: string;
  name: string;
  health_score: number;
  quota_usage: {
    current: number;
    limit: number;
    percentage: number;
  };
  performance: {
    avg_response_time: number;
    success_rate: number;
    requests_per_minute: number;
  };
  cost: {
    hourly_spend: number;
    daily_spend: number;
    cost_per_request: number;
  };
  prediction: {
    next_hour_usage: number;
    confidence: number;
  };
}

interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  model_id?: string;
  timestamp: string;
  action_required: boolean;
  acknowledged: boolean;
}

interface WorkflowMetrics {
  total_workflows: number;
  active_workflows: number;
  success_rate: number;
  avg_completion_time: number;
  cost_efficiency: number;
}

const ProductionMonitoringDashboard: React.FC = () => {
  const [models, setModels] = useState<ModelMetrics[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  
  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  // Mock data for demonstration
  const mockModels: ModelMetrics[] = [
    {
      id: 'gemini-2.5-pro-preview-06-05',
      name: 'Gemini 2.5 Pro (Latest)',
      health_score: 0.95,
      quota_usage: { current: 45, limit: 60, percentage: 75 },
      performance: { avg_response_time: 1.2, success_rate: 0.98, requests_per_minute: 12 },
      cost: { hourly_spend: 2.45, daily_spend: 58.80, cost_per_request: 0.042 },
      prediction: { next_hour_usage: 52, confidence: 0.87 }
    },
    {
      id: 'gemini-2.5-flash-preview-05-20',
      name: 'Gemini 2.5 Flash',
      health_score: 0.88,
      quota_usage: { current: 78, limit: 120, percentage: 65 },
      performance: { avg_response_time: 0.8, success_rate: 0.94, requests_per_minute: 28 },
      cost: { hourly_spend: 1.20, daily_spend: 28.80, cost_per_request: 0.018 },
      prediction: { next_hour_usage: 85, confidence: 0.92 }
    },
    {
      id: 'gemini-2.5-flash-preview-04-17-thinking',
      name: 'Gemini 2.5 Flash Thinking',
      health_score: 0.78,
      quota_usage: { current: 35, limit: 60, percentage: 58 },
      performance: { avg_response_time: 2.1, success_rate: 0.91, requests_per_minute: 8 },
      cost: { hourly_spend: 1.80, daily_spend: 43.20, cost_per_request: 0.035 },
      prediction: { next_hour_usage: 42, confidence: 0.79 }
    }
  ];

  const mockAlerts: SystemAlert[] = [
    {
      id: 'alert-1',
      severity: 'warning',
      title: 'High Quota Usage',
      message: 'Gemini 2.5 Pro approaching 80% quota limit',
      model_id: 'gemini-2.5-pro-preview-06-05',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      action_required: true,
      acknowledged: false
    },
    {
      id: 'alert-2',
      severity: 'info',
      title: 'Model Switch Detected',
      message: 'Automatic failover to Gemini 2.5 Flash due to quota',
      model_id: 'gemini-2.5-flash-preview-05-20',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      action_required: false,
      acknowledged: true
    },
    {
      id: 'alert-3',
      severity: 'critical',
      title: 'Performance Degradation',
      message: 'Response time increased by 40% in last 10 minutes',
      model_id: 'gemini-2.5-flash-preview-04-17-thinking',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      action_required: true,
      acknowledged: false
    }
  ];

  // Real-time data simulation
  useEffect(() => {
    setModels(mockModels);
    setAlerts(mockAlerts);
    setWorkflowMetrics({
      total_workflows: 1247,
      active_workflows: 23,
      success_rate: 0.94,
      avg_completion_time: 4.2,
      cost_efficiency: 0.86
    });

    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        // Simulate real-time updates
        setModels(prev => prev.map(model => ({
          ...model,
          quota_usage: {
            ...model.quota_usage,
            current: Math.min(model.quota_usage.limit, 
              model.quota_usage.current + Math.random() * 2 - 1),
            percentage: (model.quota_usage.current / model.quota_usage.limit) * 100
          },
          performance: {
            ...model.performance,
            requests_per_minute: Math.max(0, 
              model.performance.requests_per_minute + Math.random() * 4 - 2)
          }
        })));
      }, 5000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh]);

  const getHealthColor = (score: number) => {
    if (score >= 0.9) return 'text-green-500';
    if (score >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const filteredAlerts = showOnlyCritical 
    ? alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged)
    : alerts.filter(alert => !alert.acknowledged);

  // Sample time series data for charts
  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    requests: Math.floor(Math.random() * 100) + 50,
    latency: Math.random() * 2 + 0.5,
    cost: Math.random() * 5 + 2,
    quota_usage: Math.random() * 80 + 20
  }));

  const modelDistributionData = models.map(model => ({
    name: model.name.split(' ').slice(-1)[0], // Get last word
    requests: model.performance.requests_per_minute,
    cost: model.cost.hourly_spend
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">
            🎛️ Production Monitoring Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">System Health</h3>
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {Math.round(models.reduce((acc, m) => acc + m.health_score, 0) / models.length * 100)}%
            </div>
            <p className="text-gray-400 text-sm">Overall system health</p>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Workflows</h3>
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {workflowMetrics?.active_workflows || 0}
            </div>
            <p className="text-gray-400 text-sm">Currently running</p>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Hourly Cost</h3>
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              ${models.reduce((acc, m) => acc + m.cost.hourly_spend, 0).toFixed(2)}
            </div>
            <p className="text-gray-400 text-sm">Current spend rate</p>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Critical Alerts</h3>
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2">
              {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}
            </div>
            <p className="text-gray-400 text-sm">Require attention</p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Charts */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">Performance Metrics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Volume */}
              <div>
                <h4 className="text-lg font-medium text-gray-300 mb-4">Request Volume</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #6B7280',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Response Time */}
              <div>
                <h4 className="text-lg font-medium text-gray-300 mb-4">Response Time</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsLineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #6B7280',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Model Performance Grid */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">Model Performance</h3>
            
            <div className="space-y-4">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  className="bg-gray-700/30 rounded-lg p-4 cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{model.name}</h4>
                      <p className="text-sm text-gray-400">{model.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${getHealthColor(model.health_score)}`}>
                        {Math.round(model.health_score * 100)}%
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedModel === model.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Quota Usage</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${model.quota_usage.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-white">
                          {model.quota_usage.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Requests/min</p>
                      <p className="text-lg font-semibold text-white">
                        {model.performance.requests_per_minute}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Success Rate</p>
                      <p className="text-lg font-semibold text-green-400">
                        {(model.performance.success_rate * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Cost/hour</p>
                      <p className="text-lg font-semibold text-yellow-400">
                        ${model.cost.hourly_spend.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedModel === model.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-600 pt-4 mt-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-white mb-2">Performance Details</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Avg Response Time:</span>
                                <span className="text-white">{model.performance.avg_response_time}s</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Cost per Request:</span>
                                <span className="text-white">${model.cost.cost_per_request.toFixed(3)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-white mb-2">Predictions</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Next Hour Usage:</span>
                                <span className="text-white">{model.prediction.next_hour_usage}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Confidence:</span>
                                <span className="text-white">{(model.prediction.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alert Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">System Alerts</h3>
              <button
                onClick={() => setShowOnlyCritical(!showOnlyCritical)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  showOnlyCritical 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {showOnlyCritical ? 'Show All' : 'Critical Only'}
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-400">No active alerts</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.severity)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          {alert.model_id && (
                            <p className="text-xs text-gray-500 mt-1">
                              Model: {alert.model_id.split('-').slice(-2).join('-')}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      {alert.action_required && !alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <RotateCcw className="w-5 h-5" />
                Rebalance Models
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <Play className="w-5 h-5" />
                Scale Up Capacity
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                <Pause className="w-5 h-5" />
                Emergency Stop
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                Export Logs
              </button>
            </div>
          </div>

          {/* Model Distribution Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Request Distribution</h3>
            
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={modelDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="requests"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {modelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #6B7280',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMonitoringDashboard;