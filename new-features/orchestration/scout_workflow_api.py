# backend/api/scout_workflow_api.py
"""
🎯 Scout Workflow API - Integration with Enhanced Gemini Orchestration
RESTful endpoints for autonomous full-stack development workflows
"""

from flask import Blueprint, request, jsonify, Response
from flask_socketio import emit, join_room, leave_room
import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import uuid

from ..services.enhanced_gemini_scout_orchestration import (
    EnhancedGeminiScoutOrchestrator, 
    WorkflowStage,
    ModelTier
)
from ..config.settings import get_settings

logger = logging.getLogger(__name__)

# Blueprint for Scout workflow endpoints
scout_bp = Blueprint('scout_workflow', __name__)

# Global orchestrator instance
scout_orchestrator: Optional[EnhancedGeminiScoutOrchestrator] = None

def initialize_scout_orchestrator():
    """Initialize the Scout orchestrator with API keys"""
    global scout_orchestrator
    
    settings = get_settings()
    gemini_api_key = settings.google_api_key
    
    if not gemini_api_key:
        logger.error("Google API key not configured for Scout orchestrator")
        return False
    
    try:
        scout_orchestrator = EnhancedGeminiScoutOrchestrator(gemini_api_key)
        logger.info("🎯 Scout orchestrator initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize Scout orchestrator: {e}")
        return False

def get_scout_orchestrator() -> Optional[EnhancedGeminiScoutOrchestrator]:
    """Get the Scout orchestrator instance"""
    global scout_orchestrator
    if not scout_orchestrator:
        initialize_scout_orchestrator()
    return scout_orchestrator

