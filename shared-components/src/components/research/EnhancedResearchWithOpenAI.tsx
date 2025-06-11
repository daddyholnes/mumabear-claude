"""
🔗 Deep Research Library + OpenAI Vertex Integration Example
Shows how to use the enhanced Deep Research Library with OpenAI models via Vertex AI
"""

import React, { useState, useEffect } from 'react';
import { DeepResearchLibrary } from '../path/to/DeepResearchLibrary';

interface OpenAIVertexConfig {
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface ResearchResult {
  id: string;
  query: string;
  results: Array<{
    title: string;
    content: string;
    source: string;
    relevance: number;
  }>;
  analysis: string;
  model_used: string;
  service: string;
  processing_time_ms: number;
  cost_estimate: number;
}

export const EnhancedResearchWithOpenAI: React.FC = () => {
  const [openaiConfig, setOpenaiConfig] = useState<OpenAIVertexConfig>({
    baseURL: 'http://localhost:5001/api/openai-vertex',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000
  });
  
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<any>(null);

  // Check OpenAI Vertex service status on mount
  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    try {
      const response = await fetch(`${openaiConfig.baseURL}/status`);
      const status = await response.json();
      setServiceStatus(status);
    } catch (error) {
      console.error('Failed to check service status:', error);
    }
  };

