# backend/services/advanced_quota_management.py
"""
⚖️ Advanced Quota Management System
Predictive quota allocation, cross-account balancing, and intelligent pooling
"""

import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import numpy as np
from collections import defaultdict, deque
import statistics

logger = logging.getLogger(__name__)

class QuotaPredictionModel(Enum):
    SIMPLE_MOVING_AVERAGE = "simple_moving_average"
    EXPONENTIAL_SMOOTHING = "exponential_smoothing"
    LINEAR_REGRESSION = "linear_regression"
    SEASONAL_DECOMPOSITION = "seasonal_decomposition"

class QuotaPool(Enum):
    PRODUCTION = "production"
    DEVELOPMENT = "development"
    EMERGENCY = "emergency"
    RESEARCH = "research"

@dataclass
class QuotaAccount:
    """Represents a Google Cloud billing account with multiple API keys"""
    account_id: str
    account_name: str
    api_keys: List[str]
    billing_tier: str  # "free", "pay_per_use", "enterprise"
    daily_budget: float
    current_spend: float = 0.0
    quota_multiplier: float = 1.0  # For enterprise accounts
    geographic_region: str = "global"
    priority_level: int = 1  # 1=highest, 5=lowest
    
    @property
    def budget_utilization(self) -> float:
        return self.current_spend / self.daily_budget if self.daily_budget > 0 else 0.0

@dataclass
class QuotaPrediction:
    """Prediction for quota usage over time"""
    model_id: str
    predicted_usage: List[float]  # Next 24 hours by hour
    confidence_interval: Tuple[float, float]
    prediction_accuracy: float
    time_horizon: int = 24  # Hours
    generated_at: datetime = field(default_factory=datetime.now)

@dataclass
class QuotaAlert:
    """Alert for quota-related issues"""
    alert_id: str
    severity: str  # "info", "warning", "critical"
    message: str
    model_id: str
    account_id: str
    threshold_breached: float
    recommended_action: str
    created_at: datetime = field(default_factory=datetime.now)

