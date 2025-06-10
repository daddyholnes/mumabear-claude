"""
🐻 Podplay Sanctuary - Enhanced Mama Bear Flask Application
Neurodivergent-friendly development sanctuary with 7 Mama Bear variants,
3 sensory-friendly themes, and instant cloud development environments
"""

import os
import logging
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import json

# Initialize logging first with Windows compatibility
import sys
import os

# Import Windows-compatible logging
from utils.windows_logging import setup_windows_compatible_logging

# Set up logging that handles Unicode properly on Windows
setup_windows_compatible_logging()
logger = logging.getLogger("PodplaySanctuary")

# Import our sanctuary services
from config.settings import get_settings
from services import (
    initialize_all_services,
    shutdown_all_services,
    get_mama_bear_agent,
    get_memory_manager,
    get_scrapybara_manager,
    get_theme_manager,
    get_service_status
)

# Import API blueprints
from services.mama_bear_orchestration_api import integrate_orchestration_with_app
from api.mama_bear_scrapybara_api import integrate_mama_bear_scrapybara_api
from api.multi_model_api import register_multi_model_api

# Import new Live API Studio routes
from routes.memory import memory_bp
from routes.chat import chat_bp
from routes.scrape import scrape_bp

# Import Gemini Orchestra
try:
    from backend.api.gemini_orchestra_api import gemini_orchestra_bp, init_gemini_orchestra
    GEMINI_ORCHESTRA_AVAILABLE = True
    logger.info("✅ Gemini Orchestra API integration available")
except ImportError as e:
    logger.warning(f"Gemini Orchestra API integration not available: {e}")
    GEMINI_ORCHESTRA_AVAILABLE = False
    gemini_orchestra_bp = None
    init_gemini_orchestra = None

# Import Enhanced Scout Workflow
try:
    from api.scout_workflow_api import integrate_scout_workflow_api
    SCOUT_WORKFLOW_AVAILABLE = True
    logger.info("✅ Enhanced Scout Workflow API integration available")
except ImportError as e:
    logger.warning(f"Enhanced Scout Workflow API integration not available: {e}")
    SCOUT_WORKFLOW_AVAILABLE = False
    integrate_scout_workflow_api = None

# Try to import Mem0 for enhanced memory
try:
    from mem0 import MemoryClient
    MEM0_AVAILABLE = True
except ImportError:
    MEM0_AVAILABLE = False
    MemoryClient = None

# Try to import Deep Research Center (Library)
try:
    from api.library_api import integrate_library_api, library_bp
    LIBRARY_AVAILABLE = True
    logger.info("✅ Deep Research Center (Library) integration available")
except ImportError as e:
    logger.warning(f"Deep Research Center (Library) integration not available: {e}")
    LIBRARY_AVAILABLE = False
    integrate_library_api = None
    library_bp = None

# Initialize Flask app
app = Flask(__name__)
settings = get_settings()
app.config['SECRET_KEY'] = settings.flask_secret_key
CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5001"])

# Initialize SocketIO
socketio = SocketIO(
    app, 
    cors_allowed_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5001"],
    async_mode='threading'
)

# Global service status
services_initialized = False
gemini_orchestra_initialized = False

