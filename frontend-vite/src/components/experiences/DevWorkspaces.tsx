import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Plus, 
  Settings, 
  FolderTree,
  Terminal as TerminalIcon,
  Code2,
  Globe,
  X,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Upload,
  MessageCircle,
  User,
  Send,
  Paperclip,
  Brain,
  Folder,
  FileText,
  Cloud
} from 'lucide-react';
import { cn } from '../../utils/cn';
import SmartIframe from '../SmartIframe';

// Types
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
  modified?: boolean;
}

interface OpenTab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  modified: boolean;
  isActive: boolean;
}

interface TerminalSession {
  id: string;
  name: string;
  directory: string;
  isActive: boolean;
  history: string[];
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: string[];
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  framework: string;
  language: string;
  lastAccessed: Date;
  collaborators: number;
  deployment?: {
    url: string;
    status: 'deployed' | 'building' | 'failed';
  };
}

// Mock Data
const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Podplay Sanctuary',
    description: 'Main AI development hub',
    status: 'active',
    framework: 'React + Vite',
    language: 'TypeScript',
    lastAccessed: new Date(),
    collaborators: 3,
    deployment: {
      url: 'https://sanctuary.podplay.dev',
      status: 'deployed'
    }
  },
  {
    id: '2', 
    name: 'Scout AI Agent',
    description: 'AI orchestration system',
    status: 'active',
    framework: 'Python FastAPI',
    language: 'Python',
    lastAccessed: new Date(Date.now() - 3600000),
    collaborators: 2,
    deployment: {
      url: 'https://scout.podplay.dev',
      status: 'building'
    }
  },
  {
    id: '3',
    name: 'MCP Integration',
    description: 'Model Context Protocol server',
    status: 'paused',
    framework: 'Node.js',
    language: 'TypeScript',
    lastAccessed: new Date(Date.now() - 86400000),
    collaborators: 1
  }
];

const mockFileTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        path: '/src/components',
        children: [
          {
            id: '3',
            name: 'Dashboard.tsx',
            type: 'file',
            path: '/src/components/Dashboard.tsx',
            language: 'typescript',
            content: 'import React from "react";\n\nconst Dashboard = () => {\n  return (\n    <div className="dashboard">\n      <h1>Welcome to Podplay Sanctuary</h1>\n    </div>\n  );\n};\n\nexport default Dashboard;',
            modified: true
          },
          {
            id: '4', 
            name: 'Header.tsx',
            type: 'file',
            path: '/src/components/Header.tsx',
            language: 'typescript',
            content: 'import React from "react";\n\nconst Header = () => {\n  return (\n    <header className="header">\n      <nav>Navigation</nav>\n    </header>\n  );\n};\n\nexport default Header;'
          }
        ]
      },
      {
        id: '5',
        name: 'App.tsx',
        type: 'file',
        path: '/src/App.tsx',
        language: 'typescript',
        content: 'import React from "react";\nimport Dashboard from "./components/Dashboard";\n\nfunction App() {\n  return (\n    <div className="App">\n      <Dashboard />\n    </div>\n  );\n}\n\nexport default App;'
      }
    ]
  },
  {
    id: '6',
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    language: 'json',
    content: '{\n  "name": "podplay-sanctuary",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "typescript": "^5.0.0"\n  }\n}'
  }
];