  const analyzeResearchWithOpenAI = async (query: string, context: string): Promise<string> => {
    try {
      const response = await fetch(`${openaiConfig.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': 'research-library-user'
        },
        body: JSON.stringify({
          model: openaiConfig.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert research analyst. Analyze the provided research context and provide insights, conclusions, and recommendations. Focus on:
              1. Key findings and patterns
              2. Gaps in the research
              3. Actionable insights
              4. Areas for further investigation
              
              Be comprehensive but concise, and structure your analysis clearly.`
            },
            {
              role: 'user',
              content: `Research Query: "${query}"
              
              Research Context:
              ${context}
              
              Please provide a thorough analysis of this research.`
            }
          ],
          temperature: openaiConfig.temperature,
          max_tokens: openaiConfig.maxTokens
        })
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]) {
        return result.choices[0].message.content;
      } else {
        throw new Error('Invalid response from OpenAI service');
      }
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const handleResearchComplete = async (researchData: any) => {
    setIsLoading(true);
    
    try {
      // Combine all research results into context
      const context = researchData.results
        .map((result: any) => `Source: ${result.source}\nContent: ${result.content}`)
        .join('\n\n');

      // Get AI analysis using OpenAI via Vertex AI
      const analysis = await analyzeResearchWithOpenAI(researchData.query, context);

      // Create enhanced research result
      const enhancedResult: ResearchResult = {
        id: `research_${Date.now()}`,
        query: researchData.query,
        results: researchData.results,
        analysis: analysis,
        model_used: openaiConfig.model,
        service: 'openai_vertex',
        processing_time_ms: Date.now() - researchData.startTime,
        cost_estimate: 0.001 // Placeholder - would be calculated by the service
      };

      setResearchResults(prev => [enhancedResult, ...prev]);
    } catch (error) {
      console.error('Failed to process research:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportResearchWithAnalysis = async (format: 'markdown' | 'json' | 'pdf') => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        service_info: {
          openai_model: openaiConfig.model,
          service: 'OpenAI via Vertex AI Model Garden'
        },
        research_sessions: researchResults.map(result => ({
          query: result.query,
          analysis: result.analysis,
          results: result.results,
          metadata: {
            model_used: result.model_used,
            service: result.service,
            processing_time_ms: result.processing_time_ms,
            cost_estimate: result.cost_estimate
          }
        }))
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research_with_ai_analysis_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'markdown') {
        let markdown = `# Research Analysis Report\n\n`;
        markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
        markdown += `**AI Model:** ${openaiConfig.model} (via Vertex AI)\n\n`;
        
        exportData.research_sessions.forEach((session, index) => {
          markdown += `## Research Session ${index + 1}\n\n`;
          markdown += `**Query:** ${session.query}\n\n`;
          markdown += `### AI Analysis\n\n${session.analysis}\n\n`;
          markdown += `### Research Results\n\n`;
          
          session.results.forEach((result: any, resultIndex: number) => {
            markdown += `#### Result ${resultIndex + 1}: ${result.title}\n\n`;
            markdown += `**Source:** ${result.source}\n\n`;
            markdown += `${result.content}\n\n`;
          });
          
          markdown += `### Metadata\n\n`;
          markdown += `- **Model:** ${session.metadata.model_used}\n`;
          markdown += `- **Service:** ${session.metadata.service}\n`;
          markdown += `- **Processing Time:** ${session.metadata.processing_time_ms}ms\n`;
          markdown += `- **Cost Estimate:** $${session.metadata.cost_estimate}\n\n`;
          markdown += `---\n\n`;
        });

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research_analysis_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="enhanced-research-container">
      {/* Service Status Panel */}
      <div className="service-status-panel mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🤖 OpenAI via Vertex AI Status</h3>
        {serviceStatus ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded ${
                serviceStatus.status === 'operational' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {serviceStatus.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Project:</span>
              <span className="ml-2">{serviceStatus.project_id}</span>
            </div>
            <div>
              <span className="font-medium">Models Available:</span>
              <span className="ml-2">{serviceStatus.available_models}</span>
            </div>
            <div>
              <span className="font-medium">Total Requests:</span>
              <span className="ml-2">{serviceStatus.metrics?.total_requests || 0}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading service status...</p>
        )}
      </div>

      {/* OpenAI Configuration Panel */}
      <div className="config-panel mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">⚙️ AI Analysis Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <select
              value={openaiConfig.model}
              onChange={(e) => setOpenaiConfig(prev => ({ ...prev, model: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost-Effective)</option>
              <option value="gpt-4o">GPT-4o (Balanced)</option>
              <option value="gpt-4">GPT-4 (Highest Quality)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (Fast & High Quality)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={openaiConfig.temperature}
              onChange={(e) => setOpenaiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-xs text-gray-600">{openaiConfig.temperature}</span>
          </div>
        </div>
      </div>

      {/* Deep Research Library Component */}
      <DeepResearchLibrary
        onResearchComplete={handleResearchComplete}
        enhancedMode={true}
        aiAnalysisEnabled={true}
      />

      {/* Research Results with AI Analysis */}
      {researchResults.length > 0 && (
        <div className="research-results mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">🔬 Research Results with AI Analysis</h3>
            <div className="space-x-2">
              <button
                onClick={() => exportResearchWithAnalysis('markdown')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export as Markdown
              </button>
              <button
                onClick={() => exportResearchWithAnalysis('json')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export as JSON
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {researchResults.map((result) => (
              <div key={result.id} className="research-result p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Query: {result.query}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <span>🤖 {result.model_used}</span>
                    <span>⚡ {result.processing_time_ms}ms</span>
                    <span>💰 ${result.cost_estimate.toFixed(4)}</span>
                    <span>📊 {result.results.length} sources</span>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="ai-analysis mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <h5 className="text-md font-semibold text-purple-800 mb-2">
                    🧠 AI Analysis
                  </h5>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {result.analysis}
                  </div>
                </div>

                {/* Research Sources */}
                <div className="research-sources">
                  <h5 className="text-md font-semibold text-gray-800 mb-2">
                    📚 Research Sources
                  </h5>
                  <div className="grid gap-3">
                    {result.results.map((source, index) => (
                      <div key={index} className="source p-3 bg-gray-50 rounded border-l-4 border-blue-400">
                        <div className="font-medium text-gray-800">{source.title}</div>
                        <div className="text-sm text-gray-600 mb-2">{source.source}</div>
                        <div className="text-gray-700">{source.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Analyzing research with OpenAI...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedResearchWithOpenAI;
