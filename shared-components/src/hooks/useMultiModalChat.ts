"use client";

import { useState, useEffect, useCallback } from 'react';

export interface AIFriend {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  customAvatar?: string;
  online: boolean;
  typing: boolean;
  tokenCount: number;
  pricePerMinute: number;
  usage: number;
  description: string;
  capabilities: string[];
  lastActive: string;
  personality: string;
  memoryEnabled: boolean;
  voiceId?: string;
  provider: "openai" | "anthropic" | "google" | "meta" | "custom";
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "image" | "file" | "audio" | "video";
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  aiModel?: string;
  reactions?: string[];
  edited?: boolean;
  replyTo?: string;
}

export interface ChatStats {
  totalFriends: number;
  onlineFriends: number;
  providerBreakdown: Record<string, number>;
  totalUsage: number;
  averageUsage: number;
  totalConversations: number;
  totalMessages: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function useMultiModalChat() {
  const [friends, setFriends] = useState<AIFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load AI friends
  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/chat/friends`);
      const data = await response.json();

      if (data.success) {
        setFriends(data.friends);
      } else {
        setError(data.error || 'Failed to load AI friends');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize the chat service with API keys
  const initializeChatService = useCallback(async (apiKeys: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/chat/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKeys }),
      });

      const data = await response.json();

      if (data.success) {
        setInitialized(true);
        await loadFriends(); // Load friends after initialization
      } else {
        setError(data.error || 'Failed to initialize chat service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [loadFriends]);

  // Send a message to an AI friend
  const sendMessage = useCallback(async (
    friendId: string,
    message: string,
    files: File[] = [],
    messageType: string = 'text'
  ): Promise<ChatMessage | null> => {
    setError(null);

    try {
      // Upload files if any
      const uploadedFiles = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(`${API_BASE}/api/chat/upload`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          uploadedFiles.push(uploadData.file);
        }
      }

      // Send message
      const response = await fetch(`${API_BASE}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendId,
          message,
          files: uploadedFiles,
          type: messageType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Convert timestamp back to Date object
        const aiMessage: ChatMessage = {
          ...data.response,
          timestamp: new Date(data.response.timestamp),
        };
        return aiMessage;
      } else {
        setError(data.error || 'Failed to send message');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return null;
    }
  }, []);

  // Get conversation history
  const getConversationHistory = useCallback(async (
    friendId: string,
    limit: number = 50
  ): Promise<ChatMessage[]> => {
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/chat/history/${friendId}?limit=${limit}`
      );
      const data = await response.json();

      if (data.success) {
        // Convert timestamps back to Date objects
        return data.history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } else {
        setError(data.error || 'Failed to load conversation history');
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return [];
    }
  }, []);

  // Update AI friend configuration
  const updateFriend = useCallback(async (
    friendId: string,
    updates: Partial<AIFriend>
  ): Promise<boolean> => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/chat/friends/${friendId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        // Update local friends list
        setFriends(prev =>
          prev.map(friend =>
            friend.id === friendId ? { ...friend, ...updates } : friend
          )
        );
        return true;
      } else {
        setError(data.error || 'Failed to update AI friend');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return false;
    }
  }, []);

  // Clear conversation history
  const clearConversationHistory = useCallback(async (friendId: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/chat/history/${friendId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        setError(data.error || 'Failed to clear conversation history');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return false;
    }
  }, []);

  // Set typing status for a friend
  const setTypingStatus = useCallback(async (
    friendId: string,
    typing: boolean
  ): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/chat/typing/${friendId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ typing }),
      });

      // Update local state
      setFriends(prev =>
        prev.map(friend =>
          friend.id === friendId ? { ...friend, typing } : friend
        )
      );
    } catch (err) {
      // Silently fail for typing indicators
      console.warn('Failed to update typing status:', err);
    }
  }, []);

  // Get chat statistics
  const getChatStats = useCallback(async (): Promise<ChatStats | null> => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/chat/stats`);
      const data = await response.json();

      if (data.success) {
        return data.stats;
      } else {
        setError(data.error || 'Failed to load chat statistics');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return null;
    }
  }, []);

  // Check health of the chat service
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch {
      return false;
    }
  }, []);

  // Load friends on mount if not initialized
  useEffect(() => {
    if (!initialized) {
      loadFriends();
    }
  }, [initialized, loadFriends]);

  return {
    // State
    friends,
    loading,
    error,
    initialized,

    // Actions
    initializeChatService,
    loadFriends,
    sendMessage,
    getConversationHistory,
    updateFriend,
    clearConversationHistory,
    setTypingStatus,
    getChatStats,
    checkHealth,

    // Utilities
    clearError: () => setError(null),
  };
}

// Custom hook for managing a single conversation
export function useConversation(friendId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    sendMessage: sendMessageToAPI,
    getConversationHistory,
    clearConversationHistory,
  } = useMultiModalChat();

  // Load conversation history
  const loadHistory = useCallback(async () => {
    if (!friendId) return;

    setLoading(true);
    setError(null);

    try {
      const history = await getConversationHistory(friendId);
      setMessages(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }, [friendId, getConversationHistory]);

  // Send a message
  const sendMessage = useCallback(async (
    message: string,
    files: File[] = [],
    messageType: string = 'text'
  ) => {
    if (!friendId || !message.trim() && files.length === 0) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: messageType as any,
      fileName: files[0]?.name,
      fileSize: files[0] ? `${(files[0].size / 1024 / 1024).toFixed(2)} MB` : undefined,
    };

    setMessages(prev => [...prev, userMessage]);

    // Send to API and get AI response
    const aiResponse = await sendMessageToAPI(friendId, message, files, messageType);
    
    if (aiResponse) {
      setMessages(prev => [...prev, aiResponse]);
    }
  }, [friendId, sendMessageToAPI]);

  // Clear conversation
  const clearConversation = useCallback(async () => {
    if (!friendId) return;

    const success = await clearConversationHistory(friendId);
    if (success) {
      setMessages([]);
    }
  }, [friendId, clearConversationHistory]);

  // Load history when friendId changes
  useEffect(() => {
    if (friendId) {
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [friendId, loadHistory]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    loadHistory,
    clearError: () => setError(null),
  };
}