const DevWorkspaces: React.FC = () => {
  // Main state
  const [currentView, setCurrentView] = useState<'dashboard' | 'workspace'>('dashboard');
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  
  // Layout state
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);
  const [showBrowser, setShowBrowser] = useState(false);
  const [showChat, setShowChat] = useState(false);
    // File system state
  const [fileTree] = useState<FileNode[]>(mockFileTree);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2']));
  
  // Terminal state
  const [terminals] = useState<TerminalSession[]>([
    { id: '1', name: 'Terminal 1', directory: '/workspace', isActive: true, history: [] }
  ]);
  const [activeTerminal, setActiveTerminal] = useState<string>('1');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m here to help you with your development workspace. What would you like to build today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // Resize handlers
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);
  const [isDraggingRightPanel, setIsDraggingRightPanel] = useState(false);

  // File operations
  const openFile = useCallback((file: FileNode) => {
    if (file.type === 'folder') return;
    
    const existingTab = openTabs.find(tab => tab.path === file.path);
    if (existingTab) {
      setActiveTab(existingTab.id);
      return;
    }
    
    const newTab: OpenTab = {
      id: file.id,
      name: file.name,
      path: file.path,
      content: file.content || '',
      language: file.language || 'text',
      modified: false,
      isActive: true
    };
    
    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  }, [openTabs]);
  
  const closeTab = useCallback((tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  }, [activeTab, openTabs]);
  
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // Resize logic
  const handleSidebarResize = useCallback((e: MouseEvent) => {
    if (!isDraggingSidebar) return;
    const newWidth = Math.max(200, Math.min(500, e.clientX));
    setSidebarWidth(newWidth);
  }, [isDraggingSidebar]);

  const handleTerminalResize = useCallback((e: MouseEvent) => {
    if (!isDraggingTerminal) return;
    const newHeight = Math.max(150, Math.min(400, window.innerHeight - e.clientY));
    setTerminalHeight(newHeight);
  }, [isDraggingTerminal]);

  const handleRightPanelResize = useCallback((e: MouseEvent) => {
    if (!isDraggingRightPanel) return;
    const newWidth = Math.max(300, Math.min(600, window.innerWidth - e.clientX));
    setRightPanelWidth(newWidth);
  }, [isDraggingRightPanel]);

  useEffect(() => {
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mousemove', handleTerminalResize);
    document.addEventListener('mousemove', handleRightPanelResize);
    document.addEventListener('mouseup', () => {
      setIsDraggingSidebar(false);
      setIsDraggingTerminal(false);
      setIsDraggingRightPanel(false);
    });

    return () => {
      document.removeEventListener('mousemove', handleSidebarResize);
      document.removeEventListener('mousemove', handleTerminalResize);
      document.removeEventListener('mousemove', handleRightPanelResize);
    };
  }, [handleSidebarResize, handleTerminalResize, handleRightPanelResize]);

  // Render workspace dashboard
  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2 flex items-center gap-3"
          >
            <Monitor className="w-10 h-10 text-purple-400" />
            Development Workspaces
          </motion.h1>
          <p className="text-gray-300 text-lg">
            Create, manage, and collaborate on your development projects
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Plus, label: 'New Workspace', color: 'bg-green-600' },
            { icon: Upload, label: 'Import Project', color: 'bg-blue-600' },
            { icon: GitBranch, label: 'Clone Repository', color: 'bg-purple-600' },
            { icon: Cloud, label: 'Browse Templates', color: 'bg-orange-600' }
          ].map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${action.color} hover:opacity-90 rounded-xl p-6 cursor-pointer transition-all duration-300 group`}
            >
              <action.icon className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold">{action.label}</h3>
            </motion.div>
          ))}
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWorkspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedWorkspace(workspace);
                setCurrentView('workspace');
              }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            >
              {/* Status indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-3 h-3 rounded-full ${
                  workspace.status === 'active' ? 'bg-green-400' :
                  workspace.status === 'paused' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{workspace.collaborators}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {workspace.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {workspace.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                  {workspace.framework}
                </span>
                <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">
                  {workspace.language}
                </span>
              </div>

              {/* Deployment status */}
              {workspace.deployment && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span className={
                    workspace.deployment.status === 'deployed' ? 'text-green-400' :
                    workspace.deployment.status === 'building' ? 'text-yellow-400' : 'text-red-400'
                  }>
                    {workspace.deployment.status}
                  </span>
                </div>
              )}              {/* Last accessed */}
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
                Last accessed {new Date(workspace.lastAccessed).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render file tree recursively
  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div 
          className={cn(
            "flex items-center gap-2 px-2 py-1 hover:bg-white/10 cursor-pointer rounded transition-colors text-sm",
            activeTab === node.id && "bg-purple-600/30"
          )}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              openFile(node);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.id) ? 
                <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                <ChevronRight className="w-4 h-4 text-gray-400" />
              }
              <Folder className="w-4 h-4 text-blue-400" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <FileText className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className={cn(
            "text-gray-200",
            node.modified && "text-orange-400"
          )}>
            {node.name}
            {node.modified && ' •'}
          </span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
          <div>
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Render workspace interface
  const renderWorkspace = () => (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top toolbar */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">{selectedWorkspace?.name}</span>
            <div className={`w-2 h-2 rounded-full ${
              selectedWorkspace?.status === 'active' ? 'bg-green-400' :
              selectedWorkspace?.status === 'paused' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "p-2 rounded hover:bg-gray-700 transition-colors",
              showChat ? "text-purple-400" : "text-gray-400"
            )}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowBrowser(true)}
            className="p-2 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Left sidebar - File Explorer */}
        <div 
          className="bg-gray-800 border-r border-gray-700 flex flex-col"
          style={{ width: sidebarWidth }}
        >
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Explorer
            </h3>
          </div>
          <div className="flex-1 p-2 overflow-y-auto">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Sidebar resize handle */}
        <div
          className="w-1 bg-gray-700 hover:bg-purple-600 cursor-col-resize transition-colors"
          onMouseDown={() => setIsDraggingSidebar(true)}
        />

        {/* Main editor area */}
        <div className="flex-1 flex flex-col">
          {/* Tab bar */}
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-2 overflow-x-auto">
            {openTabs.map(tab => (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-t text-sm border-b-2 cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-gray-900 text-white border-purple-400" 
                    : "text-gray-400 hover:text-white border-transparent hover:bg-gray-700"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <FileText className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.modified && <span className="text-orange-400">•</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="ml-2 text-gray-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Editor content */}
          <div className="flex-1 bg-gray-900">
            {activeTab ? (
              <div className="h-full p-4">
                <div className="bg-gray-800 rounded h-full p-4 font-mono text-sm text-gray-300 overflow-auto">
                  <pre className="whitespace-pre-wrap">
                    {openTabs.find(tab => tab.id === activeTab)?.content || '// Select a file to edit'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Open a file to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Terminal area */}
          <AnimatePresence>
            {!terminalCollapsed && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: terminalHeight }}
                exit={{ height: 0 }}
                className="bg-black border-t border-gray-700 flex flex-col"
              >
                {/* Terminal resize handle */}
                <div
                  className="h-1 bg-gray-700 hover:bg-purple-600 cursor-row-resize transition-colors"
                  onMouseDown={() => setIsDraggingTerminal(true)}
                />
                
                {/* Terminal tabs */}
                <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    {terminals.map(terminal => (
                      <button
                        key={terminal.id}
                        onClick={() => setActiveTerminal(terminal.id)}
                        className={cn(
                          "px-3 py-1 rounded text-sm transition-colors",
                          activeTerminal === terminal.id
                            ? "bg-black text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        )}
                      >
                        <TerminalIcon className="w-4 h-4 inline mr-2" />
                        {terminal.name}
                      </button>
                    ))}
                    <button className="p-1 text-gray-400 hover:text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setTerminalCollapsed(true)}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>                {/* Terminal content */}
                <div className="flex-1 p-4 text-green-400 font-mono text-sm overflow-auto">
                  <div className="mb-2">
                    <span className="text-blue-400">~/workspace $</span> npm run dev
                  </div>
                  <div className="text-gray-400 mb-2">
                    &gt; podplay-sanctuary@1.0.0 dev<br/>
                    &gt; vite
                  </div>
                  <div className="text-green-400 mb-2">
                    ✓ Ready in 524ms<br/>
                    ➜ Local: http://localhost:5173/<br/>
                    ➜ Network: use --host to expose
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-400">~/workspace $</span>
                    <span className="ml-2 bg-gray-800 text-white px-1">_</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal toggle button */}
          {terminalCollapsed && (
            <button
              onClick={() => setTerminalCollapsed(false)}
              className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <TerminalIcon className="w-4 h-4 mr-2" />
              Show Terminal
            </button>
          )}
        </div>

        {/* Right panel - Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: rightPanelWidth }}
              exit={{ width: 0 }}
              className="bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              {/* Right panel resize handle */}
              <div
                className="w-1 bg-gray-700 hover:bg-purple-600 cursor-col-resize transition-colors absolute left-0 top-0 h-full"
                onMouseDown={() => setIsDraggingRightPanel(true)}
              />

              {/* Chat header */}
              <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-white font-medium text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Mama Bear Assistant
                </h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {chatMessages.map(message => (
                  <div key={message.id} className={cn(
                    "mb-4 flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-lg",
                      message.sender === 'user' 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-700 text-gray-200"
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Mama Bear for help..."
                    className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatInput.trim()) {
                        setChatMessages(prev => [...prev, {
                          id: Date.now().toString(),
                          content: chatInput,
                          sender: 'user',
                          timestamp: new Date()
                        }]);
                        setChatInput('');
                      }
                    }}
                  />
                  <button className="p-2 text-gray-400 hover:text-white">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Browser Modal */}
      <AnimatePresence>
        {showBrowser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowBrowser(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg w-[90vw] h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Browser header */}
              <div className="h-12 bg-gray-900 rounded-t-lg flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="ml-4 bg-gray-700 rounded px-3 py-1 text-gray-300 text-sm">
                    {selectedWorkspace?.deployment?.url || 'http://localhost:5173'}
                  </div>
                </div>
                <button
                  onClick={() => setShowBrowser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Browser content */}
              <div className="flex-1 rounded-b-lg overflow-hidden">
                <SmartIframe
                  src={selectedWorkspace?.deployment?.url || 'http://localhost:5173'}
                  title={`${selectedWorkspace?.name} Preview`}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return currentView === 'dashboard' ? renderDashboard() : renderWorkspace();
};

export default DevWorkspaces;
