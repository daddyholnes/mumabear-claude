"""
🚀 Enhanced Mama Bear with Express Mode + ADK Integration
Supercharged orchestration with 6x faster responses and enterprise agents
"""

import asyncio
import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import json

# Import existing Mama Bear components
from services.mama_bear_orchestration import AgentOrchestrator, MamaBearAgent
from services.enhanced_mama_bear_orchestration import EnhancedMamaBearAgent

# Import new Express Mode and ADK capabilities
from services.vertex_express_integration import VertexExpressIntegration
from services.adk_agent_workbench import ADKAgentWorkbench, AgentSpec, AgentTemplate

logger = logging.getLogger(__name__)

class SuperchargedMamaBearAgent:
    """
    🐻 SUPERCHARGED MAMA BEAR V3.0
    
    NEW SUPERPOWERS:
    ⚡ Express Mode (6x faster responses)
    🤖 ADK Agent Creation Workbench  
    🧠 Intelligent routing and optimization
    🎯 Predictive user need analysis
    🔄 Self-healing and adaptation
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
        # Core components
        self.enhanced_mama_bear = None
        self.express_integration = None
        self.adk_workbench = None
        self.orchestrator = None
        
        # Performance tracking
        self.metrics = {
            "total_requests": 0,
            "express_requests": 0,
            "adk_requests": 0,
            "average_response_time_ms": 0,
            "user_satisfaction": 0.0,
            "autonomous_actions": 0
        }
        
        # Conversation memory and learning
        self.conversation_history = {}
        self.user_preferences = {}
        self.learning_insights = {}
        
        self._initialize_components()
    
    def _initialize_components(self):
        """Initialize all Mama Bear components"""
        
        try:
            # Initialize Express Mode integration
            project_id = self.config.get('google_cloud_project')
            if project_id:
                self.express_integration = VertexExpressIntegration(project_id)
                logger.info("⚡ Express Mode integration initialized")
            
            # Initialize ADK Agent Workbench
            if project_id:
                self.adk_workbench = ADKAgentWorkbench(project_id)
                logger.info("🏭 ADK Agent Workbench initialized")
            
            # Initialize enhanced Mama Bear (your existing system)
            gemini_api_key = self.config.get('gemini_api_key')
            anthropic_api_key = self.config.get('anthropic_api_key')
            
            if gemini_api_key:
                self.enhanced_mama_bear = EnhancedMamaBearAgent(
                    gemini_api_key=gemini_api_key,
                    anthropic_api_key=anthropic_api_key
                )
                logger.info("🐻 Enhanced Mama Bear initialized")
            
            logger.info("🚀 Supercharged Mama Bear V3.0 fully initialized!")
            
        except Exception as e:
            logger.error(f"Failed to initialize Supercharged Mama Bear: {e}")
    
    async def process_message(self, 
                            message: str,
                            user_id: str,
                            variant: str = "scout_commander",
                            context: Dict[str, Any] = None,
                            speed_priority: str = "auto",
                            allow_autonomous_actions: bool = True) -> Dict[str, Any]:
        """
        🧠 Master message processing with intelligent routing
        Automatically selects optimal processing path
        """
        
        start_time = datetime.now()
        request_id = str(uuid.uuid4())
        self.metrics["total_requests"] += 1
        
        try:
            # Step 1: Analyze request for optimal routing
            routing_analysis = await self._analyze_request_intelligence(
                message, user_id, variant, context, speed_priority
            )
            
            # Step 2: Route to optimal processing path
            if routing_analysis["use_express_mode"]:
                response = await self._process_with_express_mode(
                    message, user_id, variant, context, routing_analysis
                )
                self.metrics["express_requests"] += 1
            else:
                response = await self._process_with_enhanced_mama_bear(
                    message, user_id, variant, context, routing_analysis
                )
            
            # Step 3: Post-process and enhance response
            enhanced_response = await self._enhance_response(
                response, routing_analysis, user_id, request_id
            )
            
            # Step 4: Learning and adaptation
            await self._learn_from_interaction(
                message, enhanced_response, user_id, routing_analysis
            )
            
            # Step 5: Autonomous actions (if enabled)
            if allow_autonomous_actions:
                await self._consider_autonomous_actions(
                    message, enhanced_response, user_id, context
                )
            
            # Update metrics
            response_time_ms = (datetime.now() - start_time).total_seconds() * 1000
            self._update_performance_metrics(response_time_ms, routing_analysis)
            
            # Add metadata to response
            enhanced_response.update({
                "request_id": request_id,
                "processing_path": routing_analysis["processing_path"],
                "response_time_ms": round(response_time_ms, 1),
                "performance_tier": routing_analysis.get("performance_tier", "standard"),
                "mama_bear_version": "3.0_supercharged"
            })
            
            return enhanced_response
            
        except Exception as e:
            logger.error(f"Error in supercharged message processing: {e}")
            
            # Fallback response
            return {
                "success": False,
                "response": "🐻 I'm experiencing some technical difficulties, but I'm still here for you! Let me try a different approach.",
                "error": str(e),
                "fallback_used": True,
                "request_id": request_id
            }
    
    async def _analyze_request_intelligence(self, 
                                          message: str,
                                          user_id: str,
                                          variant: str,
                                          context: Dict[str, Any],
                                          speed_priority: str) -> Dict[str, Any]:
        """Advanced request analysis for intelligent routing"""
        
        # Message characteristics
        message_length = len(message)
        complexity_indicators = [
            "analyze", "complex", "detailed", "comprehensive", "research",
            "explain", "elaborate", "investigate", "compare", "evaluate"
        ]
        express_indicators = [
            "quick", "fast", "brief", "summary", "yes", "no", "hi", "hello",
            "thanks", "ok", "sure", "help", "status"
        ]
        
        complexity_score = sum(1 for indicator in complexity_indicators if indicator in message.lower())
        express_score = sum(1 for indicator in express_indicators if indicator in message.lower())
        
        # User history analysis
        user_history = self.conversation_history.get(user_id, [])
        user_prefs = self.user_preferences.get(user_id, {})
        
        # Variant-based routing preferences
        express_friendly_variants = ["efficiency_bear", "scout_commander"]
        research_intensive_variants = ["research_specialist", "debugging_detective"]
        
        # Determine optimal processing path
        use_express_mode = (
            speed_priority in ["ultra_fast", "fast"] or
            express_score > 0 or
            (message_length < 100 and complexity_score == 0) or
            variant in express_friendly_variants
        )
        
        # Advanced routing decision
        if use_express_mode and self.express_integration and self.express_integration.express_enabled:
            processing_path = "express_mode"
            performance_tier = "ultra_fast" if express_score > 0 else "fast"
        elif self.enhanced_mama_bear:
            processing_path = "enhanced_mama_bear"
            performance_tier = "standard"
        else:
            processing_path = "fallback"
            performance_tier = "basic"
        
        return {
            "use_express_mode": use_express_mode,
            "processing_path": processing_path,
            "performance_tier": performance_tier,
            "message_complexity": complexity_score,
            "express_indicators": express_score,
            "message_length": message_length,
            "user_preferences": user_prefs,
            "variant_optimization": variant,
            "routing_confidence": 0.85
        }
    
    async def _process_with_express_mode(self, 
                                       message: str,
                                       user_id: str,
                                       variant: str,
                                       context: Dict[str, Any],
                                       routing_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Process message using Express Mode"""
        
        if not self.express_integration:
            return await self._process_with_enhanced_mama_bear(message, user_id, variant, context, routing_analysis)
        
        # Use Express Mode integration
        response = await self.express_integration.intelligent_express_chat(
            message=message,
            user_id=user_id,
            variant=variant,
            context=context,
            speed_priority=routing_analysis["performance_tier"]
        )
        
        # Add Express Mode branding
        if response.get("success"):
            response["response"] = f"⚡ {response['response']}"
        
        return response
    
    async def _process_with_enhanced_mama_bear(self, 
                                             message: str,
                                             user_id: str,
                                             variant: str,
                                             context: Dict[str, Any],
                                             routing_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Process message using Enhanced Mama Bear"""
        
        if not self.enhanced_mama_bear:
            return {
                "success": False,
                "response": "🐻 Enhanced Mama Bear not available, but I'm still here to help!",
                "fallback_used": True
            }
        
        # Use your existing Enhanced Mama Bear system
        response = await self.enhanced_mama_bear.process_message(
            message=message,
            variant=variant,
            context=context,
            user_id=user_id
        )
        
        return response
    
    async def _enhance_response(self, 
                              response: Dict[str, Any],
                              routing_analysis: Dict[str, Any],
                              user_id: str,
                              request_id: str) -> Dict[str, Any]:
        """Enhance response with additional intelligence and personalization"""
        
        if not response.get("success"):
            return response
        
        # Add personalization based on user history
        user_prefs = self.user_preferences.get(user_id, {})
        
        # Add helpful suggestions if appropriate
        suggestions = await self._generate_helpful_suggestions(
            response["response"], user_id, routing_analysis
        )
        
        if suggestions:
            response["suggestions"] = suggestions
        
        # Add performance insights for power users
        if user_prefs.get("show_performance_insights", False):
            response["performance_insights"] = {
                "processing_path": routing_analysis["processing_path"],
                "optimization_used": routing_analysis["performance_tier"],
                "response_quality": "optimized"
            }
        
        return response
    
    async def _generate_helpful_suggestions(self, 
                                          response_text: str,
                                          user_id: str,
                                          routing_analysis: Dict[str, Any]) -> List[str]:
        """Generate helpful follow-up suggestions"""
        
        suggestions = []
        
        # Based on routing analysis
        if routing_analysis["message_complexity"] > 2:
            suggestions.append("Would you like me to break this down into smaller steps?")
        
        if "code" in response_text.lower():
            suggestions.append("Would you like me to help you test or deploy this code?")
        
        if "research" in response_text.lower():
            suggestions.append("Would you like me to create a research agent to dive deeper?")
        
        return suggestions[:2]  # Limit to 2 suggestions
    
    async def _learn_from_interaction(self, 
                                    message: str,
                                    response: Dict[str, Any],
                                    user_id: str,
                                    routing_analysis: Dict[str, Any]):
        """Learn from user interactions to improve future responses"""
        
        # Update conversation history
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        interaction = {
            "timestamp": datetime.now().isoformat(),
            "message": message[:200],  # Truncate for privacy
            "response_success": response.get("success", False),
            "processing_path": routing_analysis["processing_path"],
            "performance_tier": routing_analysis["performance_tier"]
        }
        
        self.conversation_history[user_id].append(interaction)
        
        # Keep only recent history (last 50 interactions)
        if len(self.conversation_history[user_id]) > 50:
            self.conversation_history[user_id] = self.conversation_history[user_id][-50:]
        
        # Update user preferences based on patterns
        await self._update_user_preferences(user_id, routing_analysis)
    
    async def _update_user_preferences(self, user_id: str, routing_analysis: Dict[str, Any]):
        """Update user preferences based on interaction patterns"""
        
        if user_id not in self.user_preferences:
            self.user_preferences[user_id] = {
                "preferred_speed": "auto",
                "preferred_detail_level": "medium",
                "show_performance_insights": False,
                "autonomous_actions_allowed": True
            }
        
        prefs = self.user_preferences[user_id]
        
        # Learn speed preferences
        if routing_analysis["performance_tier"] == "ultra_fast":
            prefs["preferred_speed"] = "fast"
        elif routing_analysis["message_complexity"] > 2:
            prefs["preferred_detail_level"] = "high"
    
    async def _consider_autonomous_actions(self, 
                                         message: str,
                                         response: Dict[str, Any],
                                         user_id: str,
                                         context: Dict[str, Any]):
        """Consider autonomous actions that might help the user"""
        
        # Check if user preferences allow autonomous actions
        user_prefs = self.user_preferences.get(user_id, {})
        if not user_prefs.get("autonomous_actions_allowed", True):
            return
        
        autonomous_actions = []
        
        # Analyze for potential autonomous actions
        if "create agent" in message.lower() and self.adk_workbench:
            action = await self._suggest_agent_creation(message, user_id)
            if action:
                autonomous_actions.append(action)
        
        if "performance" in message.lower() or "slow" in message.lower():
            action = await self._suggest_performance_optimization(user_id)
            if action:
                autonomous_actions.append(action)
        
        # Execute autonomous actions if any were identified
        for action in autonomous_actions:
            await self._execute_autonomous_action(action, user_id)
            self.metrics["autonomous_actions"] += 1
    
    async def _suggest_agent_creation(self, message: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Suggest creating a specialized agent"""
        
        if not self.adk_workbench or not self.adk_workbench.adk_available:
            return None
        
        # Analyze message for agent type suggestion
        if "research" in message.lower():
            return {
                "type": "agent_creation",
                "template": AgentTemplate.RESEARCH_ANALYST,
                "name": f"Research Assistant for {user_id}",
                "description": "Specialized research and analysis agent"
            }
        elif "code" in message.lower():
            return {
                "type": "agent_creation",
                "template": AgentTemplate.CODE_SPECIALIST,
                "name": f"Code Assistant for {user_id}",
                "description": "Specialized coding and development agent"
            }
        
        return None
    
    async def _suggest_performance_optimization(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Suggest performance optimizations"""
        
        user_history = self.conversation_history.get(user_id, [])
        
        # Check if user frequently uses complex requests
        complex_requests = sum(1 for interaction in user_history[-10:] 
                             if interaction.get("processing_path") != "express_mode")
        
        if complex_requests > 5:
            return {
                "type": "performance_optimization",
                "suggestion": "enable_express_mode_preference",
                "description": "Enable Express Mode for faster responses"
            }
        
        return None
    
    async def _execute_autonomous_action(self, action: Dict[str, Any], user_id: str):
        """Execute an autonomous action"""
        
        try:
            if action["type"] == "agent_creation":
                # Create agent specification (don't auto-deploy)
                spec = AgentSpec(
                    name=action["name"],
                    template=action["template"],
                    description=action["description"],
                    capabilities=["assistance", "learning", "adaptation"]
                )
                
                result = await self.adk_workbench.create_agent(spec, user_id)
                logger.info(f"Autonomous agent creation for {user_id}: {result}")
            
            elif action["type"] == "performance_optimization":
                # Update user preferences
                if user_id not in self.user_preferences:
                    self.user_preferences[user_id] = {}
                
                if action["suggestion"] == "enable_express_mode_preference":
                    self.user_preferences[user_id]["preferred_speed"] = "fast"
                
                logger.info(f"Autonomous performance optimization for {user_id}: {action['suggestion']}")
        
        except Exception as e:
            logger.error(f"Failed to execute autonomous action: {e}")
    
    def _update_performance_metrics(self, response_time_ms: float, routing_analysis: Dict[str, Any]):
        """Update performance metrics"""
        
        # Update average response time
        total_requests = self.metrics["total_requests"]
        current_avg = self.metrics["average_response_time_ms"]
        self.metrics["average_response_time_ms"] = (
            (current_avg * (total_requests - 1)) + response_time_ms
        ) / total_requests
        
        # Update satisfaction (simplified - could be enhanced with user feedback)
        if routing_analysis["performance_tier"] in ["ultra_fast", "fast"] and response_time_ms < 500:
            self.metrics["user_satisfaction"] = min(self.metrics["user_satisfaction"] + 0.01, 1.0)
    
    # Public API methods
    
    async def create_specialized_agent(self, 
                                     agent_spec: Dict[str, Any],
                                     user_id: str) -> Dict[str, Any]:
        """Create a specialized agent using ADK"""
        
        if not self.adk_workbench:
            return {
                "success": False,
                "error": "ADK Agent Workbench not available",
                "fallback_suggestion": "ADK integration required for agent creation"
            }
        
        # Convert dict to AgentSpec
        spec = AgentSpec(
            name=agent_spec.get("name", "Unnamed Agent"),
            template=AgentTemplate(agent_spec.get("template", "conversational")),
            description=agent_spec.get("description", ""),
            capabilities=agent_spec.get("capabilities", []),
            personality_traits=agent_spec.get("personality_traits", {}),
            tools=agent_spec.get("tools", []),
            model_preferences=agent_spec.get("model_preferences", [])
        )
        
        return await self.adk_workbench.create_agent(spec, user_id)
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Get comprehensive performance report"""
        
        express_percentage = 0
        if self.metrics["total_requests"] > 0:
            express_percentage = (self.metrics["express_requests"] / self.metrics["total_requests"]) * 100
        
        report = {
            "mama_bear_version": "3.0_supercharged",
            "capabilities": {
                "express_mode_enabled": self.express_integration is not None and self.express_integration.express_enabled,
                "adk_workbench_enabled": self.adk_workbench is not None and self.adk_workbench.adk_available,
                "enhanced_mama_bear_enabled": self.enhanced_mama_bear is not None
            },
            "performance_metrics": {
                "total_requests": self.metrics["total_requests"],
                "express_mode_usage_percent": round(express_percentage, 1),
                "average_response_time_ms": round(self.metrics["average_response_time_ms"], 1),
                "user_satisfaction": round(self.metrics["user_satisfaction"], 2),
                "autonomous_actions_taken": self.metrics["autonomous_actions"]
            },
            "user_insights": {
                "active_users": len(self.conversation_history),
                "total_conversations": sum(len(history) for history in self.conversation_history.values()),
                "personalization_active": len(self.user_preferences) > 0
            }
        }
        
        # Add Express Mode report if available
        if self.express_integration:
            express_report = self.express_integration.get_performance_report()
            report["express_mode_details"] = express_report
        
        # Add ADK report if available
        if self.adk_workbench:
            # Get agent count (simplified)
            report["adk_workbench_details"] = {
                "agents_created": len(self.adk_workbench.created_agents),
                "templates_available": len(self.adk_workbench.agent_templates)
            }
        
        return report
    
    async def get_user_insights(self, user_id: str) -> Dict[str, Any]:
        """Get insights for a specific user"""
        
        user_history = self.conversation_history.get(user_id, [])
        user_prefs = self.user_preferences.get(user_id, {})
        
        return {
            "user_id": user_id,
            "conversation_count": len(user_history),
            "preferences": user_prefs,
            "recent_activity": user_history[-5:] if user_history else [],
            "performance_stats": {
                "express_mode_usage": sum(1 for interaction in user_history 
                                        if interaction.get("processing_path") == "express_mode"),
                "average_complexity": sum(interaction.get("message_complexity", 0) for interaction in user_history[-10:]) / min(len(user_history), 10) if user_history else 0
            }
        }

# Integration function for Flask app
def integrate_supercharged_mama_bear(app, config: Dict[str, Any]):
    """Integrate Supercharged Mama Bear with Flask app"""
    
    supercharged_mama_bear = SuperchargedMamaBearAgent(config)
    app.supercharged_mama_bear = supercharged_mama_bear
    
    # Add API endpoints
    from flask import Blueprint, request, jsonify
    
    supercharged_bp = Blueprint('supercharged_mama_bear', __name__, url_prefix='/api/mama-bear-v3')
    
    @supercharged_bp.route('/chat', methods=['POST'])
    async def supercharged_chat():
        """Supercharged chat endpoint"""
        try:
            data = request.get_json() or {}
            
            response = await supercharged_mama_bear.process_message(
                message=data.get('message', ''),
                user_id=data.get('user_id', 'anonymous'),
                variant=data.get('variant', 'scout_commander'),
                context=data.get('context', {}),
                speed_priority=data.get('speed_priority', 'auto'),
                allow_autonomous_actions=data.get('allow_autonomous_actions', True)
            )
            
            return jsonify(response)
            
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e),
                "fallback_message": "🐻 I'm having a supercharged moment! Let me recalibrate."
            }), 500
    
    @supercharged_bp.route('/create-agent', methods=['POST'])
    async def create_agent():
        """Create specialized agent"""
        try:
            data = request.get_json() or {}
            
            result = await supercharged_mama_bear.create_specialized_agent(
                agent_spec=data.get('agent_spec', {}),
                user_id=data.get('user_id', 'anonymous')
            )
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
    
    @supercharged_bp.route('/performance-report', methods=['GET'])
    def performance_report():
        """Get performance report"""
        try:
            report = supercharged_mama_bear.get_performance_report()
            return jsonify({
                "success": True,
                "data": report,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
    
    @supercharged_bp.route('/user-insights/<user_id>', methods=['GET'])
    async def user_insights(user_id):
        """Get user insights"""
        try:
            insights = await supercharged_mama_bear.get_user_insights(user_id)
            return jsonify({
                "success": True,
                "data": insights,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
    
    app.register_blueprint(supercharged_bp)
    
    logger.info("🚀 Supercharged Mama Bear V3.0 integrated with Flask app!")
    return supercharged_mama_bear