class AdvancedQuotaManager:
    """
    ⚖️ Advanced Quota Management System
    Features:
    - Multi-account quota pooling
    - Predictive quota forecasting
    - Intelligent load balancing
    - Cost optimization
    - Alert management
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
        # Account management
        self.quota_accounts: Dict[str, QuotaAccount] = {}
        self.account_api_key_mapping: Dict[str, str] = {}  # api_key -> account_id
        
        # Usage tracking
        self.usage_history: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        self.cost_tracking: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        
        # Prediction system
        self.quota_predictions: Dict[str, QuotaPrediction] = {}
        self.prediction_model = QuotaPredictionModel.EXPONENTIAL_SMOOTHING
        
        # Alert system
        self.active_alerts: Dict[str, QuotaAlert] = {}
        self.alert_thresholds = {
            "quota_warning": 0.8,  # 80% usage
            "quota_critical": 0.95,  # 95% usage
            "cost_warning": 0.8,
            "error_rate_warning": 0.1
        }
        
        # Load balancing
        self.load_balancer = IntelligentLoadBalancer()
        
        # Initialize accounts
        self._initialize_quota_accounts()
        
        # Start background tasks
        asyncio.create_task(self._quota_prediction_loop())
        asyncio.create_task(self._cost_tracking_loop())
        asyncio.create_task(self._alert_monitoring_loop())
        
        logger.info("⚖️ Advanced Quota Manager initialized")
    
    def _initialize_quota_accounts(self):
        """Initialize quota accounts from configuration"""
        
        accounts_config = self.config.get('quota_accounts', [])
        
        for account_config in accounts_config:
            account = QuotaAccount(
                account_id=account_config['account_id'],
                account_name=account_config['name'],
                api_keys=account_config['api_keys'],
                billing_tier=account_config.get('billing_tier', 'pay_per_use'),
                daily_budget=account_config.get('daily_budget', 1000.0),
                quota_multiplier=account_config.get('quota_multiplier', 1.0),
                geographic_region=account_config.get('region', 'global'),
                priority_level=account_config.get('priority', 1)
            )
            
            self.quota_accounts[account.account_id] = account
            
            # Map API keys to accounts
            for api_key in account.api_keys:
                self.account_api_key_mapping[api_key] = account.account_id
        
        logger.info(f"Initialized {len(self.quota_accounts)} quota accounts")
    
    async def get_optimal_model_for_request(self, 
                                          workflow_stage: str,
                                          context_size: int,
                                          urgency: str = "normal") -> Optional[Dict[str, Any]]:
        """
        Get optimal model considering quota, cost, and performance
        """
        
        # Get all available models
        available_models = await self._get_available_models()
        
        if not available_models:
            logger.warning("No models available for request")
            return None
        
        # Score models based on multiple factors
        model_scores = []
        
        for model_info in available_models:
            score = await self._calculate_model_score(
                model_info, workflow_stage, context_size, urgency
            )
            model_scores.append((model_info, score))
        
        # Sort by score and return best option
        model_scores.sort(key=lambda x: x[1], reverse=True)
        best_model, best_score = model_scores[0]
        
        logger.info(f"Selected {best_model['model_id']} with score {best_score:.3f}")
        
        return {
            "model_id": best_model['model_id'],
            "api_key": best_model['api_key'],
            "account_id": best_model['account_id'],
            "estimated_cost": best_model['estimated_cost'],
            "confidence_score": best_score
        }
    
    async def _calculate_model_score(self, 
                                   model_info: Dict[str, Any],
                                   workflow_stage: str,
                                   context_size: int,
                                   urgency: str) -> float:
        """Calculate composite score for model selection"""
        
        # Base scores
        quota_score = await self._get_quota_score(model_info)
        performance_score = await self._get_performance_score(model_info, workflow_stage)
        cost_score = await self._get_cost_score(model_info, context_size)
        availability_score = await self._get_availability_score(model_info)
        
        # Weight based on urgency
        if urgency == "high":
            weights = {"quota": 0.4, "performance": 0.3, "cost": 0.1, "availability": 0.2}
        elif urgency == "low":
            weights = {"quota": 0.2, "performance": 0.2, "cost": 0.4, "availability": 0.2}
        else:  # normal
            weights = {"quota": 0.3, "performance": 0.3, "cost": 0.2, "availability": 0.2}
        
        # Calculate weighted score
        total_score = (
            quota_score * weights["quota"] +
            performance_score * weights["performance"] +
            cost_score * weights["cost"] +
            availability_score * weights["availability"]
        )
        
        return total_score
    
    async def _get_quota_score(self, model_info: Dict[str, Any]) -> float:
        """Score based on current quota availability"""
        
        account_id = model_info['account_id']
        account = self.quota_accounts.get(account_id)
        
        if not account:
            return 0.0
        
        # Get current quota usage
        current_usage = model_info.get('current_quota_usage', 0.0)
        quota_limit = model_info.get('quota_limit', 1.0)
        
        # Calculate availability score
        usage_ratio = current_usage / quota_limit if quota_limit > 0 else 1.0
        availability = max(0, 1 - usage_ratio)
        
        # Factor in prediction
        prediction = self.quota_predictions.get(model_info['model_id'])
        if prediction:
            # Reduce score if predicted to hit quota soon
            predicted_next_hour = prediction.predicted_usage[0] if prediction.predicted_usage else 0
            prediction_penalty = min(0.3, predicted_next_hour / quota_limit)
            availability -= prediction_penalty
        
        return max(0, availability)
    
    async def _get_performance_score(self, model_info: Dict[str, Any], workflow_stage: str) -> float:
        """Score based on model performance for specific workflow stage"""
        
        model_id = model_info['model_id']
        
        # Base performance from model capabilities
        base_performance = model_info.get('base_performance', 0.7)
        
        # Stage-specific performance modifiers
        stage_modifiers = {
            'planning': {
                'gemini-2.5-pro': 1.0,
                'gemini-2.5-flash': 0.8,
                'gemini-1.5-pro': 0.9
            },
            'coding': {
                'gemini-2.5-flash': 1.0,
                'gemini-2.5-pro': 0.9,
                'gemini-1.5-flash': 0.7
            },
            'testing': {
                'gemini-2.5-flash-thinking': 1.0,
                'gemini-2.5-pro': 0.8,
                'gemini-2.5-flash': 0.7
            }
        }
        
        # Find best matching stage modifier
        stage_modifier = 1.0
        if workflow_stage in stage_modifiers:
            for model_pattern, modifier in stage_modifiers[workflow_stage].items():
                if model_pattern in model_id:
                    stage_modifier = modifier
                    break
        
        # Historical performance from usage tracking
        recent_performance = await self._get_recent_performance(model_id)
        
        # Combine scores
        final_score = base_performance * stage_modifier * recent_performance
        return min(1.0, final_score)
    
    async def _get_cost_score(self, model_info: Dict[str, Any], context_size: int) -> float:
        """Score based on cost efficiency"""
        
        base_cost_per_token = model_info.get('cost_per_token', 0.001)
        estimated_tokens = context_size + model_info.get('avg_output_tokens', 1000)
        estimated_cost = base_cost_per_token * estimated_tokens
        
        # Normalize cost score (lower cost = higher score)
        max_acceptable_cost = 0.10  # $0.10 per request
        cost_score = max(0, (max_acceptable_cost - estimated_cost) / max_acceptable_cost)
        
        # Factor in account budget utilization
        account_id = model_info['account_id']
        account = self.quota_accounts.get(account_id)
        if account:
            budget_penalty = account.budget_utilization * 0.3
            cost_score = max(0, cost_score - budget_penalty)
        
        return cost_score
    
    async def _get_availability_score(self, model_info: Dict[str, Any]) -> float:
        """Score based on model availability and health"""
        
        model_id = model_info['model_id']
        
        # Check recent error rate
        recent_errors = await self._get_recent_error_rate(model_id)
        error_penalty = recent_errors * 0.5
        
        # Check if model is in cooldown
        cooldown_penalty = 0.0
        if model_info.get('in_cooldown', False):
            cooldown_penalty = 0.8
        
        # Base availability
        base_availability = 1.0
        
        return max(0, base_availability - error_penalty - cooldown_penalty)
    
    async def predict_quota_usage(self, model_id: str, hours_ahead: int = 24) -> QuotaPrediction:
        """Predict quota usage for a model"""
        
        # Get historical usage data
        usage_history = list(self.usage_history[model_id])
        
        if len(usage_history) < 10:
            # Not enough data for prediction
            return QuotaPrediction(
                model_id=model_id,
                predicted_usage=[0.0] * hours_ahead,
                confidence_interval=(0.0, 0.0),
                prediction_accuracy=0.0
            )
        
        # Apply prediction model
        if self.prediction_model == QuotaPredictionModel.EXPONENTIAL_SMOOTHING:
            predicted_usage = self._exponential_smoothing_prediction(usage_history, hours_ahead)
        elif self.prediction_model == QuotaPredictionModel.SIMPLE_MOVING_AVERAGE:
            predicted_usage = self._moving_average_prediction(usage_history, hours_ahead)
        else:
            predicted_usage = self._simple_linear_prediction(usage_history, hours_ahead)
        
        # Calculate confidence interval
        recent_variance = statistics.variance(usage_history[-20:]) if len(usage_history) >= 20 else 1.0
        confidence_margin = 1.96 * (recent_variance ** 0.5)  # 95% confidence
        
        # Calculate prediction accuracy based on recent predictions
        accuracy = await self._calculate_prediction_accuracy(model_id)
        
        prediction = QuotaPrediction(
            model_id=model_id,
            predicted_usage=predicted_usage,
            confidence_interval=(
                max(0, min(predicted_usage) - confidence_margin),
                max(predicted_usage) + confidence_margin
            ),
            prediction_accuracy=accuracy,
            time_horizon=hours_ahead
        )
        
        self.quota_predictions[model_id] = prediction
        return prediction
    
    def _exponential_smoothing_prediction(self, history: List[float], steps: int) -> List[float]:
        """Exponential smoothing prediction"""
        
        if not history:
            return [0.0] * steps
        
        alpha = 0.3  # Smoothing parameter
        beta = 0.1   # Trend parameter
        
        # Initialize
        s = [history[0]]  # Smoothed values
        t = [0]          # Trend values
        
        # Calculate smoothed values and trends
        for i in range(1, len(history)):
            s_new = alpha * history[i] + (1 - alpha) * (s[-1] + t[-1])
            t_new = beta * (s_new - s[-1]) + (1 - beta) * t[-1]
            s.append(s_new)
            t.append(t_new)
        
        # Predict future values
        predictions = []
        for h in range(1, steps + 1):
            prediction = s[-1] + h * t[-1]
            predictions.append(max(0, prediction))
        
        return predictions
    
    def _moving_average_prediction(self, history: List[float], steps: int) -> List[float]:
        """Simple moving average prediction"""
        
        window_size = min(10, len(history))
        if window_size == 0:
            return [0.0] * steps
        
        recent_average = sum(history[-window_size:]) / window_size
        return [recent_average] * steps
    
    def _simple_linear_prediction(self, history: List[float], steps: int) -> List[float]:
        """Simple linear trend prediction"""
        
        if len(history) < 2:
            return [history[0] if history else 0.0] * steps
        
        # Calculate trend
        x = list(range(len(history)))
        y = history
        
        # Simple linear regression
        n = len(x)
        sum_x = sum(x)
        sum_y = sum(y)
        sum_xy = sum(x[i] * y[i] for i in range(n))
        sum_x2 = sum(x[i] * x[i] for i in range(n))
        
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
        intercept = (sum_y - slope * sum_x) / n
        
        # Predict future values
        predictions = []
        for h in range(1, steps + 1):
            future_x = len(history) + h - 1
            prediction = intercept + slope * future_x
            predictions.append(max(0, prediction))
        
        return predictions
    
    async def _quota_prediction_loop(self):
        """Background task for continuous quota prediction"""
        
        while True:
            try:
                await asyncio.sleep(3600)  # Run every hour
                
                # Update predictions for all models
                for model_id in self.usage_history.keys():
                    await self.predict_quota_usage(model_id)
                
                logger.info("Updated quota predictions for all models")
                
            except Exception as e:
                logger.error(f"Error in quota prediction loop: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes on error
    
    async def _cost_tracking_loop(self):
        """Background task for cost tracking and budget management"""
        
        while True:
            try:
                await asyncio.sleep(300)  # Run every 5 minutes
                
                # Update cost tracking for all accounts
                for account_id, account in self.quota_accounts.items():
                    await self._update_account_costs(account)
                
                # Check budget alerts
                await self._check_budget_alerts()
                
            except Exception as e:
                logger.error(f"Error in cost tracking loop: {e}")
                await asyncio.sleep(60)
    
    async def _alert_monitoring_loop(self):
        """Background task for monitoring and alerting"""
        
        while True:
            try:
                await asyncio.sleep(60)  # Run every minute
                
                # Check various alert conditions
                await self._check_quota_alerts()
                await self._check_performance_alerts()
                await self._check_cost_alerts()
                
                # Clean up old alerts
                await self._cleanup_old_alerts()
                
            except Exception as e:
                logger.error(f"Error in alert monitoring loop: {e}")
                await asyncio.sleep(30)
    
    async def get_quota_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive data for quota management dashboard"""
        
        # Aggregate account information
        account_summary = {}
        for account_id, account in self.quota_accounts.items():
            account_summary[account_id] = {
                "name": account.account_name,
                "budget_utilization": account.budget_utilization,
                "daily_budget": account.daily_budget,
                "current_spend": account.current_spend,
                "billing_tier": account.billing_tier,
                "api_key_count": len(account.api_keys),
                "priority_level": account.priority_level
            }
        
        # Model predictions summary
        predictions_summary = {}
        for model_id, prediction in self.quota_predictions.items():
            predictions_summary[model_id] = {
                "next_hour_usage": prediction.predicted_usage[0] if prediction.predicted_usage else 0,
                "prediction_accuracy": prediction.prediction_accuracy,
                "confidence_range": prediction.confidence_interval
            }
        
        # Active alerts summary
        alerts_summary = {
            "critical": len([a for a in self.active_alerts.values() if a.severity == "critical"]),
            "warning": len([a for a in self.active_alerts.values() if a.severity == "warning"]),
            "info": len([a for a in self.active_alerts.values() if a.severity == "info"])
        }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "accounts": account_summary,
            "predictions": predictions_summary,
            "alerts": alerts_summary,
            "active_alerts": [
                {
                    "id": alert.alert_id,
                    "severity": alert.severity,
                    "message": alert.message,
                    "model_id": alert.model_id,
                    "recommended_action": alert.recommended_action
                }
                for alert in self.active_alerts.values()
            ],
            "system_health": await self._calculate_system_health()
        }
    
    async def _calculate_system_health(self) -> Dict[str, float]:
        """Calculate overall system health metrics"""
        
        # Account health (budget utilization)
        account_health = 1.0
        if self.quota_accounts:
            avg_budget_util = sum(a.budget_utilization for a in self.quota_accounts.values()) / len(self.quota_accounts)
            account_health = max(0, 1 - avg_budget_util)
        
        # Quota availability
        quota_health = 1.0  # Would calculate based on available quota across all models
        
        # Error rate health
        error_health = 1.0  # Would calculate based on recent error rates
        
        # Overall system health
        overall_health = (account_health + quota_health + error_health) / 3
        
        return {
            "overall": overall_health,
            "accounts": account_health,
            "quota": quota_health,
            "errors": error_health
        }