async def initialize_sanctuary_services():
    """Initialize all sanctuary services using the service manager"""
    global services_initialized, gemini_orchestra_initialized
    
    try:
        logger.info("🚀 Initializing Podplay Sanctuary services...")
        
        # Initialize basic services through the service manager
        await initialize_all_services()
        
        # Initialize Gemini Orchestra
        if GEMINI_ORCHESTRA_AVAILABLE and init_gemini_orchestra:
            logger.info("🎭 Initializing Gemini Orchestra...")
            try:
                gemini_orchestra_initialized = init_gemini_orchestra(app)
                if gemini_orchestra_initialized:
                    logger.info("✅ Gemini Orchestra initialized successfully!")
                    # Register the blueprint
                    if gemini_orchestra_bp is not None:
                        app.register_blueprint(gemini_orchestra_bp)
                        logger.info("✅ Gemini Orchestra API endpoints registered")
                    else:
                        logger.warning("❌ Gemini Orchestra blueprint is None")
                else:
                    logger.warning("❌ Gemini Orchestra initialization failed")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Orchestra: {e}")
                gemini_orchestra_initialized = False
        else:
            logger.warning("Gemini Orchestra not available")
        
        # Initialize Deep Research Center (Library)
        if LIBRARY_AVAILABLE and integrate_library_api:
            logger.info("🏛️ Initializing Deep Research Center (Library)...")
            try:
                library_initialized = integrate_library_api(app)
                if library_initialized:
                    logger.info("✅ Deep Research Center initialized successfully!")
                    logger.info("✅ Library API endpoints registered")
                else:
                    logger.warning("❌ Deep Research Center initialization failed")
            except Exception as e:
                logger.error(f"Failed to initialize Deep Research Center: {e}")
        else:
            logger.warning("Deep Research Center not available")
        
        # Initialize Enhanced Scout Workflow
        if SCOUT_WORKFLOW_AVAILABLE and integrate_scout_workflow_api:
            logger.info("🎯 Initializing Enhanced Scout Workflow...")
            try:
                scout_success = integrate_scout_workflow_api(app, socketio)
                if scout_success:
                    logger.info("✅ Enhanced Scout Workflow initialized!")
                else:
                    logger.warning("❌ Scout Workflow initialization failed")
            except Exception as e:
                logger.error(f"Failed to initialize Scout Workflow: {e}")
        else:
            logger.warning("Enhanced Scout Workflow not available")
        
        services_initialized = True
        
        # Register API blueprints
        try:
            logger.info("🔗 Registering API blueprints...")
            integrate_orchestration_with_app(app, socketio)
            integrate_mama_bear_scrapybara_api(app)
            register_multi_model_api(app)
            
            # Register new Intelligent Execution Router API
            try:
                from api.execution_router_api import execution_router_bp
                app.register_blueprint(execution_router_bp)
                logger.info("✅ Intelligent Execution Router API registered")
            except ImportError as e:
                logger.warning(f"Execution Router API not available: {e}")
            
            # Register new Agent Creation Workbench API
            try:
                from api.agent_workbench_api import agent_workbench_bp
                app.register_blueprint(agent_workbench_bp)
                logger.info("✅ Agent Creation Workbench API registered")
            except ImportError as e:
                logger.warning(f"Agent Workbench API not available: {e}")
            
            # Register Live API Studio routes
            app.register_blueprint(memory_bp, url_prefix='/api/memory')
            app.register_blueprint(chat_bp, url_prefix='/api/chat')
            app.register_blueprint(scrape_bp, url_prefix='/api/scrape')
            logger.info("✅ Live API Studio routes registered")
            
            logger.info("✅ API blueprints registered successfully")
        except Exception as e:
            logger.error(f"❌ Failed to register API blueprints: {e}")
        
        logger.info("✅ All sanctuary services initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {str(e)}")
        services_initialized = True
        logger.info("⚠️ Running with basic services only")
    
    logger.info("🐻 Podplay Sanctuary initialization complete!")

def get_service_instances():
    """Get all service instances"""
    if not services_initialized:
        raise RuntimeError("Services not initialized. Call initialize_sanctuary_services() first.")
    
    return {
        'mama_bear': get_mama_bear_agent(),
        'memory': get_memory_manager(),
        'scrapybara': get_scrapybara_manager(),
        'theme': get_theme_manager()
    }

# ==============================================================================
# SERVICE HEALTH AND STATUS ENDPOINTS
# ==============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        status = get_service_status()
        
        return jsonify({
            'success': True,
            'status': 'healthy',
            'services': status,
            'gemini_orchestra': {
                'available': GEMINI_ORCHESTRA_AVAILABLE,
                'initialized': gemini_orchestra_initialized,
                'models': '50+ specialized Gemini models' if gemini_orchestra_initialized else 'unavailable'
            },
            'enhanced_features': {
                'mama_bear_variants': 7,
                'claude_integration': bool(os.getenv('ANTHROPIC_API_KEY')),
                'real_time_collaboration': gemini_orchestra_initialized,
                'neurodivergent_optimized': True
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }), 500

# ==============================================================================
# WEBSOCKET HANDLERS
# ==============================================================================

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info("Client connected")
    emit('connection_established', {
        'status': 'connected',
        'sanctuary_version': '1.0.0',
        'mama_bear_ready': True
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info("Client disconnected")

# ==============================================================================
# ERROR HANDLERS
# ==============================================================================

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'sanctuary_message': '🐻 Mama Bear couldn\'t find that path. Try a different route!'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'sanctuary_message': '🐻 Mama Bear encountered an issue. She\'s working to fix it!'
    }), 500

# ==============================================================================
# APPLICATION STARTUP
# ==============================================================================

def create_app():
    """Application factory function"""
    # Initialize services when app is created
    import asyncio
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(initialize_sanctuary_services())
    
    return app

if __name__ == '__main__':
    # Initialize services
    import asyncio
    
    async def startup():
        """Async startup function"""
        logger.info("🚀 Starting Podplay Sanctuary...")
        await initialize_sanctuary_services()
        logger.info("🐻 Mama Bear is ready to help!")
    
    # Run startup
    asyncio.run(startup())
    
    # Start the Sanctuary
    socketio.run(
        app,
        host='0.0.0.0',
        port=int(os.getenv('BACKEND_PORT', 5001)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true',
        allow_unsafe_werkzeug=True
    )
