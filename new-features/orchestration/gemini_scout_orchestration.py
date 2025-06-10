# backend/services/enhanced_gemini_scout_orchestration.py
"""
🎯 Enhanced Mama Bear Scout with Complete Gemini 2.5 Model Orchestration
Autonomous quota management and intelligent routing for production workflows
"""

import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import google.generativeai as genai
from collections import defaultdict, deque

logger = logging.getLogger(__name__)

class WorkflowStage(Enum):
    PLANNING = "planning"
    ENVIRONMENT = "environment" 
    CODING = "coding"
    TESTING = "testing"
    DEPLOYMENT = "deployment"

class ModelTier(Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    FALLBACK = "fallback"
    EMERGENCY = "emergency"

@dataclass
class QuotaStatus:
    model_id: str
    requests_per_minute: int = 60
    requests_per_day: int = 1500
    current_minute_count: int = 0
    current_day_count: int = 0
    last_reset_minute: datetime = field(default_factory=datetime.now)
    last_reset_day: datetime = field(default_factory=datetime.now)
    consecutive_errors: int = 0
    last_error_time: Optional[datetime] = None
    is_healthy: bool = True
    cooldown_until: Optional[datetime] = None
    
    @property
    def minute_quota_available(self) -> float:
        return max(0, self.requests_per_minute - self.current_minute_count) / self.requests_per_minute
    
    @property
    def day_quota_available(self) -> float:
        return max(0, self.requests_per_day - self.current_day_count) / self.requests_per_day
    
    @property
    def overall_health_score(self) -> float:
        if not self.is_healthy or self.cooldown_until and self.cooldown_until > datetime.now():
            return 0.0
        health = min(self.minute_quota_available, self.day_quota_available)
        error_penalty = max(0, 1 - (self.consecutive_errors * 0.2))
        return health * error_penalty

class EnhancedGeminiScoutOrchestrator:
    """
    🎯 Complete Gemini 2.5 Scout Orchestration System
    Handles autonomous quota management and intelligent model routing
    """
    
    def __init__(self, gemini_api_key: str):
        self.api_key = gemini_api_key
        genai.configure(api_key=gemini_api_key)
        
        # Complete Gemini 2.5 Model Configuration
        self.gemini_models = self._initialize_complete_model_registry()
        
        # Quota management
        self.quota_status: Dict[str, QuotaStatus] = {}
        self.request_history = deque(maxlen=10000)
        
        # Scout workflow state
        self.active_workflows: Dict[str, Dict] = {}
        self.model_performance_cache = defaultdict(list)
        
        # Autonomous routing configuration
        self.routing_preferences = self._configure_routing_preferences()
        
        # Initialize quota tracking
        self._initialize_quota_tracking()
        
        logger.info("🎯 Enhanced Gemini Scout Orchestrator initialized with complete model coverage")
    
    def _initialize_complete_model_registry(self) -> Dict[str, Dict[str, Any]]:
        """Initialize complete Gemini 2.5 model registry with Scout-specific configurations"""
        
        return {
            # PRIMARY TIER - Latest and most capable
            "gemini-2.5-pro-preview-06-05": {
                "tier": ModelTier.PRIMARY,
                "context_window": 1048576,
                "output_limit": 65536,
                "rpm_limit": 60,
                "rpd_limit": 1500,
                "specialties": ["orchestration", "complex_planning", "architecture"],
                "scout_roles": ["master_planner", "architect", "orchestrator"],
                "workflow_stages": [WorkflowStage.PLANNING, WorkflowStage.DEPLOYMENT],
                "cost_tier": "high",
                "latency": "medium"
            },
            
            "gemini-2.5-pro-preview-05-06": {
                "tier": ModelTier.PRIMARY,
                "context_window": 1048576,
                "output_limit": 65536,
                "rpm_limit": 60,
                "rpd_limit": 1500,
                "specialties": ["strategic_planning", "system_design"],
                "scout_roles": ["strategic_planner", "system_architect"],
                "workflow_stages": [WorkflowStage.PLANNING, WorkflowStage.ENVIRONMENT],
                "cost_tier": "high",
                "latency": "medium"
            },
            
            "gemini-2.5-pro-preview-03-25": {
                "tier": ModelTier.SECONDARY,
                "context_window": 1048576,
                "output_limit": 65536,
                "rpm_limit": 60,
                "rpd_limit": 1500,
                "specialties": ["batch_processing", "bulk_operations"],
                "scout_roles": ["batch_processor", "bulk_generator"],
                "workflow_stages": [WorkflowStage.CODING, WorkflowStage.TESTING],
                "cost_tier": "high",
                "latency": "slow"
            },
            
            # SECONDARY TIER - Fast and efficient
            "gemini-2.5-flash-preview-05-20": {
                "tier": ModelTier.SECONDARY,
                "context_window": 1048576,
                "output_limit": 65536,
                "rpm_limit": 120,
                "rpd_limit": 3000,
                "specialties": ["rapid_development", "code_generation"],
                "scout_roles": ["rapid_developer", "code_generator"],
                "workflow_stages": [WorkflowStage.CODING, WorkflowStage.TESTING],
                "cost_tier": "medium",
                "latency": "fast"
            },
            
            "gemini-2.5-flash-preview-04-17": {
                "tier": ModelTier.SECONDARY,
                "context_window": 1048576,
                "output_limit": 65536,
                "rpm_limit": 120,
                "rpd_limit": 3000,
                "specialties": ["fast_prototyping", "quick_iteration"],
                "scout_roles": ["prototyper", "iterator"],
                "workflow_stages": [WorkflowStage.ENVIRONMENT, WorkflowStage.CODING],
                "cost_tier": "medium",
                "latency": "fast"
            },
            
            # SPECIALIZED TIER - Thinking and reasoning
            "gemini-2.5-flash-preview-04-17-thinking": {
                "tier": ModelTier.FALLBACK,
                "context_window": 1048576,
                "output_limit": 65536,
                "rpm_limit": 60,
                "rpd_limit": 1500,
                "specialties": ["complex_reasoning", "debugging", "optimization"],
                "scout_roles": ["debugger", "optimizer", "problem_solver"],
                "workflow_stages": [WorkflowStage.TESTING, WorkflowStage.DEPLOYMENT],
                "cost_tier": "medium",
                "latency": "slow"
            },
            
            # EMERGENCY TIER - Fallback options
            "gemini-1.5-pro": {
                "tier": ModelTier.EMERGENCY,
                "context_window": 2000000,  # Largest context window
                "output_limit": 8192,
                "rpm_limit": 60,
                "rpd_limit": 1500,
                "specialties": ["large_context", "emergency_fallback"],
                "scout_roles": ["context_master", "emergency_backup"],
                "workflow_stages": [WorkflowStage.PLANNING, WorkflowStage.CODING],
                "cost_tier": "medium",
                "latency": "medium"
            },
            
            "gemini-1.5-flash": {
                "tier": ModelTier.EMERGENCY,
                "context_window": 1000000,
                "output_limit": 8192,
                "rpm_limit": 120,
                "rpd_limit": 3000,
                "specialties": ["emergency_speed", "basic_tasks"],
                "scout_roles": ["emergency_responder", "basic_assistant"],
                "workflow_stages": [WorkflowStage.ENVIRONMENT, WorkflowStage.TESTING],
                "cost_tier": "low",
                "latency": "ultra_fast"
            }
        }
    
    def _configure_routing_preferences(self) -> Dict[WorkflowStage, List[str]]:
        """Configure model preferences for each workflow stage"""
        
        return {
            WorkflowStage.PLANNING: [
                "gemini-2.5-pro-preview-06-05",    # Best orchestrator
                "gemini-2.5-pro-preview-05-06",    # Strategic planner
                "gemini-1.5-pro"                   # Large context fallback
            ],
            WorkflowStage.ENVIRONMENT: [
                "gemini-2.5-flash-preview-04-17",  # Fast setup
                "gemini-2.5-pro-preview-05-06",    # Complex environment
                "gemini-1.5-flash"                 # Emergency speed
            ],
            WorkflowStage.CODING: [
                "gemini-2.5-flash-preview-05-20",  # Rapid development
                "gemini-2.5-pro-preview-03-25",    # Batch processing
                "gemini-2.5-flash-preview-04-17",  # Quick iteration
                "gemini-1.5-pro"                   # Large context
            ],
            WorkflowStage.TESTING: [
                "gemini-2.5-flash-preview-04-17-thinking",  # Complex debugging
                "gemini-2.5-flash-preview-05-20",           # Fast testing
                "gemini-2.5-pro-preview-03-25",            # Batch testing
                "gemini-1.5-flash"                          # Emergency
            ],
            WorkflowStage.DEPLOYMENT: [
                "gemini-2.5-pro-preview-06-05",             # Master orchestrator
                "gemini-2.5-flash-preview-04-17-thinking",  # Complex optimization
                "gemini-2.5-pro-preview-05-06"              # Strategic deployment
            ]
        }
    
    def _initialize_quota_tracking(self):
        """Initialize quota tracking for all models"""
        
        for model_id, config in self.gemini_models.items():
            self.quota_status[model_id] = QuotaStatus(
                model_id=model_id,
                requests_per_minute=config["rpm_limit"],
                requests_per_day=config["rpd_limit"]
            )
    
    async def execute_scout_workflow(self, project_description: str, user_id: str, 
                                   workflow_id: str = None) -> Dict[str, Any]:
        """
        Execute complete Scout workflow with autonomous model routing
        """
        
        if not workflow_id:
            workflow_id = f"scout_{int(time.time())}"
        
        # Initialize workflow state
        workflow_state = {
            "id": workflow_id,
            "user_id": user_id,
            "description": project_description,
            "status": "planning",
            "started_at": datetime.now(),
            "stages": {},
            "models_used": [],
            "total_requests": 0,
            "quota_switches": 0
        }
        
        self.active_workflows[workflow_id] = workflow_state
        
        try:
            logger.info(f"🚀 Starting Scout workflow {workflow_id}")
            
            # Stage 1: Planning
            planning_result = await self._execute_workflow_stage(
                WorkflowStage.PLANNING, project_description, workflow_state
            )
            
            # Stage 2: Environment Setup
            environment_result = await self._execute_workflow_stage(
                WorkflowStage.ENVIRONMENT, planning_result["plan"], workflow_state
            )
            
            # Stage 3: Coding (Parallel processing for efficiency)
            coding_result = await self._execute_parallel_coding_stage(
                environment_result["environment_config"], workflow_state
            )
            
            # Stage 4: Testing
            testing_result = await self._execute_workflow_stage(
                WorkflowStage.TESTING, coding_result["code_artifacts"], workflow_state
            )
            
            # Stage 5: Deployment
            deployment_result = await self._execute_workflow_stage(
                WorkflowStage.DEPLOYMENT, testing_result["validated_code"], workflow_state
            )
            
            # Finalize workflow
            workflow_state["status"] = "completed"
            workflow_state["completed_at"] = datetime.now()
            
            final_result = {
                "workflow_id": workflow_id,
                "status": "success",
                "results": {
                    "planning": planning_result,
                    "environment": environment_result,
                    "coding": coding_result,
                    "testing": testing_result,
                    "deployment": deployment_result
                },
                "metadata": {
                    "total_time": (workflow_state["completed_at"] - workflow_state["started_at"]).total_seconds(),
                    "models_used": workflow_state["models_used"],
                    "total_requests": workflow_state["total_requests"],
                    "quota_switches": workflow_state["quota_switches"]
                }
            }
            
            logger.info(f"✅ Scout workflow {workflow_id} completed successfully")
            return final_result
            
        except Exception as e:
            logger.error(f"❌ Scout workflow {workflow_id} failed: {e}")
            workflow_state["status"] = "failed"
            workflow_state["error"] = str(e)
            
            return {
                "workflow_id": workflow_id,
                "status": "failed",
                "error": str(e),
                "partial_results": workflow_state.get("stages", {})
            }
    
    async def _execute_workflow_stage(self, stage: WorkflowStage, input_data: str, 
                                    workflow_state: Dict) -> Dict[str, Any]:
        """Execute a single workflow stage with intelligent model selection"""
        
        stage_start = time.time()
        
        # Get optimal model for this stage
        selected_model = await self._select_optimal_model_for_stage(stage, input_data)
        
        if not selected_model:
            raise Exception(f"No available models for stage {stage.value}")
        
        # Prepare stage-specific prompt
        prompt = self._build_stage_prompt(stage, input_data, workflow_state)
        
        # Execute with retry logic
        result = await self._execute_with_retry(selected_model, prompt, stage)
        
        # Update workflow state
        stage_duration = time.time() - stage_start
        workflow_state["stages"][stage.value] = {
            "model_used": selected_model,
            "duration": stage_duration,
            "result": result,
            "completed_at": datetime.now().isoformat()
        }
        workflow_state["models_used"].append(selected_model)
        workflow_state["total_requests"] += 1
        
        logger.info(f"✅ Stage {stage.value} completed with {selected_model} in {stage_duration:.2f}s")
        
        return result
    
    async def _execute_parallel_coding_stage(self, environment_config: Dict, 
                                           workflow_state: Dict) -> Dict[str, Any]:
        """Execute coding stage with parallel model processing for efficiency"""
        
        coding_tasks = [
            {"type": "frontend", "description": "Generate React components and UI"},
            {"type": "backend", "description": "Generate API endpoints and business logic"},
            {"type": "database", "description": "Generate schema and migrations"},
            {"type": "configuration", "description": "Generate deployment configs"}
        ]
        
        # Execute tasks in parallel using different models
        coding_results = await asyncio.gather(
            *[self._execute_coding_task(task, environment_config, workflow_state) 
              for task in coding_tasks],
            return_exceptions=True
        )
        
        # Combine results
        combined_result = {
            "code_artifacts": {},
            "task_results": {}
        }
        
        for i, result in enumerate(coding_results):
            task_type = coding_tasks[i]["type"]
            if isinstance(result, Exception):
                logger.error(f"Coding task {task_type} failed: {result}")
                combined_result["task_results"][task_type] = {"status": "failed", "error": str(result)}
            else:
                combined_result["code_artifacts"][task_type] = result["artifacts"]
                combined_result["task_results"][task_type] = {"status": "success", "model": result["model"]}
        
        return combined_result
    
    async def _execute_coding_task(self, task: Dict, environment_config: Dict, 
                                 workflow_state: Dict) -> Dict[str, Any]:
        """Execute individual coding task with optimal model selection"""
        
        # Select model based on task complexity and current quota
        model = await self._select_optimal_model_for_stage(WorkflowStage.CODING, task["description"])
        
        if not model:
            raise Exception(f"No available models for coding task {task['type']}")
        
        prompt = f"""
        Task: {task['description']}
        Environment: {json.dumps(environment_config, indent=2)}
        
        Generate production-ready code artifacts for {task['type']} development.
        Include proper error handling, documentation, and best practices.
        """
        
        result = await self._execute_with_retry(model, prompt, WorkflowStage.CODING)
        
        return {
            "artifacts": result,
            "model": model,
            "task_type": task["type"]
        }
    
    async def _select_optimal_model_for_stage(self, stage: WorkflowStage, 
                                            context: str) -> Optional[str]:
        """Intelligent model selection based on stage, quota, and performance"""
        
        # Get preferred models for this stage
        preferred_models = self.routing_preferences.get(stage, [])
        
        # Score each model based on availability and performance
        model_scores = []
        
        for model_id in preferred_models:
            if model_id not in self.quota_status:
                continue
                
            quota_info = self.quota_status[model_id]
            health_score = quota_info.overall_health_score
            
            if health_score <= 0:
                continue  # Skip unhealthy models
            
            # Performance bonus based on recent success
            performance_bonus = self._calculate_performance_bonus(model_id)
            
            # Context size compatibility
            context_bonus = self._calculate_context_compatibility(model_id, context)
            
            total_score = health_score * 0.6 + performance_bonus * 0.3 + context_bonus * 0.1
            
            model_scores.append((model_id, total_score))
        
        # Sort by score and return best available model
        if model_scores:
            model_scores.sort(key=lambda x: x[1], reverse=True)
            selected_model = model_scores[0][0]
            
            logger.info(f"🎯 Selected {selected_model} for {stage.value} (score: {model_scores[0][1]:.3f})")
            return selected_model
        
        logger.warning(f"⚠️ No available models for stage {stage.value}")
        return None
    
    def _calculate_performance_bonus(self, model_id: str) -> float:
        """Calculate performance bonus based on recent success rate"""
        
        recent_performance = self.model_performance_cache.get(model_id, [])
        if not recent_performance:
            return 0.5  # Neutral for untested models
        
        success_rate = sum(recent_performance) / len(recent_performance)
        return success_rate
    
    def _calculate_context_compatibility(self, model_id: str, context: str) -> float:
        """Calculate how well model handles the context size"""
        
        context_size = len(context)
        model_config = self.gemini_models.get(model_id, {})
        context_window = model_config.get("context_window", 32768)
        
        if context_size > context_window:
            return 0.0  # Can't handle context
        
        utilization = context_size / context_window
        # Prefer models that aren't too close to their limit
        return max(0, 1 - utilization * 0.8)
    
    async def _execute_with_retry(self, model_id: str, prompt: str, 
                                stage: WorkflowStage, max_retries: int = 3) -> Dict[str, Any]:
        """Execute request with intelligent retry and quota management"""
        
        for attempt in range(max_retries):
            try:
                # Check and update quota
                if not await self._can_make_request(model_id):
                    # Find alternative model
                    alternative = await self._select_optimal_model_for_stage(stage, prompt)
                    if alternative and alternative != model_id:
                        logger.info(f"🔄 Switching from {model_id} to {alternative} due to quota")
                        model_id = alternative
                        # Track quota switch
                        for workflow in self.active_workflows.values():
                            workflow["quota_switches"] = workflow.get("quota_switches", 0) + 1
                    else:
                        # Wait for quota reset
                        await self._wait_for_quota_reset(model_id)
                
                # Make the request
                result = await self._make_model_request(model_id, prompt)
                
                # Update performance tracking
                self._record_request_success(model_id)
                
                return result
                
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed for {model_id}: {e}")
                self._record_request_failure(model_id, str(e))
                
                if attempt == max_retries - 1:
                    raise e
                
                # Wait before retry
                await asyncio.sleep(2 ** attempt)
        
        raise Exception(f"All retry attempts failed for {model_id}")
    
    async def _can_make_request(self, model_id: str) -> bool:
        """Check if model can handle another request"""
        
        quota_info = self.quota_status.get(model_id)
        if not quota_info:
            return False
        
        # Update quota counters
        self._update_quota_counters(quota_info)
        
        # Check health and quota
        return (quota_info.is_healthy and 
                quota_info.current_minute_count < quota_info.requests_per_minute and
                quota_info.current_day_count < quota_info.requests_per_day and
                (not quota_info.cooldown_until or quota_info.cooldown_until <= datetime.now()))
    
    def _update_quota_counters(self, quota_info: QuotaStatus):
        """Update quota counters with time-based resets"""
        
        now = datetime.now()
        
        # Reset minute counter
        if (now - quota_info.last_reset_minute).total_seconds() >= 60:
            quota_info.current_minute_count = 0
            quota_info.last_reset_minute = now
        
        # Reset day counter
        if (now - quota_info.last_reset_day).total_seconds() >= 86400:
            quota_info.current_day_count = 0
            quota_info.last_reset_day = now
    
    async def _wait_for_quota_reset(self, model_id: str):
        """Wait for quota to reset for a specific model"""
        
        quota_info = self.quota_status.get(model_id)
        if not quota_info:
            return
        
        now = datetime.now()
        
        # Calculate wait time for minute reset
        minute_wait = 60 - (now - quota_info.last_reset_minute).total_seconds()
        minute_wait = max(0, minute_wait)
        
        if minute_wait > 0:
            logger.info(f"⏳ Waiting {minute_wait:.1f}s for {model_id} quota reset")
            await asyncio.sleep(minute_wait + 1)  # Small buffer
    
    def _build_stage_prompt(self, stage: WorkflowStage, input_data: str, 
                          workflow_state: Dict) -> str:
        """Build stage-specific prompt for Scout workflow"""
        
        base_context = f"""
You are Scout Commander, an AI agent specialized in autonomous full-stack development.

Workflow ID: {workflow_state['id']}
Current Stage: {stage.value}
Project Description: {workflow_state['description']}
"""
        
        stage_prompts = {
            WorkflowStage.PLANNING: f"""
{base_context}

TASK: Create a comprehensive project plan for this request:
{input_data}

Provide:
1. Technical architecture overview
2. Technology stack recommendations  
3. Project timeline with milestones
4. Resource requirements
5. Risk assessment and mitigation strategies

Return structured JSON with detailed planning information.
""",
            
            WorkflowStage.ENVIRONMENT: f"""
{base_context}

TASK: Set up the development environment based on this plan:
{input_data}

Provide:
1. Environment configuration (Scrapybara/Docker setup)
2. Package dependencies and versions
3. Development tools and extensions
4. Environment variables and secrets management
5. CI/CD pipeline configuration

Return structured JSON with environment setup details.
""",
            
            WorkflowStage.CODING: f"""
{base_context}

TASK: Generate production-ready code based on:
{input_data}

Provide:
1. Complete application code structure
2. Frontend components and styling
3. Backend API endpoints and business logic
4. Database schema and models
5. Configuration files and documentation

Return structured JSON with code artifacts.
""",
            
            WorkflowStage.TESTING: f"""
{base_context}

TASK: Create comprehensive testing suite for:
{input_data}

Provide:
1. Unit tests for all components
2. Integration tests for APIs
3. End-to-end testing scenarios
4. Performance and load testing
5. Security vulnerability assessment

Return structured JSON with testing results and recommendations.
""",
            
            WorkflowStage.DEPLOYMENT: f"""
{base_context}

TASK: Deploy and optimize the application:
{input_data}

Provide:
1. Production deployment configuration
2. Performance optimization recommendations
3. Monitoring and alerting setup
4. Backup and disaster recovery plan
5. Documentation and handover instructions

Return structured JSON with deployment details and live URLs.
"""
        }
        
        return stage_prompts.get(stage, f"{base_context}\n\nProcess: {input_data}")
    
    async def _make_model_request(self, model_id: str, prompt: str) -> Dict[str, Any]:
        """Make actual request to Gemini model"""
        
        try:
            # Initialize model
            model = genai.GenerativeModel(model_id)
            
            # Get model configuration
            model_config = self.gemini_models.get(model_id, {})
            
            # Configure generation parameters
            generation_config = genai.GenerationConfig(
                max_output_tokens=min(8192, model_config.get("output_limit", 8192)),
                temperature=0.3,
                top_p=0.9,
                top_k=40
            )
            
            # Make the request
            response = await model.generate_content_async(
                prompt,
                generation_config=generation_config
            )
            
            # Update quota counters
            quota_info = self.quota_status[model_id]
            quota_info.current_minute_count += 1
            quota_info.current_day_count += 1
            
            # Try to parse as JSON, fallback to text
            result_text = response.text
            try:
                result_data = json.loads(result_text)
            except json.JSONDecodeError:
                result_data = {"content": result_text, "format": "text"}
            
            return {
                "success": True,
                "data": result_data,
                "model_used": model_id,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Model request failed for {model_id}: {e}")
            raise e
    
    def _record_request_success(self, model_id: str):
        """Record successful request for performance tracking"""
        
        # Update quota status
        quota_info = self.quota_status.get(model_id)
        if quota_info:
            quota_info.consecutive_errors = 0
            quota_info.is_healthy = True
            quota_info.last_error_time = None
        
        # Update performance cache
        self.model_performance_cache[model_id].append(1.0)
        if len(self.model_performance_cache[model_id]) > 50:
            self.model_performance_cache[model_id].pop(0)
    
    def _record_request_failure(self, model_id: str, error: str):
        """Record failed request and update model health"""
        
        quota_info = self.quota_status.get(model_id)
        if quota_info:
            quota_info.consecutive_errors += 1
            quota_info.last_error_time = datetime.now()
            
            # Apply cooldown for repeated failures
            if quota_info.consecutive_errors >= 3:
                quota_info.cooldown_until = datetime.now() + timedelta(minutes=5)
                quota_info.is_healthy = False
                logger.warning(f"🚨 Model {model_id} in cooldown due to {quota_info.consecutive_errors} errors")
        
        # Update performance cache
        self.model_performance_cache[model_id].append(0.0)
        if len(self.model_performance_cache[model_id]) > 50:
            self.model_performance_cache[model_id].pop(0)
    
    async def get_orchestration_status(self) -> Dict[str, Any]:
        """Get comprehensive status of the orchestration system"""
        
        model_status = {}
        for model_id, quota_info in self.quota_status.items():
            model_config = self.gemini_models[model_id]
            performance = self.model_performance_cache.get(model_id, [])
            
            model_status[model_id] = {
                "tier": model_config["tier"].value,
                "health_score": quota_info.overall_health_score,
                "quota_usage": {
                    "minute": f"{quota_info.current_minute_count}/{quota_info.requests_per_minute}",
                    "day": f"{quota_info.current_day_count}/{quota_info.requests_per_day}"
                },
                "performance": {
                    "success_rate": sum(performance) / len(performance) if performance else 0,
                    "consecutive_errors": quota_info.consecutive_errors
                },
                "specialties": model_config["specialties"],
                "is_healthy": quota_info.is_healthy,
                "cooldown_until": quota_info.cooldown_until.isoformat() if quota_info.cooldown_until else None
            }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "active_workflows": len(self.active_workflows),
            "total_models": len(self.gemini_models),
            "healthy_models": sum(1 for info in self.quota_status.values() if info.is_healthy),
            "model_status": model_status,
            "routing_preferences": {stage.value: models for stage, models in self.routing_preferences.items()}
        }