class IntelligentLoadBalancer:
    """Intelligent load balancing across multiple models and accounts"""
    
    def __init__(self):
        self.request_counts = defaultdict(int)
        self.response_times = defaultdict(list)
        self.success_rates = defaultdict(float)
    
    async def balance_request(self, available_models: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Select optimal model using load balancing algorithm"""
        
        if not available_models:
            return None
        
        # Score each model based on current load
        model_scores = []
        
        for model in available_models:
            model_id = model['model_id']
            
            # Load score (lower is better)
            current_load = self.request_counts.get(model_id, 0)
            load_score = 1.0 / (1.0 + current_load * 0.1)
            
            # Performance score
            avg_response_time = statistics.mean(self.response_times.get(model_id, [1.0]))
            response_score = 1.0 / (1.0 + avg_response_time * 0.1)
            
            # Success rate score
            success_score = self.success_rates.get(model_id, 0.8)
            
            # Combined score
            total_score = (load_score * 0.4 + response_score * 0.3 + success_score * 0.3)
            model_scores.append((model, total_score))
        
        # Select best model
        model_scores.sort(key=lambda x: x[1], reverse=True)
        selected_model = model_scores[0][0]
        
        # Update load tracking
        self.request_counts[selected_model['model_id']] += 1
        
        return selected_model
    
    def record_response(self, model_id: str, response_time: float, success: bool):
        """Record response metrics for load balancing"""
        
        # Update response times
        if model_id not in self.response_times:
            self.response_times[model_id] = []
        self.response_times[model_id].append(response_time)
        
        # Keep only recent response times
        if len(self.response_times[model_id]) > 100:
            self.response_times[model_id] = self.response_times[model_id][-100:]
        
        # Update success rates (exponential moving average)
        current_rate = self.success_rates.get(model_id, 0.8)
        alpha = 0.1
        new_rate = alpha * (1.0 if success else 0.0) + (1 - alpha) * current_rate
        self.success_rates[model_id] = new_rate
        
        # Decay request counts over time
        self.request_counts[model_id] = max(0, self.request_counts[model_id] - 0.1)