import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Play, 
  Save, 
  Share, 
  Settings, 
  Brain, 
  Database, 
  Globe, 
  Zap, 
  MessageSquare,
  FileText,
  Image,
  Video,
  Mic,
  Camera,
  Monitor,
  Cpu,
  Network,
  Eye,
  Users,
  Clock,
  Star,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  Link,
  Layers,
  Terminal
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  bidirectional: boolean;
  supportsVideo: boolean;
  supportsAudio: boolean;
  supportsImages: boolean;
  supportsScreenShare: boolean;
  contextWindow: number;
  outputTokens: number;
  pricing: {
    input: number;
    output: number;
  };
  logoPath?: string;
}

// Only models that support true live API and bidirectional chat
const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash Experimental',
    provider: 'Google',
    capabilities: ['text', 'images', 'video', 'audio', 'live-api', 'bidirectional', 'real-time'],
    bidirectional: true,
    supportsVideo: true,
    supportsAudio: true,
    supportsImages: true,
    supportsScreenShare: true,
    contextWindow: 1000000,
    outputTokens: 8192,
    pricing: { input: 0.0, output: 0.0 }, // Free during preview
    logoPath: '/images/gemini.png'
  },
  {
    id: 'gemini-2.0-flash-live-001',
    name: 'Gemini 2.0 Flash Live',
    provider: 'Google',
    capabilities: ['text', 'images', 'video', 'audio', 'live-api', 'bidirectional', 'real-time'],
    bidirectional: true,
    supportsVideo: true,
    supportsAudio: true,
    supportsImages: true,
    supportsScreenShare: true,
    contextWindow: 1000000,
    outputTokens: 8192,
    pricing: { input: 0.0, output: 0.0 }, // Free during preview
    logoPath: '/images/gemini.png'
  },
  {
    id: 'gemini-2.5-flash-preview-native-audio-dialog',
    name: 'Gemini 2.5 Flash Native Audio Dialog',
    provider: 'Google',
    capabilities: ['text', 'images', 'audio', 'live-api', 'bidirectional', 'native-audio'],
    bidirectional: true,
    supportsVideo: false,
    supportsAudio: true,
    supportsImages: true,
    supportsScreenShare: false,
    contextWindow: 1000000,
    outputTokens: 8192,
    pricing: { input: 0.0, output: 0.0 }, // Free during preview
    logoPath: '/images/gemini.png'
  },
  {
    id: 'gemini-2.5-flash-preview-native-audio-dialog-rai-v3',
    name: 'Gemini 2.5 Flash Native Audio Dialog RAI v3',
    provider: 'Google',
    capabilities: ['text', 'images', 'audio', 'live-api', 'bidirectional', 'native-audio', 'rai-v3'],
    bidirectional: true,
    supportsVideo: false,
    supportsAudio: true,
    supportsImages: true,
    supportsScreenShare: false,
    contextWindow: 1000000,
    outputTokens: 8192,
    pricing: { input: 0.0, output: 0.0 }, // Free during preview
    logoPath: '/images/gemini.png'
  },
  {
    id: 'gemini-2.5-flash-exp-native-audio-thinking-dialog',
    name: 'Gemini 2.5 Flash Experimental Native Audio Thinking Dialog',
    provider: 'Google',
    capabilities: ['text', 'images', 'audio', 'live-api', 'bidirectional', 'native-audio', 'thinking'],
    bidirectional: true,
    supportsVideo: false,
    supportsAudio: true,
    supportsImages: true,
    supportsScreenShare: false,
    contextWindow: 1000000,
    outputTokens: 8192,
    pricing: { input: 0.0, output: 0.0 }, // Free during preview
    logoPath: '/images/gemini.png'
  }
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  modelId?: string;
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
  }[];
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: string;
  response?: string;
  status?: number;
  lastTested?: Date;
}

interface PivotBoard {
  id: string;
  name: string;
  urls: {
    url: string;
    scraped: boolean;
    subUrls: string[];
    selected: boolean;
  }[];
  agents: {
    id: string;
    name: string;
    status: 'idle' | 'working' | 'complete' | 'error';
    currentTask: string;
    progress: number;
  }[];
}

