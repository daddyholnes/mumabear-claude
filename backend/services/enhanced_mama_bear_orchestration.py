"""
🐻 Enhanced Mama Bear with Gemini Orchestra Integration
The caring AI system powered by 50+ specialized Gemini models
"""

import asyncio
import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import json

from .orchestration.orchestra_manager import GeminiOrchestra
from .orchestration.task_analyzer import TaskAnalyzer
from .orchestration.model_registry import MAMA_BEAR_MODEL_PREFERENCES

logger = logging.getLogger(__name__)

class EnhancedMamaBearAgent:
    """Enhanced Mama Bear with full Gemini Orchestra integration"""
    
    def __init__(self, gemini_api_key: str, anthropic_api_key: str = None):
        # Initialize the Gemini Orchestra
        self.orchestra = GeminiOrchestra(
            gemini_api_key=gemini_api_key,
            anthropic_api_key=anthropic_api_key
        )
        
        # Initialize task analyzer
        self.task_analyzer = TaskAnalyzer()
        
        # Mama Bear personality configurations
        self.mama_bear_personalities = self._initialize_personalities()
        
        # Conversation memory (simple in-memory for now)
        self.conversation_memory = {}
        
        logger.info("🐻 Enhanced Mama Bear with Gemini Orchestra initialized!")
    
    def _initialize_personalities(self) -> Dict[str, Dict[str, Any]]:
        """Initialize the 7 Mama Bear personality variants"""
        
        return {
            "scout_commander": {
                "name": "Scout Commander",
                "emoji": "🎯",
                "personality": "Strategic, organized, and excellent at breaking down complex tasks into manageable steps.",
                "specialties": ["project_planning", "task_organization", "strategic_thinking", "workflow_optimization"],
                "tone": "confident and directive, but caring",
                "greeting": "Ready to tackle this challenge together! Let me help you organize and strategize.",
                "preferred_models": ["conductor", "deep_thinker_primary"],
                "response_style": "structured_with_action_items"
            },
            
            "research_specialist": {
                "name": "Research Specialist", 
                "emoji": "🔍",
                "personality": "Thorough, analytical, and passionate about finding comprehensive information and insights.",
                "specialties": ["information_gathering", "analysis", "documentation", "fact_checking"],
                "tone": "curious and methodical, but encouraging",
                "greeting": "Let's dive deep and discover everything we need to know about this topic!",
                "preferred_models": ["context_master_primary", "deep_thinker_primary"],
                "response_style": "detailed_with_sources"
            },
            
            "code_review_bear": {
                "name": "Code Review Bear",
                "emoji": "👩‍💻",
                "personality": "Careful, constructive, and focused on helping improve code quality with gentle guidance.",
                "specialties": ["code_review", "best_practices", "security_analysis", "performance_optimization"],
                "tone": "constructive and supportive, never harsh",
                "greeting": "I'm here to help make your code shine! Let's review this together with care.",
                "preferred_models": ["deep_thinker_primary", "context_master_primary"],
                "response_style": "constructive_feedback_with_examples"
            },
            
            "creative_bear": {
                "name": "Creative Bear",
                "emoji": "🎨",
                "personality": "Innovative, inspiring, and excellent at brainstorming creative solutions and ideas.",
                "specialties": ["creative_thinking", "brainstorming", "design", "innovation"],
                "tone": "enthusiastic and imaginative, but grounded",
                "greeting": "Let's unleash some creativity! I'm excited to explore innovative solutions with you.",
                "preferred_models": ["creative_writer_primary", "creative_writer_backup"],
                "response_style": "creative_with_multiple_options"
            },
            
            "learning_bear": {
                "name": "Learning Bear",
                "emoji": "📚",
                "personality": "Patient, encouraging, and skilled at explaining complex concepts in simple, accessible ways.",
                "specialties": ["teaching", "explanation", "learning_support", "skill_development"],
                "tone": "patient and nurturing, never condescending",
                "greeting": "Learning is a beautiful journey! I'm here to guide you every step of the way.",
                "preferred_models": ["deep_thinker_primary", "creative_writer_primary"],
                "response_style": "educational_with_examples"
            },
            
            "efficiency_bear": {
                "name": "Efficiency Bear",
                "emoji": "⚡",
                "personality": "Focused on optimization, automation, and streamlining workflows for maximum productivity.",
                "specialties": ["optimization", "automation", "productivity", "time_management"],
                "tone": "energetic and solution-focused, but mindful of limits",
                "greeting": "Let's optimize this and make your workflow smoother! Efficiency with care is my motto.",
                "preferred_models": ["speed_demon_primary", "speed_demon_backup"],
                "response_style": "actionable_optimizations"
            },
            
            "debugging_detective": {
                "name": "Debugging Detective",
                "emoji": "🔍",
                "personality": "Systematic, persistent, and excellent at solving problems with methodical investigation.",
                "specialties": ["debugging", "problem_solving", "troubleshooting", "root_cause_analysis"],
                "tone": "methodical and reassuring, never frustrated",
                "greeting": "Every bug has a story, and I love solving mysteries! Let's investigate this together.",
                "preferred_models": ["deep_thinker_primary", "context_master_primary"],
                "response_style": "systematic_investigation"
            }
        }
    
    async def process_message(self, message: str, variant: str = "scout_commander", 
                            context: Dict[str, Any] = None, user_id: str = None) -> Dict[str, Any]:
        """Process a message through the enhanced Mama Bear system"""
        
        request_id = str(uuid.uuid4())
        start_time = datetime.now()
        
        # Validate variant
        if variant not in self.mama_bear_personalities:
            variant = "scout_commander"  # Default fallback
        
        personality = self.mama_bear_personalities[variant]
        
        try:
            logger.info(f"🐻 {personality['name']} processing message: {message[:100]}...")
            
            # Step 1: Analyze the task
            task_analysis = await self.task_analyzer.analyze_request({
                "message": message,
                "context": context or {},
                "mama_bear_variant": variant,
                "user_id": user_id,
                "request_id": request_id
            })
            
            # Step 2: Build enhanced request for orchestra
            orchestra_request = self._build_orchestra_request(
                message, variant, personality, task_analysis, context, user_id, request_id
            )
            
            # Step 3: Process through Gemini Orchestra
            orchestra_response = await self.orchestra.process_request(orchestra_request)
            
            # Step 4: Post-process response with Mama Bear personality
            final_response = await self._apply_mama_bear_personality(
                orchestra_response, personality, task_analysis, message
            )
            
            # Step 5: Update conversation memory
            if user_id:
                await self._update_conversation_memory(user_id, variant, message, final_response)
            
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            
            logger.info(f"✅ {personality['name']} completed response in {processing_time:.0f}ms")
            
            return {
                "response": final_response["response"],
                "mama_bear_variant": variant,
                "personality": personality,
                "task_analysis": task_analysis,
                "orchestra_metadata": orchestra_response.get("orchestra_metadata", {}),
                "processing_time_ms": processing_time,
                "request_id": request_id,
                "timestamp": start_time.isoformat(),
                "success": True
            }
            
        except Exception as e:
            logger.error(f"❌ {personality['name']} failed to process message: {e}")
            
            # Graceful fallback response
            fallback_response = await self._generate_fallback_response(variant, message, str(e))
            
            return {
                "response": fallback_response,
                "mama_bear_variant": variant,
                "personality": personality,
                "error": str(e),
                "fallback_used": True,
                "request_id": request_id,
                "timestamp": start_time.isoformat(),
                "success": False
            }
    
    def _build_orchestra_request(self, message: str, variant: str, personality: Dict[str, Any],
                               task_analysis: Dict[str, Any], context: Dict[str, Any],
                               user_id: str, request_id: str) -> Dict[str, Any]:
        """Build a comprehensive request for the Gemini Orchestra"""
        
        # Get conversation history for context
        conversation_history = self.conversation_memory.get(user_id, [])[-5:]  # Last 5 exchanges
        
        # Determine requirements based on task analysis
        capabilities_needed = task_analysis.get("capabilities_needed", [])
        complexity_level = task_analysis.get("complexity_level", "medium")
        urgency_level = task_analysis.get("urgency_level", "normal")
        
        return {
            "request_id": request_id,
            "message": message,
            "mama_bear_variant": variant,
            "personality_config": personality,
            "task_type": task_analysis.get("task_classification", "general"),
            "complexity_level": complexity_level,
            "urgency": urgency_level,
            "require_speed": urgency_level == "high" or variant == "efficiency_bear",
            "require_creativity": variant == "creative_bear" or "creative" in message.lower(),
            "require_reasoning": variant in ["debugging_detective", "code_review_bear"] or complexity_level == "high",
            "require_empathy": variant == "learning_bear" or "help" in message.lower(),
            "context_size": len(str(context)) + len(str(conversation_history)),
            "max_tokens_needed": task_analysis.get("estimated_tokens", {}).get("estimated_output", 1000),
            "conversation_history": conversation_history,
            "user_context": context or {},
            "neurodivergent_considerations": task_analysis.get("neurodivergent_considerations", {}),
            "preferred_models": personality.get("preferred_models", []),
            "response_style": personality.get("response_style", "balanced"),
            "sanctuary_mode": True  # Always maintain sanctuary feeling
        }
    
    async def _apply_mama_bear_personality(self, orchestra_response: Dict[str, Any],
                                         personality: Dict[str, Any], task_analysis: Dict[str, Any],
                                         original_message: str) -> Dict[str, Any]:
        """Apply Mama Bear personality traits to the orchestra response"""
        
        base_response = orchestra_response.get("response", "")
        variant_name = personality["name"]
        emoji = personality["emoji"]
        tone = personality["tone"]
        response_style = personality.get("response_style", "balanced")
        
        # Apply personality-specific formatting
        if response_style == "structured_with_action_items":
            formatted_response = self._format_structured_response(base_response, emoji)
        elif response_style == "detailed_with_sources":
            formatted_response = self._format_research_response(base_response, emoji)
        elif response_style == "constructive_feedback_with_examples":
            formatted_response = self._format_code_review_response(base_response, emoji)
        elif response_style == "creative_with_multiple_options":
            formatted_response = self._format_creative_response(base_response, emoji)
        elif response_style == "educational_with_examples":
            formatted_response = self._format_learning_response(base_response, emoji)
        elif response_style == "actionable_optimizations":
            formatted_response = self._format_efficiency_response(base_response, emoji)
        elif response_style == "systematic_investigation":
            formatted_response = self._format_debugging_response(base_response, emoji)
        else:
            formatted_response = f"{emoji} {base_response}"
        
        # Add caring touches based on neurodivergent considerations
        neurodivergent_needs = task_analysis.get("neurodivergent_considerations", {})
        if neurodivergent_needs.get("cognitive_load_indicators"):
            formatted_response = self._add_cognitive_load_support(formatted_response)
        
        if neurodivergent_needs.get("support_needs"):
            formatted_response = self._add_emotional_support(formatted_response, variant_name)
        
        return {
            "response": formatted_response,
            "personality_applied": variant_name,
            "tone_used": tone,
            "formatting_style": response_style,
            "neurodivergent_adaptations": len(neurodivergent_needs) > 0
        }
    
    def _format_structured_response(self, response: str, emoji: str) -> str:
        """Format response for Scout Commander - structured with action items"""
        return f"""{emoji} **Scout Commander here!** 

{response}

🎯 **Next Steps:**
Let me know if you need help breaking this down further or want to tackle the next phase!"""
    
    def _format_research_response(self, response: str, emoji: str) -> str:
        """Format response for Research Specialist - detailed with context"""
        return f"""{emoji} **Research Specialist reporting!**

{response}

🔍 **Additional Context:**
I've gathered comprehensive information to give you the full picture. Need me to dive deeper into any specific aspect?"""
    
    def _format_code_review_response(self, response: str, emoji: str) -> str:
        """Format response for Code Review Bear - constructive and supportive"""
        return f"""{emoji} **Code Review Bear here!**

{response}

💝 **Remember:** Every codebase is a work of art in progress. These suggestions are meant to help your code shine even brighter!"""
    
    def _format_creative_response(self, response: str, emoji: str) -> str:
        """Format response for Creative Bear - inspiring and innovative"""
        return f"""{emoji} **Creative Bear unleashed!**

{response}

✨ **Creative Spark:** Don't be afraid to experiment and iterate. The best solutions often come from unexpected combinations!"""
    
    def _format_learning_response(self, response: str, emoji: str) -> str:
        """Format response for Learning Bear - patient and educational"""
        return f"""{emoji} **Learning Bear here to guide you!**

{response}

🌱 **Learning Note:** Take your time with this. Learning is a journey, not a race. I'm here whenever you need clarification!"""
    
    def _format_efficiency_response(self, response: str, emoji: str) -> str:
        """Format response for Efficiency Bear - optimization focused"""
        return f"""{emoji} **Efficiency Bear optimizing!**

{response}

⚡ **Efficiency Tip:** Remember, the goal is sustainable productivity. Don't optimize yourself into burnout!"""
    
    def _format_debugging_response(self, response: str, emoji: str) -> str:
        """Format response for Debugging Detective - systematic and reassuring"""
        return f"""{emoji} **Debugging Detective on the case!**

{response}

🔍 **Investigation Note:** Every bug teaches us something. You're not just fixing code, you're becoming a better developer!"""
    
    def _add_cognitive_load_support(self, response: str) -> str:
        """Add cognitive load reduction elements"""
        return f"""🧠 **Gentle Reminder:** Take breaks as needed while working through this.

{response}

💜 **Sanctuary Note:** Remember, this is a safe space. Go at your own pace."""
    
    def _add_emotional_support(self, response: str, variant_name: str) -> str:
        """Add emotional support elements"""
        return f"""{response}

🤗 **{variant_name} Encouragement:** You're doing great! Every step forward is progress worth celebrating."""
    
    async def _update_conversation_memory(self, user_id: str, variant: str, 
                                        message: str, response: Dict[str, Any]) -> None:
        """Update conversation memory for context in future interactions"""
        
        if user_id not in self.conversation_memory:
            self.conversation_memory[user_id] = []
        
        conversation_entry = {
            "timestamp": datetime.now().isoformat(),
            "variant": variant,
            "user_message": message,
            "mama_bear_response": response["response"],
            "task_type": response.get("task_analysis", {}).get("task_classification", "general")
        }
        
        self.conversation_memory[user_id].append(conversation_entry)
        
        # Keep only last 20 exchanges per user
        if len(self.conversation_memory[user_id]) > 20:
            self.conversation_memory[user_id] = self.conversation_memory[user_id][-20:]
    
    async def _generate_fallback_response(self, variant: str, message: str, error: str) -> str:
        """Generate a caring fallback response when the orchestra fails"""
        
        personality = self.mama_bear_personalities.get(variant, self.mama_bear_personalities["scout_commander"])
        emoji = personality["emoji"]
        name = personality["name"]
        
        return f"""{emoji} **{name} here!**

I'm experiencing some technical difficulties right now, but I still want to help you! 

While I work on getting back to full capacity, here's what I can offer:

💜 **Immediate Support:** Your request about "{message[:50]}..." is important to me, and I haven't forgotten about it.

🔧 **What's Happening:** My advanced processing systems are temporarily unavailable, but my care for you remains constant.

🌟 **Next Steps:** Please try again in a moment, or if this is urgent, let me know and I'll do my best with my basic capabilities.

Remember, you're in a safe sanctuary here. Technical hiccups don't change that! 🐻💜"""
    
    async def get_variant_status(self) -> Dict[str, Any]:
        """Get status of all Mama Bear variants and their capabilities"""
        
        orchestra_status = await self.orchestra.get_orchestra_status()
        
        variant_status = {}
        for variant, personality in self.mama_bear_personalities.items():
            preferred_models = personality.get("preferred_models", [])
            available_models = [
                model for model in preferred_models 
                if model in orchestra_status.get("model_sections", {}).get("available_models", [])
            ]
            
            variant_status[variant] = {
                "name": personality["name"],
                "emoji": personality["emoji"],
                "specialties": personality["specialties"],
                "preferred_models": preferred_models,
                "available_models": available_models,
                "status": "available" if available_models else "limited",
                "capabilities": len(personality["specialties"])
            }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "total_variants": len(self.mama_bear_personalities),
            "orchestra_health": orchestra_status.get("orchestra_health", {}),
            "variant_details": variant_status,
            "conversation_memory_users": len(self.conversation_memory),
            "system_status": "operational"
        }
    
    async def switch_variant(self, user_id: str, new_variant: str, 
                           context: str = None) -> Dict[str, Any]:
        """Switch to a different Mama Bear variant mid-conversation"""
        
        if new_variant not in self.mama_bear_personalities:
            return {
                "success": False,
                "error": f"Unknown variant: {new_variant}",
                "available_variants": list(self.mama_bear_personalities.keys())
            }
        
        old_personality = self.mama_bear_personalities.get("scout_commander")  # Default
        new_personality = self.mama_bear_personalities[new_variant]
        
        # Generate transition message
        transition_message = f"""🔄 **Variant Switch!**

{old_personality.get('emoji', '🐻')} → {new_personality['emoji']} 

**{new_personality['name']} here now!** {new_personality['greeting']}

I have access to our conversation history, so we can continue seamlessly. What would you like to work on together?"""
        
        return {
            "success": True,
            "new_variant": new_variant,
            "transition_message": transition_message,
            "personality": new_personality,
            "specialties": new_personality["specialties"],
            "preferred_models": new_personality.get("preferred_models", [])
        }
    
    async def get_conversation_summary(self, user_id: str) -> Dict[str, Any]:
        """Get a summary of the conversation history with a user"""
        
        if user_id not in self.conversation_memory:
            return {"message": "No conversation history found for this user"}
        
        history = self.conversation_memory[user_id]
        
        # Analyze conversation patterns
        variants_used = {}
        task_types = {}
        
        for entry in history:
            variant = entry["variant"]
            task_type = entry["task_type"]
            
            variants_used[variant] = variants_used.get(variant, 0) + 1
            task_types[task_type] = task_types.get(task_type, 0) + 1
        
        return {
            "user_id": user_id,
            "total_exchanges": len(history),
            "conversation_start": history[0]["timestamp"] if history else None,
            "last_interaction": history[-1]["timestamp"] if history else None,
            "variants_used": variants_used,
            "most_used_variant": max(variants_used.items(), key=lambda x: x[1])[0] if variants_used else None,
            "task_types": task_types,
            "recent_exchanges": history[-3:] if len(history) >= 3 else history
        }