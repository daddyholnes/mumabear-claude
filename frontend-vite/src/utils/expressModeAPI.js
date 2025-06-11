// Express Mode Frontend Integration
// Add these to your existing frontend for Express Mode support

// 🚀 Express Mode API Client
export class ExpressModeAPI {
  constructor(baseURL = 'http://localhost:5001') {
    this.baseURL = baseURL;
  }

  // ⚡ Ultra-fast chat with Express Mode
  async expressChat(message, options = {}) {
    const {
      variant = 'scout_commander',
      speedPriority = 'auto',
      userId = 'default',
      context = {}
    } = options;

    const startTime = performance.now();
    
    try {
      const response = await fetch(`${this.baseURL}/api/mama-bear/express-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          variant,
          speed_priority: speedPriority,
          user_id: userId,
          context
        })
      });

      const data = await response.json();
      const responseTime = performance.now() - startTime;
      
      // Add client-side timing
      data.client_response_time_ms = Math.round(responseTime);
      
      return data;
    } catch (error) {
      console.error('Express Mode API error:', error);
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  }

  // 🚀 Supercharged Mama Bear V3 chat
  async superchargedChat(message, options = {}) {
    const {
      variant = 'scout_commander',
      speedPriority = 'auto',
      userId = 'default',
      context = {},
      allowAutonomousActions = true
    } = options;

    try {
      const response = await fetch(`${this.baseURL}/api/mama-bear-v3/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          user_id: userId,
          variant,
          context,
          speed_priority: speedPriority,
          allow_autonomous_actions: allowAutonomousActions
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Supercharged API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🤖 Create AI agent
  async createAgent(agentSpec, userId = 'default') {
    try {
      const response = await fetch(`${this.baseURL}/api/agent-workbench/create-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agentSpec,
          user_id: userId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Agent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 📊 Get performance metrics
  async getPerformanceReport() {
    try {
      const response = await fetch(`${this.baseURL}/api/mama-bear-v3/performance-report`);
      return await response.json();
    } catch (error) {
      console.error('Performance report error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🏭 Get available agent templates
  async getAgentTemplates() {
    try {
      const response = await fetch(`${this.baseURL}/api/agent-workbench/templates`);
      return await response.json();
    } catch (error) {
      console.error('Templates error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 📈 Test performance comparison
  async performanceTest(message = 'Hello Mama Bear!') {
    try {
      const response = await fetch(`${this.baseURL}/api/mama-bear/performance-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      return await response.json();
    } catch (error) {
      console.error('Performance test error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 🎯 Performance Tier Selector Component
export const SpeedPrioritySelector = ({ value, onChange, className = '' }) => {
  const speedTiers = [
    {
      value: 'ultra_fast',
      label: '⚡ Ultra Fast',
      description: '<200ms, Simple responses',
      color: 'text-emerald-500'
    },
    {
      value: 'fast', 
      label: '🚀 Fast',
      description: '<500ms, Balanced quality',
      color: 'text-blue-500'
    },
    {
      value: 'auto',
      label: '🧠 Auto',
      description: 'Let Mama Bear decide',
      color: 'text-purple-500'
    },
    {
      value: 'research',
      label: '🔬 Research',
      description: 'Deep analysis, comprehensive',
      color: 'text-amber-500'
    }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Response Speed Priority
      </label>
      <div className="grid grid-cols-2 gap-2">
        {speedTiers.map((tier) => (
          <button
            key={tier.value}
            type="button"
            onClick={() => onChange(tier.value)}
            className={`
              p-3 rounded-lg border text-left transition-all duration-200
              ${value === tier.value 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }
            `}
          >
            <div className={`font-medium ${tier.color}`}>
              {tier.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {tier.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 🤖 Agent Template Selector
export const AgentTemplateSelector = ({ templates, onSelect, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Choose Agent Template
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(templates || {}).map(([key, template]) => (
          <div
            key={key}
            onClick={() => onSelect(key, template)}
            className="
              p-4 border rounded-lg cursor-pointer transition-all duration-200
              border-gray-200 dark:border-gray-700 
              hover:border-purple-500 hover:shadow-md
              bg-white dark:bg-gray-800
            "
          >
            <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {template.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {template.description}
            </div>
            <div className="flex flex-wrap gap-1">
              {template.default_tools?.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="
                    px-2 py-1 text-xs rounded-full 
                    bg-purple-100 dark:bg-purple-900/30 
                    text-purple-700 dark:text-purple-300
                  "
                >
                  {tool.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 📊 Performance Metrics Display
export const PerformanceMetrics = ({ metrics, className = '' }) => {
  if (!metrics) return null;

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-emerald-500">
          {Math.round(metrics.average_response_time_ms)}ms
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Avg Response Time
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-blue-500">
          {metrics.express_mode_usage_percent}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Express Mode Usage
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-purple-500">
          {formatNumber(metrics.total_requests)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Requests
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-amber-500">
          {Math.round(metrics.user_satisfaction * 100)}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Satisfaction
        </div>
      </div>
    </div>
  );
};

// 💬 Enhanced Chat Component with Express Mode
export const ExpressChatComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speedPriority, setSpeedPriority] = useState('auto');
  const [variant, setVariant] = useState('scout_commander');
  
  const expressAPI = new ExpressModeAPI();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const result = await expressAPI.expressChat(message, {
        speedPriority,
        variant,
        userId: 'demo_user'
      });

      setResponse(result);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          ⚡ Express Mode Chat
        </h2>

        {/* Speed Priority Selector */}
        <SpeedPrioritySelector
          value={speedPriority}
          onChange={setSpeedPriority}
          className="mb-6"
        />

        {/* Variant Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mama Bear Variant
          </label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="
              w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
            "
          >
            <option value="scout_commander">🎯 Scout Commander</option>
            <option value="research_specialist">📚 Research Specialist</option>
            <option value="code_review_bear">🔍 Code Review Bear</option>
            <option value="creative_bear">🎨 Creative Bear</option>
            <option value="efficiency_bear">⚡ Efficiency Bear</option>
            <option value="debugging_detective">🔧 Debugging Detective</option>
            <option value="learning_bear">🧠 Learning Bear</option>
          </select>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Mama Bear anything... ⚡ Express Mode enabled!"
            className="
              w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              resize-none h-32
            "
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          className="
            w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500
            text-white font-medium rounded-lg transition-all duration-200
            hover:from-purple-600 hover:to-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          "
        >
          {loading ? 'Thinking...' : '⚡ Send with Express Mode'}
        </button>

        {/* Response Display */}
        {response && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Mama Bear Response
              </div>
              {response.actual_latency_ms && (
                <div className="text-sm text-emerald-500 font-medium">
                  ⚡ {response.actual_latency_ms}ms
                </div>
              )}
            </div>
            
            {response.success ? (
              <div className="space-y-3">
                <div className="text-gray-800 dark:text-gray-200">
                  {response.response}
                </div>
                
                {/* Performance Info */}
                {response.performance_improvement && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
                    Mode: {response.mode} | 
                    Speed increase: {response.performance_improvement.speed_increase_percent}% | 
                    Cost tier: ${response.cost_tier}/1K tokens
                  </div>
                )}

                {/* Suggestions */}
                {response.suggestions && response.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Suggestions:
                    </div>
                    {response.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(suggestion)}
                        className="
                          block w-full text-left p-2 text-sm rounded border
                          border-purple-200 dark:border-purple-700
                          hover:bg-purple-50 dark:hover:bg-purple-900/20
                          text-purple-700 dark:text-purple-300
                        "
                      >
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                Error: {response.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 🏭 Agent Creation Workshop Component
export const AgentCreationWorkshop = () => {
  const [templates, setTemplates] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);

  const expressAPI = new ExpressModeAPI();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const templatesData = await expressAPI.getAgentTemplates();
    if (templatesData.success) {
      setTemplates(templatesData.templates);
    }
  };

  const handleCreateAgent = async () => {
    if (!selectedTemplate || !agentName.trim()) return;

    setCreating(true);
    try {
      const agentSpec = {
        name: agentName,
        template: selectedTemplate,
        description: agentDescription || templates[selectedTemplate].description,
        capabilities: templates[selectedTemplate].default_tools || [],
        personality_traits: templates[selectedTemplate].personality_traits || {}
      };

      const result = await expressAPI.createAgent(agentSpec);
      setResult(result);
    } catch (error) {
      console.error('Agent creation error:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🏭 Agent Creation Workshop
        </h2>

        {templates && (
          <AgentTemplateSelector
            templates={templates}
            onSelect={(key, template) => {
              setSelectedTemplate(key);
              setAgentName(template.name || '');
              setAgentDescription(template.description || '');
            }}
            className="mb-6"
          />
        )}

        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="
                  w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                "
                placeholder="My Specialized Agent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="
                  w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  resize-none h-24
                "
                placeholder="Describe what this agent specializes in..."
              />
            </div>

            <button
              onClick={handleCreateAgent}
              disabled={creating || !agentName.trim()}
              className="
                w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-500
                text-white font-medium rounded-lg transition-all duration-200
                hover:from-emerald-600 hover:to-blue-600 
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
              "
            >
              {creating ? 'Creating Agent...' : '🤖 Create Specialized Agent'}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {result.success ? (
              <div className="space-y-2">
                <div className="font-medium text-emerald-600 dark:text-emerald-400">
                  ✅ Agent Created Successfully!
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Agent ID: {result.agent_id}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {result.status}
                </div>
                {result.deployment_info?.agent_endpoint && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Endpoint: {result.deployment_info.agent_endpoint}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                ❌ Error: {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the main API client for use in other components
export default ExpressModeAPI;