export default function LiveAPIStudio() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [pivotBoards, setPivotBoards] = useState<PivotBoard[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'api' | 'pivot' | 'memory'>('chat');
  const [memoryContext, setMemoryContext] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [screenShare, setScreenShare] = useState(false);

  // Persistent memory with Mem0 integration
  useEffect(() => {
    // Load persistent context from Mem0
    loadMemoryContext();
  }, []);

  const loadMemoryContext = async () => {
    try {
      // This would integrate with Mem0 API
      const response = await fetch('/api/memory/context', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const context = await response.json();
      setMemoryContext(context);
    } catch (error) {
      console.error('Failed to load memory context:', error);
    }
  };

  const saveToMemory = async (message: ChatMessage) => {
    try {
      // Save to Mem0 for persistent context
      await fetch('/api/memory/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          modelId: selectedModel.id,
          timestamp: new Date(),
          context: memoryContext
        })
      });
    } catch (error) {
      console.error('Failed to save to memory:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsStreaming(true);

    // Save to persistent memory
    await saveToMemory(userMessage);

    try {
      // Send to selected AI model with persistent context
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          modelId: selectedModel.id,
          context: memoryContext,
          history: chatMessages.slice(-10) // Last 10 messages for context
        })
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '', // Will be streamed
        timestamp: new Date(),
        modelId: selectedModel.id
      };

      setChatMessages(prev => [...prev, assistantMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setChatMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }

      // Save assistant response to memory
      await saveToMemory(assistantMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  const createPivotBoard = () => {
    const newBoard: PivotBoard = {
      id: Date.now().toString(),
      name: `Pivot Board ${pivotBoards.length + 1}`,
      urls: [],
      agents: [
        {
          id: 'scout-1',
          name: 'Scout Commander',
          status: 'idle',
          currentTask: 'Waiting for URLs',
          progress: 0
        },
        {
          id: 'workspace-1',
          name: 'Workspace Agent',
          status: 'idle',
          currentTask: 'Ready to assist',
          progress: 0
        }
      ]
    };
    setPivotBoards(prev => [...prev, newBoard]);
  };

  const addUrlToPivot = (boardId: string, url: string) => {
    setPivotBoards(prev => 
      prev.map(board => 
        board.id === boardId 
          ? {
              ...board,
              urls: [...board.urls, {
                url,
                scraped: false,
                subUrls: [],
                selected: true
              }]
            }
          : board
      )
    );
  };

  const scrapeUrl = async (boardId: string, url: string) => {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const { subUrls } = await response.json();
      
      setPivotBoards(prev => 
        prev.map(board => 
          board.id === boardId 
            ? {
                ...board,
                urls: board.urls.map(urlObj => 
                  urlObj.url === url 
                    ? { ...urlObj, scraped: true, subUrls }
                    : urlObj
                )
              }
            : board
        )
      );
    } catch (error) {
      console.error('Failed to scrape URL:', error);
    }
  };

  const ModelSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Select AI Model</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AI_MODELS.map((model) => (
          <motion.div
            key={model.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedModel(model)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedModel.id === model.id
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-purple-500/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {model.logoPath && (
                <img src={model.logoPath} alt={model.name} className="w-8 h-8 object-contain" />
              )}
              <div>
                <h4 className="font-semibold text-white">{model.name}</h4>
                <p className="text-sm text-gray-400">{model.provider}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {model.capabilities.slice(0, 3).map((cap) => (
                <span key={cap} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  {cap}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {model.supportsVideo && <Video className="w-4 h-4" />}
              {model.supportsAudio && <Mic className="w-4 h-4" />}
              {model.supportsImages && <Image className="w-4 h-4" />}
              {model.supportsScreenShare && <Monitor className="w-4 h-4" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ChatInterface = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-xl ${
              message.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {message.role === 'assistant' && message.modelId && (
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {AI_MODELS.find(m => m.id === message.modelId)?.name}
                    </span>
                  </div>
                )}
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}
        
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-lg transition-colors ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={!selectedModel.supportsAudio}
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setScreenShare(!screenShare)}
            className={`p-2 rounded-lg transition-colors ${
              screenShare ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={!selectedModel.supportsScreenShare}
          >
            <Monitor className="w-4 h-4" />
          </button>
          
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
          </label>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !currentMessage.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const PivotBoardInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Multi-Use Pivot Planner</h3>
        <button
          onClick={createPivotBoard}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Board
        </button>
      </div>
      
      {pivotBoards.map((board) => (
        <div key={board.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h4 className="font-semibold text-white mb-4">{board.name}</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL Scraping Section */}
            <div>
              <h5 className="font-medium text-gray-300 mb-3">URL Scraping</h5>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter URL to scrape..."
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addUrlToPivot(board.id, input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                    Add
                  </button>
                </div>
                
                {board.urls.map((urlObj, index) => (
                  <div key={index} className="bg-gray-700/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 truncate">{urlObj.url}</span>
                      <button
                        onClick={() => scrapeUrl(board.id, urlObj.url)}
                        disabled={urlObj.scraped}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                      >
                        {urlObj.scraped ? 'Scraped' : 'Scrape'}
                      </button>
                    </div>
                    
                    {urlObj.scraped && urlObj.subUrls.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Sub URLs found:</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {urlObj.subUrls.map((subUrl, subIndex) => (
                            <label key={subIndex} className="flex items-center gap-2 text-xs">
                              <input type="checkbox" className="rounded" />
                              <span className="text-gray-300 truncate">{subUrl}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Agent Status Section */}
            <div>
              <h5 className="font-medium text-gray-300 mb-3">Agent Status</h5>
              <div className="space-y-3">
                {board.agents.map((agent) => (
                  <div key={agent.id} className="bg-gray-700/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{agent.name}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        agent.status === 'idle' ? 'bg-gray-600 text-gray-300' :
                        agent.status === 'working' ? 'bg-blue-600 text-white' :
                        agent.status === 'complete' ? 'bg-green-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{agent.currentTask}</p>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${agent.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🚀 Live API Studio
              </h1>
              <p className="text-gray-300 mt-1">
                World's first persistent AI development studio with Mem0 integration
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Database className="w-4 h-4" />
                <span>Persistent Memory Active</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <ModelSelector />
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-800/50 rounded-lg p-1">
          {[
            { id: 'chat', name: 'AI Chat', icon: MessageSquare },
            { id: 'api', name: 'API Testing', icon: Code },
            { id: 'pivot', name: 'Pivot Planner', icon: Layers },
            { id: 'memory', name: 'Memory Context', icon: Database }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 h-[70vh]">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'pivot' && <PivotBoardInterface />}
          {activeTab === 'api' && (
            <div className="p-8 text-center text-gray-400">
              <Terminal className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">API Testing Interface</h3>
              <p>Coming soon - Test and debug APIs with AI assistance</p>
            </div>
          )}
          {activeTab === 'memory' && (
            <div className="p-8 text-center text-gray-400">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Memory Context</h3>
              <p>View and manage persistent conversation context</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}