@scout_bp.route('/api/scout/workflow/start', methods=['POST'])
async def start_scout_workflow():
    """
    🚀 Start a new Scout workflow
    
    Expected payload:
    {
        "description": "Build a React todo app with Firebase backend",
        "user_id": "user123",
        "preferences": {
            "frontend": "react",
            "backend": "firebase",
            "styling": "tailwindcss"
        }
    }
    """
    try:
        data = request.json or {}
        description = data.get('description', '')
        user_id = data.get('user_id', 'anonymous')
        preferences = data.get('preferences', {})
        
        if not description:
            return jsonify({
                'success': False,
                'error': 'Project description is required'
            }), 400
        
        orchestrator = get_scout_orchestrator()
        if not orchestrator:
            return jsonify({
                'success': False,
                'error': 'Scout orchestrator not available'
            }), 503
        
        # Generate workflow ID
        workflow_id = f"scout_{user_id}_{int(datetime.now().timestamp())}"
        
        # Enhance description with preferences
        enhanced_description = description
        if preferences:
            enhanced_description += f"\n\nPreferences: {json.dumps(preferences, indent=2)}"
        
        # Start the workflow (async)
        workflow_task = asyncio.create_task(
            orchestrator.execute_scout_workflow(
                enhanced_description, 
                user_id, 
                workflow_id
            )
        )
        
        # Return immediate response with workflow ID
        return jsonify({
            'success': True,
            'workflow_id': workflow_id,
            'status': 'started',
            'description': description,
            'estimated_duration': '3-8 minutes',
            'stages': [
                {'name': 'Planning', 'status': 'pending'},
                {'name': 'Environment Setup', 'status': 'pending'},
                {'name': 'Code Generation', 'status': 'pending'},
                {'name': 'Testing', 'status': 'pending'},
                {'name': 'Deployment', 'status': 'pending'}
            ],
            'message': '🎯 Scout Commander is analyzing your request and creating a plan!'
        })
        
    except Exception as e:
        logger.error(f"Error starting Scout workflow: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_bp.route('/api/scout/workflow/<workflow_id>/status', methods=['GET'])
async def get_workflow_status(workflow_id: str):
    """
    📊 Get current status of a Scout workflow
    """
    try:
        orchestrator = get_scout_orchestrator()
        if not orchestrator:
            return jsonify({
                'success': False,
                'error': 'Scout orchestrator not available'
            }), 503
        
        # Get workflow from active workflows
        workflow_state = orchestrator.active_workflows.get(workflow_id)
        
        if not workflow_state:
            return jsonify({
                'success': False,
                'error': 'Workflow not found'
            }), 404
        
        # Calculate progress
        total_stages = 5
        completed_stages = len([s for s in workflow_state.get('stages', {}).values() 
                              if s.get('completed_at')])
        progress = (completed_stages / total_stages) * 100
        
        # Format stage status
        stage_status = []
        for stage in WorkflowStage:
            stage_data = workflow_state.get('stages', {}).get(stage.value)
            if stage_data:
                stage_status.append({
                    'name': stage.value.title().replace('_', ' '),
                    'status': 'completed',
                    'model_used': stage_data.get('model_used'),
                    'duration': round(stage_data.get('duration', 0), 2),
                    'completed_at': stage_data.get('completed_at')
                })
            else:
                stage_status.append({
                    'name': stage.value.title().replace('_', ' '),
                    'status': 'pending' if stage.value != workflow_state.get('status') else 'running'
                })
        
        return jsonify({
            'success': True,
            'workflow_id': workflow_id,
            'status': workflow_state.get('status', 'unknown'),
            'progress': progress,
            'stages': stage_status,
            'metadata': {
                'started_at': workflow_state.get('started_at', datetime.now()).isoformat(),
                'models_used': workflow_state.get('models_used', []),
                'total_requests': workflow_state.get('total_requests', 0),
                'quota_switches': workflow_state.get('quota_switches', 0)
            },
            'current_stage': workflow_state.get('status', 'planning')
        })
        
    except Exception as e:
        logger.error(f"Error getting workflow status: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_bp.route('/api/scout/workflow/<workflow_id>/results', methods=['GET'])
async def get_workflow_results(workflow_id: str):
    """
    📋 Get detailed results of a completed Scout workflow
    """
    try:
        orchestrator = get_scout_orchestrator()
        if not orchestrator:
            return jsonify({
                'success': False,
                'error': 'Scout orchestrator not available'
            }), 503
        
        workflow_state = orchestrator.active_workflows.get(workflow_id)
        
        if not workflow_state:
            return jsonify({
                'success': False,
                'error': 'Workflow not found'
            }), 404
        
        if workflow_state.get('status') not in ['completed', 'failed']:
            return jsonify({
                'success': False,
                'error': 'Workflow not yet completed',
                'current_status': workflow_state.get('status')
            }), 202
        
        # Extract detailed results
        stages_results = {}
        for stage_name, stage_data in workflow_state.get('stages', {}).items():
            stages_results[stage_name] = {
                'model_used': stage_data.get('model_used'),
                'duration': stage_data.get('duration'),
                'result': stage_data.get('result'),
                'completed_at': stage_data.get('completed_at')
            }
        
        return jsonify({
            'success': True,
            'workflow_id': workflow_id,
            'status': workflow_state.get('status'),
            'results': stages_results,
            'summary': {
                'total_duration': (
                    datetime.fromisoformat(workflow_state.get('completed_at', datetime.now().isoformat())) - 
                    workflow_state.get('started_at', datetime.now())
                ).total_seconds(),
                'models_used': workflow_state.get('models_used', []),
                'quota_efficiency': {
                    'total_requests': workflow_state.get('total_requests', 0),
                    'quota_switches': workflow_state.get('quota_switches', 0),
                    'switch_rate': (
                        workflow_state.get('quota_switches', 0) / 
                        max(1, workflow_state.get('total_requests', 1))
                    )
                }
            },
            'deployment_info': {
                'urls': self._extract_deployment_urls(stages_results),
                'environment': self._extract_environment_info(stages_results)
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting workflow results: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_bp.route('/api/scout/orchestration/status', methods=['GET'])
async def get_orchestration_status():
    """
    🎭 Get comprehensive status of the Scout orchestration system
    """
    try:
        orchestrator = get_scout_orchestrator()
        if not orchestrator:
            return jsonify({
                'success': False,
                'error': 'Scout orchestrator not available'
            }), 503
        
        status = await orchestrator.get_orchestration_status()
        
        return jsonify({
            'success': True,
            'orchestration_status': status,
            'system_health': {
                'healthy_model_percentage': (
                    status['healthy_models'] / status['total_models'] * 100
                ),
                'active_workflows': status['active_workflows'],
                'total_capacity': sum(
                    quota_info.requests_per_minute 
                    for quota_info in orchestrator.quota_status.values()
                ),
                'available_capacity': sum(
                    quota_info.requests_per_minute - quota_info.current_minute_count
                    for quota_info in orchestrator.quota_status.values()
                    if quota_info.is_healthy
                )
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting orchestration status: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_bp.route('/api/scout/models/rebalance', methods=['POST'])
async def rebalance_models():
    """
    ⚖️ Manually trigger model rebalancing and quota optimization
    """
    try:
        orchestrator = get_scout_orchestrator()
        if not orchestrator:
            return jsonify({
                'success': False,
                'error': 'Scout orchestrator not available'
            }), 503
        
        # Reset cooldowns for models that have been down too long
        rebalanced_models = []
        for model_id, quota_info in orchestrator.quota_status.items():
            if not quota_info.is_healthy and quota_info.consecutive_errors < 5:
                quota_info.is_healthy = True
                quota_info.consecutive_errors = 0
                quota_info.cooldown_until = None
                rebalanced_models.append(model_id)
        
        # Clear performance cache for fresh start
        orchestrator.model_performance_cache.clear()
        
        return jsonify({
            'success': True,
            'message': 'Model rebalancing completed',
            'rebalanced_models': rebalanced_models,
            'total_models_available': len([
                m for m in orchestrator.quota_status.values() 
                if m.is_healthy
            ])
        })
        
    except Exception as e:
        logger.error(f"Error rebalancing models: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_bp.route('/api/scout/workflow/<workflow_id>/cancel', methods=['POST'])
async def cancel_workflow(workflow_id: str):
    """
    ❌ Cancel an active Scout workflow
    """
    try:
        orchestrator = get_scout_orchestrator()
        if not orchestrator:
            return jsonify({
                'success': False,
                'error': 'Scout orchestrator not available'
            }), 503
        
        workflow_state = orchestrator.active_workflows.get(workflow_id)
        
        if not workflow_state:
            return jsonify({
                'success': False,
                'error': 'Workflow not found'
            }), 404
        
        if workflow_state.get('status') in ['completed', 'failed', 'cancelled']:
            return jsonify({
                'success': False,
                'error': 'Workflow already finished',
                'current_status': workflow_state.get('status')
            }), 400
        
        # Mark workflow as cancelled
        workflow_state['status'] = 'cancelled'
        workflow_state['cancelled_at'] = datetime.now()
        
        return jsonify({
            'success': True,
            'workflow_id': workflow_id,
            'status': 'cancelled',
            'message': 'Workflow cancelled successfully'
        })
        
    except Exception as e:
        logger.error(f"Error cancelling workflow: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Helper functions

def _extract_deployment_urls(stages_results: Dict[str, Any]) -> Dict[str, str]:
    """Extract deployment URLs from workflow results"""
    
    urls = {}
    deployment_result = stages_results.get('deployment', {}).get('result', {})
    
    if isinstance(deployment_result, dict):
        data = deployment_result.get('data', {})
        if isinstance(data, dict):
            # Look for common URL patterns
            for key, value in data.items():
                if isinstance(value, str) and ('http' in value or 'https' in value):
                    urls[key] = value
    
    return urls

def _extract_environment_info(stages_results: Dict[str, Any]) -> Dict[str, Any]:
    """Extract environment information from workflow results"""
    
    environment_result = stages_results.get('environment', {}).get('result', {})
    
    if isinstance(environment_result, dict):
        data = environment_result.get('data', {})
        if isinstance(data, dict):
            return {
                'type': data.get('environment_type', 'scrapybara'),
                'framework': data.get('framework', 'unknown'),
                'language': data.get('language', 'unknown'),
                'database': data.get('database', 'unknown')
            }
    
    return {
        'type': 'scrapybara',
        'framework': 'unknown',
        'language': 'unknown',
        'database': 'unknown'
    }

# WebSocket handlers for real-time updates

def setup_scout_websockets(socketio):
    """Setup WebSocket handlers for real-time Scout workflow updates"""
    
    @socketio.on('join_scout_workflow')
    def on_join_scout_workflow(data):
        """Join a Scout workflow room for real-time updates"""
        workflow_id = data.get('workflow_id')
        if workflow_id:
            join_room(f"scout_{workflow_id}")
            emit('scout_workflow_joined', {'workflow_id': workflow_id})
            logger.info(f"Client joined Scout workflow room: {workflow_id}")
    
    @socketio.on('leave_scout_workflow')
    def on_leave_scout_workflow(data):
        """Leave a Scout workflow room"""
        workflow_id = data.get('workflow_id')
        if workflow_id:
            leave_room(f"scout_{workflow_id}")
            emit('scout_workflow_left', {'workflow_id': workflow_id})
    
    @socketio.on('scout_workflow_ping')
    def on_scout_workflow_ping(data):
        """Handle ping requests for workflow status"""
        workflow_id = data.get('workflow_id')
        if workflow_id:
            # This would trigger a status update
            # In production, this could check current status and emit update
            emit('scout_workflow_pong', {'workflow_id': workflow_id, 'timestamp': datetime.now().isoformat()})

def integrate_scout_workflow_api(app, socketio):
    """Integrate Scout Workflow API with Flask app"""
    
    # Register blueprint
    app.register_blueprint(scout_bp)
    
    # Setup WebSocket handlers
    setup_scout_websockets(socketio)
    
    # Initialize orchestrator
    with app.app_context():
        success = initialize_scout_orchestrator()
        if success:
            logger.info("🎯 Scout Workflow API integrated successfully")
        else:
            logger.error("❌ Failed to integrate Scout Workflow API")
    
    return success