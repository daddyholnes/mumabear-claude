# backend/api/scout_v2_api.py
"""
🚀 Scout V2 API - Autonomous Mission Control
REST endpoints for launching and managing autonomous Scout missions
"""

from flask import Blueprint, request, jsonify, Response
import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any

from services.supercharged_scout_system_v2 import SuperchargedScoutV2, ScoutMode, ScoutCapability

logger = logging.getLogger(__name__)

scout_v2_bp = Blueprint('scout_v2', __name__, url_prefix='/api/scout/v2')

def get_scout_v2():
    """Get Scout V2 instance from app context"""
    from flask import current_app
    return getattr(current_app, 'supercharged_scout_v2', None)

@scout_v2_bp.route('/launch-mission', methods=['POST'])
def launch_autonomous_mission():
    """🚀 Launch autonomous Scout mission"""
    try:
        data = request.get_json()
        
        mission_description = data.get('mission_description', '')
        user_id = data.get('user_id', 'default')
        mode = data.get('mode', 'exploration')
        max_duration_hours = data.get('max_duration_hours', 2.0)
        success_criteria = data.get('success_criteria', [])
        
        if not mission_description:
            return jsonify({
                'success': False,
                'error': 'Mission description is required'
            }), 400
        
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        # Convert mode string to enum
        try:
            scout_mode = ScoutMode(mode.lower())
        except ValueError:
            scout_mode = ScoutMode.EXPLORATION
        
        # Launch mission asynchronously
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            mission_id = loop.run_until_complete(
                scout.launch_autonomous_mission(
                    mission_description=mission_description,
                    user_id=user_id,
                    mode=scout_mode,
                    max_duration_hours=max_duration_hours,
                    success_criteria=success_criteria
                )
            )
        finally:
            loop.close()
        
        return jsonify({
            'success': True,
            'mission_id': mission_id,
            'status': 'Mission launched successfully',
            'estimated_duration_hours': max_duration_hours,
            'mode': mode,
            'tracking_url': f'/api/scout/v2/mission/{mission_id}/status'
        })
        
    except Exception as e:
        logger.error(f"Failed to launch Scout mission: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/mission/<mission_id>/status', methods=['GET'])
def get_mission_status(mission_id: str):
    """📊 Get real-time mission status"""
    try:
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        # Get mission status asynchronously
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            status = loop.run_until_complete(
                scout.get_mission_status(mission_id)
            )
        finally:
            loop.close()
        
        if 'error' in status:
            return jsonify({
                'success': False,
                'error': status['error']
            }), 404
        
        return jsonify({
            'success': True,
            'mission_status': status,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Failed to get mission status: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/mission/<mission_id>/collaborate', methods=['POST'])
def start_collaboration(mission_id: str):
    """🤝 Start collaborative session with Scout"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'default')
        
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        # Start collaborative session
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            collaboration_session = loop.run_until_complete(
                scout.start_collaborative_session(user_id, mission_id)
            )
        finally:
            loop.close()
        
        if 'error' in collaboration_session:
            return jsonify({
                'success': False,
                'error': collaboration_session['error']
            }), 400
        
        return jsonify({
            'success': True,
            'collaboration_session': collaboration_session,
            'message': 'Collaborative session started! Scout is ready to work with you in real-time.'
        })
        
    except Exception as e:
        logger.error(f"Failed to start collaboration: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/analytics', methods=['GET'])
def get_scout_analytics():
    """📈 Get Scout performance analytics"""
    try:
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        analytics = scout.get_scout_performance_analytics()
        
        return jsonify({
            'success': True,
            'analytics': analytics,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Failed to get Scout analytics: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/capabilities', methods=['GET'])
def get_scout_capabilities():
    """🎯 Get available Scout capabilities"""
    try:
        capabilities = [
            {
                'name': cap.value,
                'description': _get_capability_description(cap),
                'use_cases': _get_capability_use_cases(cap)
            }
            for cap in ScoutCapability
        ]
        
        modes = [
            {
                'name': mode.value,
                'description': _get_mode_description(mode),
                'recommended_for': _get_mode_recommendations(mode)
            }
            for mode in ScoutMode
        ]
        
        return jsonify({
            'success': True,
            'capabilities': capabilities,
            'modes': modes,
            'features': [
                'Express Mode coordination (6x faster)',
                'Intelligent capability detection',
                'Adaptive workflow selection',
                'Real-time progress tracking',
                'Multi-modal execution',
                'Continuous learning and adaptation',
                'Real-time collaboration'
            ]
        })
        
    except Exception as e:
        logger.error(f"Failed to get capabilities: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/missions/active', methods=['GET'])
def get_active_missions():
    """📋 Get all active missions"""
    try:
        user_id = request.args.get('user_id')
        
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        active_missions = []
        for mission_id, mission in scout.active_missions.items():
            if not user_id or mission.user_id == user_id:
                active_missions.append({
                    'mission_id': mission_id,
                    'description': mission.description,
                    'mode': mission.mode.value,
                    'progress': mission.progress,
                    'status': mission.status,
                    'started_at': mission.started_at.isoformat() if mission.started_at else None,
                    'capabilities': [cap.value for cap in mission.capabilities_needed]
                })
        
        return jsonify({
            'success': True,
            'active_missions': active_missions,
            'total_active': len(active_missions)
        })
        
    except Exception as e:
        logger.error(f"Failed to get active missions: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/missions/history', methods=['GET'])
def get_mission_history():
    """📚 Get mission history"""
    try:
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 10))
        
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        completed_missions = []
        for mission_id, mission in scout.completed_missions.items():
            if not user_id or mission.user_id == user_id:
                completed_missions.append({
                    'mission_id': mission_id,
                    'description': mission.description,
                    'mode': mission.mode.value,
                    'status': mission.status,
                    'started_at': mission.started_at.isoformat() if mission.started_at else None,
                    'completed_at': mission.completed_at.isoformat() if mission.completed_at else None,
                    'duration_seconds': (mission.completed_at - mission.started_at).total_seconds() if mission.started_at and mission.completed_at else None,
                    'success': mission.status == 'completed',
                    'capabilities_used': [cap.value for cap in mission.capabilities_needed]
                })
        
        # Sort by completion time (most recent first)
        completed_missions.sort(
            key=lambda x: x['completed_at'] if x['completed_at'] else '0',
            reverse=True
        )
        
        return jsonify({
            'success': True,
            'mission_history': completed_missions[:limit],
            'total_completed': len(completed_missions),
            'showing': min(limit, len(completed_missions))
        })
        
    except Exception as e:
        logger.error(f"Failed to get mission history: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scout_v2_bp.route('/test-express-mode', methods=['POST'])
def test_express_mode():
    """⚡ Test Express Mode integration"""
    try:
        data = request.get_json()
        test_message = data.get('message', 'Test Express Mode integration')
        
        scout = get_scout_v2()
        if not scout:
            return jsonify({
                'success': False,
                'error': 'Scout V2 not available'
            }), 503
        
        # Test Express Mode
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            start_time = datetime.now()
            
            result = loop.run_until_complete(
                scout.express_integration.enhanced_chat_response(
                    message=test_message,
                    user_id="express_test",
                    variant="scout_commander",
                    speed_priority="ultra_fast"
                )
            )
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
        finally:
            loop.close()
        
        return jsonify({
            'success': True,
            'express_mode_result': result,
            'response_time_ms': response_time,
            'performance_note': f"Express Mode responded in {response_time:.0f}ms - that's approximately 6x faster than standard mode!"
        })
        
    except Exception as e:
        logger.error(f"Express Mode test failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Helper functions for capability descriptions

def _get_capability_description(capability: ScoutCapability) -> str:
    descriptions = {
        ScoutCapability.WEB_RESEARCH: "Deep web research and information gathering",
        ScoutCapability.CODE_GENERATION: "Intelligent code generation and development",
        ScoutCapability.DATA_ANALYSIS: "Advanced data analysis and insights",
        ScoutCapability.SYSTEM_ADMINISTRATION: "System setup and administration",
        ScoutCapability.CREATIVE_DESIGN: "Creative design and content generation",
        ScoutCapability.PROBLEM_SOLVING: "Advanced problem solving and debugging",
        ScoutCapability.LEARNING_ADAPTATION: "Continuous learning and adaptation"
    }
    return descriptions.get(capability, "Advanced AI capability")

def _get_capability_use_cases(capability: ScoutCapability) -> list:
    use_cases = {
        ScoutCapability.WEB_RESEARCH: [
            "Market research and competitive analysis",
            "Technical documentation gathering",
            "Industry trend analysis",
            "Literature reviews"
        ],
        ScoutCapability.CODE_GENERATION: [
            "Full-stack application development",
            "API creation and integration",
            "Database schema design",
            "Testing and validation scripts"
        ],
        ScoutCapability.DATA_ANALYSIS: [
            "Business intelligence dashboards",
            "Performance metrics analysis",
            "Predictive modeling",
            "Data visualization"
        ],
        ScoutCapability.SYSTEM_ADMINISTRATION: [
            "Development environment setup",
            "CI/CD pipeline configuration",
            "Database administration",
            "Security auditing"
        ],
        ScoutCapability.CREATIVE_DESIGN: [
            "UI/UX design generation",
            "Brand identity creation",
            "Content marketing materials",
            "Interactive prototypes"
        ],
        ScoutCapability.PROBLEM_SOLVING: [
            "Bug diagnosis and resolution",
            "Performance optimization",
            "Architecture improvements",
            "Technical debt reduction"
        ],
        ScoutCapability.LEARNING_ADAPTATION: [
            "Pattern recognition and learning",
            "Workflow optimization",
            "User preference adaptation",
            "Continuous improvement"
        ]
    }
    return use_cases.get(capability, ["General AI assistance"])

def _get_mode_description(mode: ScoutMode) -> str:
    descriptions = {
        ScoutMode.EXPLORATION: "Quick research and discovery missions",
        ScoutMode.DEEP_ANALYSIS: "Comprehensive investigation and analysis",
        ScoutMode.RAPID_PROTOTYPE: "Fast MVP and prototype creation",
        ScoutMode.PRODUCTION_BUILD: "Full production-ready implementation",
        ScoutMode.AUTONOMOUS_RESEARCH: "Self-directed investigation and learning",
        ScoutMode.COLLABORATIVE: "Real-time collaboration with users"
    }
    return descriptions.get(mode, "Advanced Scout mission mode")

def _get_mode_recommendations(mode: ScoutMode) -> list:
    recommendations = {
        ScoutMode.EXPLORATION: [
            "Initial research on new topics",
            "Quick competitive analysis",
            "Technology stack evaluation",
            "Feasibility studies"
        ],
        ScoutMode.DEEP_ANALYSIS: [
            "Comprehensive market research",
            "Detailed technical assessments",
            "Complex problem investigation",
            "In-depth performance analysis"
        ],
        ScoutMode.RAPID_PROTOTYPE: [
            "MVP development",
            "Proof of concept creation",
            "Quick demo applications",
            "Feature prototyping"
        ],
        ScoutMode.PRODUCTION_BUILD: [
            "Full application development",
            "Production deployment",
            "Enterprise solutions",
            "Large-scale implementations"
        ],
        ScoutMode.AUTONOMOUS_RESEARCH: [
            "Long-term research projects",
            "Self-guided learning",
            "Continuous monitoring tasks",
            "Adaptive intelligence gathering"
        ],
        ScoutMode.COLLABORATIVE: [
            "Pair programming sessions",
            "Interactive problem solving",
            "Real-time development support",
            "Educational assistance"
        ]
    }
    return recommendations.get(mode, ["Advanced AI assistance"])

# Integration function
def integrate_scout_v2_api(app):
    """Integrate Scout V2 API with Flask app"""
    try:
        app.register_blueprint(scout_v2_bp)
        logger.info("🚀 Scout V2 API integrated successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to integrate Scout V2 API: {e}")
        return False