"""
🐻 Podplay Sanctuary Services - Initialization Module
Provides all core services for the Mama Bear sanctuary
"""

import logging
import asyncio
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Global service instances
_services = {}
_initialized = False

class MockService:
    """Mock service for development"""
    def __init__(self, name: str):
        self.name = name
        self.initialized = True
    
    async def health_check(self):
        return {"status": "healthy", "service": self.name}

# === SERVICE INITIALIZATION ===

async def initialize_all_services():
    """Initialize all sanctuary services"""
    global _services, _initialized
    
    try:
        logger.info("🚀 Initializing Podplay Sanctuary services...")
        
        # Try to import and initialize real service implementations
        try:
            from .mama_bear_orchestration import AgentOrchestrator
            from .mama_bear_memory_system import MemoryManager
            from .enhanced_scrapybara_integration import ScrapybaraManager
            from .mama_bear_model_manager import ModelManager
            
            # Initialize real services
            memory_manager = MemoryManager()
            model_manager = ModelManager()
            scrapybara_manager = ScrapybaraManager()
            
            # Initialize orchestrator with all services
            orchestrator = AgentOrchestrator(memory_manager, model_manager, scrapybara_manager)
            
            _services = {
                'mama_bear_agent': orchestrator,
                'memory_manager': memory_manager,
                'scrapybara_manager': scrapybara_manager,
                'theme_manager': MockService('Theme Manager'),  # Keep as mock for now
                'model_manager': model_manager
            }
            
            logger.info("✅ All services initialized successfully with REAL implementations!")
            logger.info("🐻 Mama Bear agents are now fully aware and capable!")
            
        except ImportError as e:
            logger.warning(f"Some services not available, using available implementations: {e}")
            # Try to initialize what we can
            try:
                from .mama_bear_memory_system import initialize_memory_manager
                memory_manager = initialize_memory_manager()
                logger.info("✅ Real MemoryManager initialized successfully")
            except Exception as mem_error:
                logger.warning(f"MemoryManager initialization failed: {mem_error}")
                memory_manager = MockService('Memory Manager')
            
            _services = {
                'mama_bear_agent': MockService('Mama Bear Agent'),
                'memory_manager': memory_manager,
                'scrapybara_manager': MockService('Scrapybara Manager'),
                'theme_manager': MockService('Theme Manager')
            }
            
            if isinstance(memory_manager, MockService):
                logger.warning("⚠️ Running with some mock services - some features have limited capabilities")
            else:
                logger.info("✅ Memory system operational - persistent conversations enabled")
        
        _initialized = True
        logger.info("✅ Service initialization completed")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        raise

async def shutdown_all_services():
    """Shutdown all services"""
    global _services, _initialized
    
    try:
        logger.info("🛑 Shutting down all services...")
        _services.clear()
        _initialized = False
        logger.info("✅ All services shut down successfully")
        
    except Exception as e:
        logger.error(f"❌ Error shutting down services: {e}")

# === SERVICE GETTERS ===

def get_mama_bear_agent():
    """Get Mama Bear agent instance"""
    return _services.get('mama_bear_agent', MockService('Mama Bear Agent'))

def get_memory_manager():
    """Get memory manager instance"""
    return _services.get('memory_manager', MockService('Memory Manager'))

def get_scrapybara_manager():
    """Get Scrapybara manager instance"""
    return _services.get('scrapybara_manager', MockService('Scrapybara Manager'))

def get_theme_manager():
    """Get theme manager instance"""
    return _services.get('theme_manager', MockService('Theme Manager'))

def get_service_status():
    """Get status of all services"""
    return {
        'initialized': _initialized,
        'services': {
            name: service.initialized if hasattr(service, 'initialized') else True
            for name, service in _services.items()
        },
        'total_services': len(_services)
    }

# === ASYNC HELPER ===

def run_async(coro):
    """Helper to run async functions in sync context"""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Create a new task
            return asyncio.create_task(coro)
        else:
            return loop.run_until_complete(coro)
    except RuntimeError:
        # No event loop, create one
        return asyncio.run(coro)

# Initialize on import
if not _initialized:
    try:
        run_async(initialize_all_services())
    except Exception as e:
        logger.warning(f"Could not initialize services on import: {e}")