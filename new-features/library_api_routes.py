"""
🏛️ Library API Routes - Deep Research Center
Flask API endpoints for the collaborative Claude-Gemini research system
"""

from flask import Blueprint, request, jsonify, Response
import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, Any
import uuid

from ..services.deep_research_center import (
    LibrarySection, 
    ResearchMode, 
    ResearchDepth,
    DeepResearchCenter
)

logger = logging.getLogger(__name__)

# Create Blueprint
library_bp = Blueprint('library', __name__, url_prefix='/api/library')

# Global library instance
library_section = None

def init_library_section(app):
    """Initialize the Library section with API keys"""
    global library_section
    
    try:
        anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        gemini_api_key = os.getenv('GEMINI_API_KEY_PRIMARY') or os.getenv('GOOGLE_API_KEY')
        
        if not anthropic_api_key or not gemini_api_key:
            logger.error("Missing required API keys for Library section")
            return False
        
        library_section = LibrarySection(
            anthropic_api_key=anthropic_api_key,
            gemini_api_key=gemini_api_key
        )
        
        logger.info("🏛️ Library section initialized successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Failed to initialize Library section: {e}")
        return False

def run_async(coro):
    """Helper to run async functions in Flask routes"""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(coro)

@library_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for the Library section"""
    
    if not library_section:
        return jsonify({
            "status": "error",
            "message": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    return jsonify({
        "status": "healthy",
        "message": "Library section (Deep Research Center) is operational",
        "capabilities": {
            "claude_models": ["opus", "sonnet", "haiku"],
            "gemini_models": ["deep_research", "deep_think", "fast"],
            "research_modes": ["claude_only", "gemini_only", "collaborative", "consensus", "debate"],
            "research_depths": ["quick", "standard", "deep", "exhaustive"]
        },
        "timestamp": datetime.now().isoformat()
    })

@library_bp.route('/research', methods=['POST'])
def conduct_research():
    """Main endpoint for conducting research"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'query' not in data:
            return jsonify({
                "error": "Query is required",
                "timestamp": datetime.now().isoformat()
            }), 400
        
        query = data['query']
        mode = data.get('mode', 'collaborative')
        depth = data.get('depth', 'standard')
        user_id = data.get('user_id', 'anonymous')
        
        # Validate mode and depth
        valid_modes = [m.value for m in ResearchMode]
        valid_depths = [d.value for d in ResearchDepth]
        
        if mode not in valid_modes:
            return jsonify({
                "error": f"Invalid mode. Must be one of: {valid_modes}",
                "timestamp": datetime.now().isoformat()
            }), 400
        
        if depth not in valid_depths:
            return jsonify({
                "error": f"Invalid depth. Must be one of: {valid_depths}",
                "timestamp": datetime.now().isoformat()
            }), 400
        
        # Conduct research
        result = run_async(library_section.research(
            query=query,
            mode=mode,
            depth=depth,
            user_id=user_id
        ))
        
        return jsonify({
            "success": True,
            "data": result,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Research failed: {e}")
        return jsonify({
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@library_bp.route('/research/stream', methods=['POST'])
def stream_research():
    """Stream research results in real-time"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    try:
        data = request.get_json()
        query = data.get('query', '')
        mode = data.get('mode', 'collaborative')
        depth = data.get('depth', 'standard')
        user_id = data.get('user_id', 'anonymous')
        
        def generate():
            """Generate streaming responses"""
            
            # Start research session
            session_id = f"stream_{uuid.uuid4().hex[:8]}"
            
            yield f"data: {json.dumps({'event': 'session_start', 'session_id': session_id})}\n\n"
            
            # Mock streaming updates (in real implementation, this would stream actual progress)
            updates = [
                {"event": "phase", "phase": "initialization", "message": "🏛️ Preparing research environment..."},
                {"event": "phase", "phase": "claude_research", "message": "🤖 Claude is researching..."},
                {"event": "phase", "phase": "gemini_research", "message": "🔬 Gemini is conducting deep research..."},
                {"event": "phase", "phase": "collaboration", "message": "🤝 AI models are sharing findings..."},
                {"event": "phase", "phase": "synthesis", "message": "✨ Creating collaborative synthesis..."}
            ]
            
            for update in updates:
                yield f"data: {json.dumps(update)}\n\n"
                time.sleep(2)  # Simulate work
            
            # Get final result
            result = run_async(library_section.research(query, mode, depth, user_id))
            
            yield f"data: {json.dumps({'event': 'complete', 'result': result})}\n\n"
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            }
        )
        
    except Exception as e:
        logger.error(f"Stream research failed: {e}")
        return jsonify({
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@library_bp.route('/research/modes', methods=['GET'])
def get_research_modes():
    """Get available research modes"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    return jsonify({
        "success": True,
        "modes": library_section.get_available_modes(),
        "timestamp": datetime.now().isoformat()
    })

@library_bp.route('/research/depths', methods=['GET'])
def get_research_depths():
    """Get available research depth options"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    return jsonify({
        "success": True,
        "depths": library_section.get_depth_options(),
        "timestamp": datetime.now().isoformat()
    })

@library_bp.route('/research/status/<session_id>', methods=['GET'])
def get_research_status(session_id):
    """Get status of ongoing research session"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    try:
        status = run_async(library_section.research_center.get_research_status(session_id))
        
        return jsonify({
            "success": True,
            "status": status,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting research status: {e}")
        return jsonify({
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@library_bp.route('/research/history', methods=['GET'])
def get_research_history():
    """Get research history for a user"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    user_id = request.args.get('user_id', 'anonymous')
    limit = int(request.args.get('limit', 10))
    
    # Filter history by user
    user_history = [
        h for h in library_section.research_history 
        if h.get('user_id') == user_id
    ][-limit:]
    
    return jsonify({
        "success": True,
        "history": user_history,
        "total": len(user_history),
        "timestamp": datetime.now().isoformat()
    })

@library_bp.route('/research/compare', methods=['POST'])
def compare_research_approaches():
    """Compare different research approaches for the same query"""
    
    if not library_section:
        return jsonify({
            "error": "Library section not initialized",
            "timestamp": datetime.now().isoformat()
        }), 503
    
    try:
        data = request.get_json()
        query = data.get('query', '')
        modes_to_compare = data.get('modes', ['claude_only', 'gemini_only', 'collaborative'])
        depth = data.get('depth', 'quick')  # Use quick for comparison
        user_id = data.get('user_id', 'anonymous')
        
        comparison_results = {}
        
        for mode in modes_to_compare:
            if mode in [m.value for m in ResearchMode]:
                result = run_async(library_section.research(
                    query=query,
                    mode=mode,
                    depth=depth,
                    user_id=user_id
                ))
                comparison_results[mode] = result
        
        return jsonify({
            "success": True,
            "query": query,
            "comparison": comparison_results,
            "modes_compared": list(comparison_results.keys()),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Comparison failed: {e}")
        return jsonify({
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

# WebSocket handlers for real-time collaboration viewing
def init_library_websockets(socketio):
    """Initialize WebSocket handlers for Library section"""
    
    @socketio.on('join_research_session')
    def on_join_research_session(data):
        """Join a research session for real-time updates"""
        session_id = data.get('session_id')
        join_room(f'research_{session_id}')
        emit('joined_research_session', {'session_id': session_id})
    
    @socketio.on('leave_research_session')
    def on_leave_research_session(data):
        """Leave a research session"""
        session_id = data.get('session_id')
        leave_room(f'research_{session_id}')
        emit('left_research_session', {'session_id': session_id})

# Integration with main app
def integrate_library_with_app(app, socketio=None):
    """Integrate Library section with Flask app"""
    
    # Initialize Library section
    if init_library_section(app):
        # Register blueprint
        app.register_blueprint(library_bp)
        
        # Initialize WebSocket handlers if socketio provided
        if socketio:
            init_library_websockets(socketio)
        
        logger.info("🏛️ Library section integrated successfully!")
        return True
    else:
        logger.error("Failed to integrate Library section")
        return False


# Add this to your app.py after other imports:
# from api.library_api import integrate_library_with_app

# Then in your initialize_sanctuary_services() function, add:
# integrate_library_with_app(app, socketio)