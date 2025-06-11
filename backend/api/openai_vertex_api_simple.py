"""
🤖 OpenAI via Vertex AI Model Garden API (Simplified)
Flask API blueprint for accessing OpenAI models through Google Cloud
"""

from flask import Blueprint, request, jsonify
import asyncio
import logging
import time
from typing import Dict, Any
from services.openai_vertex_service_simple import create_openai_vertex_service

logger = logging.getLogger(__name__)

# Create Blueprint
openai_vertex_bp = Blueprint('openai_vertex', __name__)

# Global service instance
openai_vertex_service = None

async def get_service():
    """Get or create the OpenAI Vertex service"""
    global openai_vertex_service
    if openai_vertex_service is None:
        openai_vertex_service = create_openai_vertex_service()
    return openai_vertex_service

@openai_vertex_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for OpenAI Vertex service"""
    try:
        return jsonify({
            "success": True,
            "service": "OpenAI via Vertex AI Model Garden",
            "status": "healthy",
            "timestamp": time.time()
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@openai_vertex_bp.route('/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible chat completions endpoint"""
    try:
        data = request.get_json()
        
        # Extract parameters
        messages = data.get('messages', [])
        model = data.get('model', 'gpt-4o-mini')
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 1000)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        # Run async function in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def _process_request():
            service = await get_service()
            return await service.chat_completion(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                user_id=user_id
            )
        
        response = loop.run_until_complete(_process_request())
        loop.close()
        
        if response.get('success'):
            # Return in OpenAI format
            return jsonify({
                "id": f"chatcmpl-{int(time.time())}",
                "object": "chat.completion",
                "created": int(time.time()),
                "model": response.get('model_used'),
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": response.get('content')
                        },
                        "finish_reason": "stop"
                    }
                ],
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
                "service_info": {
                    "service": response.get('service'),
                    "processing_time_ms": response.get('processing_time_ms'),
                    "sanctuary_note": "🌟 Powered by Podplay Sanctuary's OpenAI-Vertex integration"
                }
            })
        else:
            return jsonify({
                "error": {
                    "message": response.get('error'),
                    "type": "service_error",
                    "code": "service_unavailable"
                }
            }), 500
            
    except Exception as e:
        logger.error(f"Chat completions endpoint error: {e}")
        return jsonify({
            "error": {
                "message": str(e),
                "type": "server_error",
                "code": "internal_error"
            }
        }), 500

@openai_vertex_bp.route('/models', methods=['GET'])
def list_models():
    """List available OpenAI models"""
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def _get_models():
            service = await get_service()
            return service.get_available_models()
        
        models = loop.run_until_complete(_get_models())
        loop.close()
        
        return jsonify({
            "object": "list",
            "data": [
                {
                    "id": model_id,
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "vertex-ai-model-garden",
                    **model_info
                }
                for model_id, model_info in models.items()
            ],
            "sanctuary_note": "🤖 OpenAI models via Google Cloud Vertex AI"
        })
        
    except Exception as e:
        logger.error(f"List models endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@openai_vertex_bp.route('/status', methods=['GET'])
def service_status():
    """Get service status"""
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def _get_status():
            service = await get_service()
            return service.get_service_status()
        
        status = loop.run_until_complete(_get_status())
        loop.close()
        
        return jsonify({
            **status,
            "sanctuary_note": "🌟 Part of Podplay Sanctuary's neurodivergent-friendly AI platform"
        })
        
    except Exception as e:
        logger.error(f"Status endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@openai_vertex_bp.route('/test', methods=['GET'])
def test_service():
    """Test service connectivity"""
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def _test_service():
            service = await get_service()
            return await service.test_connectivity()
        
        test_result = loop.run_until_complete(_test_service())
        loop.close()
        
        return jsonify({
            **test_result,
            "sanctuary_note": "🧪 Testing OpenAI models via Vertex AI Model Garden"
        })
        
    except Exception as e:
        logger.error(f"Test endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

# Integration function for the main Flask app
def integrate_openai_vertex_api(app):
    """Integrate OpenAI Vertex API with Flask application"""
    try:
        app.register_blueprint(openai_vertex_bp, url_prefix='/api/openai-vertex')
        logger.info("✅ OpenAI Vertex AI API registered at /api/openai-vertex/*")
        return True
    except Exception as e:
        logger.error(f"Failed to integrate OpenAI Vertex API: {e}")
        return False
