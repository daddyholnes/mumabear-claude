import React, { useState, useEffect } from 'react';
import { Book, Search, Brain, Users, MessageSquare, Zap, Clock, FileText } from 'lucide-react';

const LibraryResearchCenter = () => {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('collaborative');
  const [selectedDepth, setSelectedDepth] = useState('standard');
  const [isResearching, setIsResearching] = useState(false);
  const [results, setResults] = useState(null);
  const [streamingUpdates, setStreamingUpdates] = useState([]);

  const researchModes = [
    {
      id: 'claude_only',
      name: 'Claude Research',
      icon: Brain,
      description: 'Like Perplexity - Claude 3.5 models research independently',
      color: 'text-orange-500'
    },
    {
      id: 'gemini_only',
      name: 'Gemini Deep Research',
      icon: Search,
      description: 'Google\'s Deep Research - comprehensive web analysis',
      color: 'text-blue-500'
    },
    {
      id: 'collaborative',
      name: 'Collaborative Research',
      icon: Users,
      description: 'Claude & Gemini research together and share findings',
      color: 'text-purple-500'
    },
    {
      id: 'consensus',
      name: 'Consensus Building',
      icon: MessageSquare,
      description: 'Both research independently, then find consensus',
      color: 'text-green-500'
    },
    {
      id: 'debate',
      name: 'Scholarly Debate',
      icon: Book,
      description: 'AIs debate different perspectives for deeper insights',
      color: 'text-red-500'
    }
  ];

  const researchDepths = [
    { id: 'quick', name: 'Quick', time: '5-10 min', icon: Zap },
    { id: 'standard', name: 'Standard', time: '15-30 min', icon: Clock },
    { id: 'deep', name: 'Deep', time: '30-60 min', icon: FileText },
    { id: 'exhaustive', name: 'Exhaustive', time: '1-2 hours', icon: Brain }
  ];

  const conductResearch = async () => {
    setIsResearching(true);
    setResults(null);
    setStreamingUpdates([]);

    try {
      // For demo - in real app, use your actual API endpoint
      const response = await fetch('/api/library/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          mode: selectedMode,
          depth: selectedDepth,
          user_id: 'demo_user'
        })
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Research failed:', error);
      setResults({ error: 'Research failed. Please try again.' });
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Book className="w-16 h-16 text-purple-300 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              The Library
            </h1>
          </div>
          <p className="text-xl text-purple-200">Deep Research Center - Where Claude & Gemini Collaborate</p>
        </div>

        {/* Research Input */}
        <div className="bg-purple-800/30 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-600/30">
          <div className="mb-6">
            <label className="block text-purple-200 mb-2 text-lg">What would you like to research?</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research question..."
              className="w-full p-4 bg-purple-900/50 border border-purple-600/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-all"
              rows={3}
            />
          </div>

          {/* Research Mode Selection */}
          <div className="mb-6">
            <label className="block text-purple-200 mb-4 text-lg">Research Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {researchModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedMode === mode.id
                        ? 'border-purple-400 bg-purple-700/50'
                        : 'border-purple-600/30 bg-purple-800/30 hover:border-purple-500'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${mode.color} mx-auto mb-2`} />
                    <h3 className="font-semibold mb-1">{mode.name}</h3>
                    <p className="text-xs text-purple-300">{mode.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Research Depth Selection */}
          <div className="mb-8">
            <label className="block text-purple-200 mb-4 text-lg">Research Depth</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {researchDepths.map((depth) => {
                const Icon = depth.icon;
                return (
                  <button
                    key={depth.id}
                    onClick={() => setSelectedDepth(depth.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDepth === depth.id
                        ? 'border-purple-400 bg-purple-700/50'
                        : 'border-purple-600/30 bg-purple-800/30 hover:border-purple-500'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                    <h3 className="font-semibold">{depth.name}</h3>
                    <p className="text-xs text-purple-400">{depth.time}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Research Button */}
          <button
            onClick={conductResearch}
            disabled={!query || isResearching}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResearching ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Conducting Research...
              </span>
            ) : (
              'Start Research'
            )}
          </button>
        </div>

        {/* Streaming Updates */}
        {isResearching && streamingUpdates.length > 0 && (
          <div className="bg-purple-800/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-purple-600/30">
            <h3 className="text-xl font-semibold mb-4">Research Progress</h3>
            <div className="space-y-2">
              {streamingUpdates.map((update, index) => (
                <div key={index} className="flex items-center text-purple-200">
                  <div className="animate-pulse w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  {update.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && !results.error && (
          <div className="bg-purple-800/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-600/30">
            <h2 className="text-2xl font-bold mb-6">Research Results</h2>
            
            {/* Collaborative Mode Results */}
            {selectedMode === 'collaborative' && results.data?.result && (
              <div className="space-y-6">
                {/* Independent Findings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-900/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-orange-400 mb-3">Claude's Research</h3>
                    <p className="text-purple-200 line-clamp-6">
                      {results.data.result.independent_findings?.claude?.content || 'Claude research pending...'}
                    </p>
                  </div>
                  <div className="bg-purple-900/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Gemini's Research</h3>
                    <p className="text-purple-200 line-clamp-6">
                      {results.data.result.independent_findings?.gemini?.content || 'Gemini research pending...'}
                    </p>
                  </div>
                </div>

                {/* Collaborative Synthesis */}
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Collaborative Synthesis
                  </h3>
                  <p className="text-purple-100">
                    {results.data.result.collaborative_synthesis?.synthesis || 'Synthesis pending...'}
                  </p>
                </div>
              </div>
            )}

            {/* Other modes would display their specific results format */}
            {selectedMode !== 'collaborative' && (
              <div className="bg-purple-900/50 p-6 rounded-xl">
                <pre className="text-purple-200 whitespace-pre-wrap">
                  {JSON.stringify(results.data?.result, null, 2)}
                </pre>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-6 pt-6 border-t border-purple-600/30">
              <div className="flex flex-wrap gap-4 text-sm text-purple-300">
                <span>Mode: {selectedMode}</span>
                <span>Depth: {selectedDepth}</span>
                <span>Duration: {results.data?.metadata?.duration_seconds}s</span>
                <span>Session: {results.data?.session_id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {results && results.error && (
          <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-red-600/30">
            <p className="text-red-300">{results.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryResearchCenter;