"""
🚀 OpenAI Vertex Service Demo
Demonstrates the OpenAI via Vertex AI Model Garden integration
"""

import asyncio
import sys
import os
import json
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(backend_dir / '.env')

from flask import Flask, jsonify
from flask_cors import CORS
from api.openai_vertex_api_simple import integrate_openai_vertex_api

def create_demo_app():
    """Create a minimal Flask app for OpenAI Vertex demo"""
    app = Flask(__name__)
    CORS(app)
    
    # Register OpenAI Vertex API
    integrate_openai_vertex_api(app)
    
    @app.route('/')
    def home():
        return jsonify({
            "service": "OpenAI via Vertex AI Model Garden Demo",
            "status": "operational",
            "endpoints": {
                "health": "/api/openai-vertex/health",
                "chat": "/api/openai-vertex/chat/completions", 
                "models": "/api/openai-vertex/models",
                "status": "/api/openai-vertex/status",
                "test": "/api/openai-vertex/test"
            },
            "demo_note": "🤖 Demonstrating OpenAI models via Google Cloud Vertex AI"
        })
    
    @app.route('/demo')
    def demo():
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>OpenAI via Vertex AI Demo</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
                .method { color: #28a745; font-weight: bold; }
                button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
                button:hover { background: #0056b3; }
                #results { background: #f8f9fa; padding: 15px; margin-top: 20px; border-radius: 5px; white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 OpenAI via Vertex AI Model Garden Demo</h1>
                <p>This demo shows how to access OpenAI models through Google Cloud's Vertex AI infrastructure.</p>
                
                <h2>Available Endpoints</h2>
                
                <div class="endpoint">
                    <strong><span class="method">GET</span> /api/openai-vertex/health</strong>
                    <p>Health check for the service</p>
                    <button onclick="testEndpoint('/api/openai-vertex/health')">Test Health</button>
                </div>
                
                <div class="endpoint">
                    <strong><span class="method">GET</span> /api/openai-vertex/status</strong>
                    <p>Get detailed service status and metrics</p>
                    <button onclick="testEndpoint('/api/openai-vertex/status')">Test Status</button>
                </div>
                
                <div class="endpoint">
                    <strong><span class="method">GET</span> /api/openai-vertex/models</strong>
                    <p>List available OpenAI models</p>
                    <button onclick="testEndpoint('/api/openai-vertex/models')">List Models</button>
                </div>
                
                <div class="endpoint">
                    <strong><span class="method">GET</span> /api/openai-vertex/test</strong>
                    <p>Test connectivity to Vertex AI</p>
                    <button onclick="testEndpoint('/api/openai-vertex/test')">Test Connectivity</button>
                </div>
                
                <div class="endpoint">
                    <strong><span class="method">POST</span> /api/openai-vertex/chat/completions</strong>
                    <p>OpenAI-compatible chat completions</p>
                    <button onclick="testChat()">Test Chat</button>
                </div>
                
                <h2>Results</h2>
                <div id="results">Click any button above to test the endpoints...</div>
            </div>
            
            <script>
                async function testEndpoint(url) {
                    const results = document.getElementById('results');
                    results.textContent = 'Loading...';
                    
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        results.textContent = JSON.stringify(data, null, 2);
                    } catch (error) {
                        results.textContent = 'Error: ' + error.message;
                    }
                }
                
                async function testChat() {
                    const results = document.getElementById('results');
                    results.textContent = 'Sending chat request...';
                    
                    try {
                        const response = await fetch('/api/openai-vertex/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-User-ID': 'demo-user'
                            },
                            body: JSON.stringify({
                                model: 'gpt-4o-mini',
                                messages: [
                                    {
                                        role: 'system',
                                        content: 'You are a helpful AI assistant demonstrating the OpenAI via Vertex AI integration.'
                                    },
                                    {
                                        role: 'user',
                                        content: 'Hello! Can you explain what you are and how you work?'
                                    }
                                ],
                                temperature: 0.7,
                                max_tokens: 200
                            })
                        });
                        
                        const data = await response.json();
                        results.textContent = JSON.stringify(data, null, 2);
                    } catch (error) {
                        results.textContent = 'Error: ' + error.message;
                    }
                }
            </script>
        </body>
        </html>
        """
    
    return app

if __name__ == '__main__':
    print("🚀 Starting OpenAI via Vertex AI Model Garden Demo")
    print("=" * 60)
    
    app = create_demo_app()
    
    print("✅ Demo server starting on http://localhost:5002")
    print("📖 Visit http://localhost:5002/demo for interactive testing")
    print("🔗 API endpoints available at /api/openai-vertex/*")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5002, debug=True)
