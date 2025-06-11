// Expandable Mama Bear Chat Widget
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  toggleWidget, 
  setWidgetPosition, 
  addMessage, 
  setTyping,
  setActiveConversation,
  clearConversation 
} from '../store/chatSlice';
import { MessageCircle, X, Send, Minimize2, Maximize2, Trash2, Settings } from 'lucide-react';

const ChatWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    widgetExpanded, 
    widgetPosition, 
    conversations, 
    activeConversationId,
    isTyping,
    connectionStatus 
  } = useSelector((state: RootState) => state.chat);
  const { currentTheme, themes } = useSelector((state: RootState) => state.theme);
  const theme = themes[currentTheme];

  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = activeConversationId ? conversations[activeConversationId] : null;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  // Handle drag functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        dispatch(setWidgetPosition({ x: e.clientX - 150, y: e.clientY - 25 }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dispatch]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId) return;

    // Add user message
    dispatch(addMessage({
      conversationId: activeConversationId,
      message: {
        content: message,
        sender: 'user',
        type: 'text',
      }
    }));

    // Simulate Mama Bear typing
    dispatch(setTyping(true));
    setMessage('');

    // Simulate AI response (in real app, this would be an API call)
    setTimeout(() => {
      dispatch(addMessage({
        conversationId: activeConversationId,
        message: {
          content: `Hi there! I'm Mama Bear, your caring AI development partner. I understand you're working on something amazing. How can I help you today? 🐻💜`,
          sender: 'mama-bear',
          type: 'text',
        }
      }));
      dispatch(setTyping(false));
    }, 1500);
  };

  const handleClearConversation = () => {
    if (activeConversationId) {
      dispatch(clearConversation(activeConversationId));
    }
  };

  if (!widgetExpanded) {
    // Collapsed widget - floating button
    return (
      <div
        className={`fixed z-50 ${theme.effects.blur ? 'bg-purple-600/80 backdrop-blur-md' : 'bg-purple-600'} hover:bg-purple-700 text-white rounded-full p-4 cursor-pointer transition-all duration-300 shadow-lg`}
        style={{ left: widgetPosition.x, top: widgetPosition.y }}
        onClick={() => dispatch(toggleWidget())}
        onMouseDown={() => setIsDragging(true)}
      >
        <MessageCircle className="w-6 h-6" />
        {connectionStatus === 'connected' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
        )}
      </div>
    );
  }

  // Expanded widget - full chat interface
  return (
    <div
      className={`fixed z-50 ${theme.effects.blur ? 'bg-white/10 backdrop-blur-md' : 'bg-gray-900'} rounded-2xl border border-white/20 shadow-2xl`}
      style={{ 
        left: widgetPosition.x, 
        top: widgetPosition.y,
        width: '400px',
        height: '500px',
      }}
    >
      {/* Header */}
      <div 
        ref={dragRef}
        className={`flex items-center justify-between p-4 border-b border-white/20 cursor-move ${theme.colors.text}`}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold">Mama Bear Chat</h3>
          <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearConversation}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(toggleWidget())}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: '350px' }}>
        {activeConversation?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : `${theme.effects.blur ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-800'} ${theme.colors.text} border border-white/20`
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className={`${theme.effects.blur ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-800'} ${theme.colors.text} border border-white/20 p-3 rounded-2xl`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Mama Bear anything..."
            className={`flex-1 ${theme.effects.blur ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-800'} ${theme.colors.text} border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
