#!/usr/bin/env python3
"""
🔍 Comprehensive Model Discovery & Testing Suite
Discovers and tests ALL available models across all services for multi-modal chat integration
"""

import os
import sys
import asyncio
import json
import time
from pathlib import Path
from typing import Dict, List, Any, Set
from datetime import datetime
import traceback

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

# Load environment
from dotenv import load_dotenv
load_dotenv()

class ComprehensiveModelDiscovery:
    def __init__(self):
        self.all_models = {}
        self.test_results = {}
        self.resource_inventory = {}
        self.test_message = "Hello! Please respond with exactly: 'I am [model_name] and I can help you.' Nothing more."
        
        # Track discovered models by service
        self.discovered_models = {
            'google_ai': set(),
            'vertex_ai': set(),
            'anthropic': set(),
            'openai': set(),
            'express_mode': set()
        }

    def print_section(self, title: str):
        """Print a formatted section header"""
        print(f"\n{'='*80}")
        print(f"🔍 {title}")
        print('='*80)

    def print_subsection(self, title: str):
        """Print a formatted subsection header"""
        print(f"\n{'-'*50}")
        print(f"📋 {title}")
        print('-'*50)

    async def discover_google_ai_models(self):
        """Discover ALL available Google AI models"""
        self.print_section("Discovering Google AI Models")
        
        try:
            import google.generativeai as genai
            
            api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('VERTEX_AI_GEMINI_API_KEY')
            if not api_key:
                print("❌ Google AI API key not found")
                return
            
            genai.configure(api_key=api_key)
            print("✅ Google AI configured")
            
            # Discover all available models
            try:
                print("🔍 Discovering available models...")
                all_models = list(genai.list_models())
                
                for model in all_models:
                    model_name = model.name.replace('models/', '')
                    
                    # Check if model supports generateContent
                    if 'generateContent' in model.supported_generation_methods:
                        self.discovered_models['google_ai'].add(model_name)
                        print(f"   📝 Found: {model_name}")
                        
                        # Store model details
                        self.all_models[f"google_ai_{model_name}"] = {
                            'service': 'google_ai',
                            'model_name': model_name,
                            'display_name': model.display_name if hasattr(model, 'display_name') else model_name,
                            'description': model.description if hasattr(model, 'description') else 'Google AI Model',
                            'supported_methods': model.supported_generation_methods,
                            'input_token_limit': getattr(model, 'input_token_limit', 'Unknown'),
                            'output_token_limit': getattr(model, 'output_token_limit', 'Unknown')
                        }
                    else:
                        print(f"   ⏭️ Skipping: {model_name} (no generateContent support)")
                
                print(f"\n✅ Discovered {len(self.discovered_models['google_ai'])} Google AI models")
                
            except Exception as e:
                print(f"❌ Model discovery failed: {e}")
                
        except Exception as e:
            print(f"❌ Google AI setup failed: {e}")

    async def discover_vertex_ai_models(self):
        """Discover ALL available Vertex AI models"""
        self.print_section("Discovering Vertex AI Models")
        
        try:
            import vertexai
            from vertexai.generative_models import GenerativeModel
            from google.oauth2 import service_account
            from google.cloud import aiplatform
            
            # Get service account credentials
            service_account_path = os.getenv('PRIMARY_SERVICE_ACCOUNT_PATH')
            project_id = os.getenv('VERTEX_AI_PROJECT_ID', 'podplay-build-beta')
            location = os.getenv('VERTEX_AI_LOCATION', 'us-central1')
            
            print(f"🔐 Service Account: {service_account_path}")
            print(f"📍 Project: {project_id}")
            print(f"📍 Location: {location}")
            
            if not service_account_path or not os.path.exists(service_account_path):
                print("❌ Service account file not found")
                return
            
            # Initialize with service account
            credentials = service_account.Credentials.from_service_account_file(
                service_account_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            
            vertexai.init(project=project_id, location=location, credentials=credentials)
            aiplatform.init(project=project_id, location=location, credentials=credentials)
            print("✅ Vertex AI initialized with service account")
            
            # Try to discover models through API
            print("🔍 Discovering Vertex AI models...")
            
            # Known Vertex AI model patterns to test
            vertex_model_candidates = [
                # Gemini models
                "gemini-2.0-flash-exp",
                "gemini-1.5-pro",
                "gemini-1.5-pro-001", 
                "gemini-1.5-pro-002",
                "gemini-1.5-flash",
                "gemini-1.5-flash-001",
                "gemini-1.5-flash-002",
                "gemini-1.0-pro",
                "gemini-1.0-pro-001",
                "gemini-1.0-pro-vision",
                
                # Claude models via Vertex AI
                "claude-3-opus@20240229",
                "claude-3-sonnet@20240229", 
                "claude-3-haiku@20240307",
                "claude-3-5-sonnet@20240620",
                "claude-3-5-haiku@20241022",
                "claude-3-5-sonnet-v2@20241022",
                
                # Anthropic models via Vertex AI (different naming)
                "publishers/anthropic/models/claude-3-opus@20240229",
                "publishers/anthropic/models/claude-3-sonnet@20240229",
                "publishers/anthropic/models/claude-3-haiku@20240307",
                "publishers/anthropic/models/claude-3-5-sonnet@20240620",
                "publishers/anthropic/models/claude-3-5-haiku@20241022",
                "publishers/anthropic/models/claude-3-5-sonnet-v2@20241022",
                
                # Gemma models
                "gemma-2-9b-it",
                "gemma-2-27b-it", 
                "gemma-7b-it",
                "gemma-2b-it",
                
                # Image generation models
                "imagen-3.0-generate-001",
                "imagen-3.0-fast-generate-001",
                "imagegeneration@006",
                
                # Code models
                "code-bison@001",
                "code-bison@002",
                "codechat-bison@001",
                "codechat-bison@002",
                
                # Text models
                "text-bison@001",
                "text-bison@002",
                "chat-bison@001", 
                "chat-bison@002"
            ]
            
            # Test each model candidate
            for model_name in vertex_model_candidates:
                try:
                    # Quick initialization test
                    model = GenerativeModel(model_name)
                    self.discovered_models['vertex_ai'].add(model_name)
                    print(f"   📝 Found: {model_name}")
                    
                    # Store model details
                    self.all_models[f"vertex_ai_{model_name}"] = {
                        'service': 'vertex_ai',
                        'model_name': model_name,
                        'display_name': model_name,
                        'description': f'Vertex AI Model: {model_name}',
                        'project_id': project_id,
                        'location': location
                    }
                    
                except Exception as e:
                    print(f"   ❌ Not available: {model_name} - {str(e)[:100]}...")
            
            print(f"\n✅ Discovered {len(self.discovered_models['vertex_ai'])} Vertex AI models")
            
        except Exception as e:
            print(f"❌ Vertex AI discovery failed: {e}")

    async def discover_openai_models(self):
        """Discover ALL available OpenAI models"""
        self.print_section("Discovering OpenAI Models")
        
        try:
            import openai
            
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                print("❌ OpenAI API key not found")
                return
            
            client = openai.OpenAI(api_key=api_key)
            print("✅ OpenAI client initialized")
            
            try:
                print("🔍 Discovering OpenAI models...")
                models = client.models.list()
                
                for model in models.data:
                    model_name = model.id
                    
                    # Filter for chat completion models
                    if any(prefix in model_name for prefix in ['gpt-', 'chatgpt-', 'o1-']):
                        self.discovered_models['openai'].add(model_name)
                        print(f"   📝 Found: {model_name}")
                        
                        # Store model details
                        self.all_models[f"openai_{model_name}"] = {
                            'service': 'openai',
                            'model_name': model_name,
                            'display_name': model_name,
                            'description': f'OpenAI Model: {model_name}',
                            'created': model.created,
                            'owned_by': model.owned_by
                        }
                
                print(f"\n✅ Discovered {len(self.discovered_models['openai'])} OpenAI models")
                
            except Exception as e:
                print(f"❌ OpenAI model discovery failed: {e}")
                
                # Fallback to known models
                known_openai_models = [
                    "gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", 
                    "gpt-3.5-turbo-16k", "o1-preview", "o1-mini"
                ]
                
                for model_name in known_openai_models:
                    self.discovered_models['openai'].add(model_name)
                    self.all_models[f"openai_{model_name}"] = {
                        'service': 'openai',
                        'model_name': model_name,
                        'display_name': model_name,
                        'description': f'OpenAI Model: {model_name} (known model)',
                        'discovery_method': 'fallback'
                    }
                
                print(f"📋 Using {len(known_openai_models)} known OpenAI models as fallback")
                
        except Exception as e:
            print(f"❌ OpenAI setup failed: {e}")

    async def discover_anthropic_models(self):
        """Discover available Anthropic models"""
        self.print_section("Discovering Anthropic Models")
        
        # Known Anthropic models (API doesn't have model discovery)
        known_anthropic_models = [
            "claude-3-5-sonnet-20241022",
            "claude-3-5-sonnet-20240620",
            "claude-3-5-haiku-20241022",
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307"
        ]
        
        for model_name in known_anthropic_models:
            self.discovered_models['anthropic'].add(model_name)
            print(f"   📝 Added: {model_name}")
            
            # Store model details
            self.all_models[f"anthropic_{model_name}"] = {
                'service': 'anthropic',
                'model_name': model_name,
                'display_name': model_name,
                'description': f'Anthropic Claude Model: {model_name}',
                'discovery_method': 'known_models'
            }
        
        print(f"\n✅ Added {len(self.discovered_models['anthropic'])} Anthropic models")

    async def test_all_discovered_models(self):
        """Test ALL discovered models comprehensively"""
        self.print_section("Testing ALL Discovered Models")
        
        total_models = sum(len(models) for models in self.discovered_models.values())
        print(f"🚀 Testing {total_models} total models across all services")
        
        # Test Google AI models
        await self._test_google_ai_models()
        
        # Test Vertex AI models  
        await self._test_vertex_ai_models()
        
        # Test OpenAI models
        await self._test_openai_models()
        
        # Test Anthropic models
        await self._test_anthropic_models()
        
        # Test Express Mode with discovered models
        await self._test_express_mode_models()

    async def _test_google_ai_models(self):
        """Test all discovered Google AI models"""
        if not self.discovered_models['google_ai']:
            return
            
        self.print_subsection("Testing Google AI Models")
        
        try:
            import google.generativeai as genai
            
            api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('VERTEX_AI_GEMINI_API_KEY')
            genai.configure(api_key=api_key)
            
            for model_name in self.discovered_models['google_ai']:
                print(f"\n🔮 Testing {model_name}...")
                
                try:
                    start_time = time.time()
                    
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(
                        self.test_message,
                        generation_config={
                            "max_output_tokens": 100,
                            "temperature": 0.3
                        }
                    )
                    
                    end_time = time.time()
                    latency = (end_time - start_time) * 1000
                    
                    response_text = response.text if hasattr(response, 'text') else str(response)
                    
                    print(f"   ✅ Success! ({latency:.0f}ms)")
                    print(f"   📝 Response: {response_text[:100]}...")
                    
                    self.test_results[f"google_ai_{model_name}"] = {
                        'status': 'success',
                        'latency': latency,
                        'response_length': len(response_text),
                        'response_preview': response_text[:200],
                        'model_info': self.all_models.get(f"google_ai_{model_name}", {})
                    }
                    
                except Exception as e:
                    print(f"   ❌ Failed: {str(e)}")
                    self.test_results[f"google_ai_{model_name}"] = {
                        'status': 'failed',
                        'error': str(e),
                        'latency': 0,
                        'model_info': self.all_models.get(f"google_ai_{model_name}", {})
                    }
                
                # Rate limiting
                await asyncio.sleep(1)
                
        except Exception as e:
            print(f"❌ Google AI testing failed: {e}")

    async def _test_vertex_ai_models(self):
        """Test all discovered Vertex AI models"""
        if not self.discovered_models['vertex_ai']:
            return
            
        self.print_subsection("Testing Vertex AI Models")
        
        try:
            import vertexai
            from vertexai.generative_models import GenerativeModel, GenerationConfig
            from google.oauth2 import service_account
            
            # Initialize Vertex AI
            service_account_path = os.getenv('PRIMARY_SERVICE_ACCOUNT_PATH')
            project_id = os.getenv('VERTEX_AI_PROJECT_ID', 'podplay-build-beta')
            location = os.getenv('VERTEX_AI_LOCATION', 'us-central1')
            
            credentials = service_account.Credentials.from_service_account_file(
                service_account_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            
            vertexai.init(project=project_id, location=location, credentials=credentials)
            
            for model_name in self.discovered_models['vertex_ai']:
                print(f"\n🤖 Testing {model_name}...")
                
                try:
                    start_time = time.time()
                    
                    # Skip image models for text generation
                    if any(img_term in model_name.lower() for img_term in ['imagen', 'imagegeneration']):
                        print(f"   ⏭️ Skipping image model {model_name}")
                        continue
                    
                    model = GenerativeModel(model_name)
                    response = model.generate_content(
                        self.test_message,
                        generation_config=GenerationConfig(
                            max_output_tokens=100,
                            temperature=0.3
                        )
                    )
                    
                    end_time = time.time()
                    latency = (end_time - start_time) * 1000
                    
                    response_text = response.text if hasattr(response, 'text') else str(response)
                    
                    print(f"   ✅ Success! ({latency:.0f}ms)")
                    print(f"   📝 Response: {response_text[:100]}...")
                    
                    self.test_results[f"vertex_ai_{model_name}"] = {
                        'status': 'success',
                        'latency': latency,
                        'response_length': len(response_text),
                        'response_preview': response_text[:200],
                        'model_info': self.all_models.get(f"vertex_ai_{model_name}", {})
                    }
                    
                except Exception as e:
                    print(f"   ❌ Failed: {str(e)}")
                    self.test_results[f"vertex_ai_{model_name}"] = {
                        'status': 'failed',
                        'error': str(e),
                        'latency': 0,
                        'model_info': self.all_models.get(f"vertex_ai_{model_name}", {})
                    }
                
                # Rate limiting
                await asyncio.sleep(1)
                
        except Exception as e:
            print(f"❌ Vertex AI testing failed: {e}")

    async def _test_openai_models(self):
        """Test all discovered OpenAI models"""
        if not self.discovered_models['openai']:
            return
            
        self.print_subsection("Testing OpenAI Models")
        
        try:
            import openai
            
            api_key = os.getenv('OPENAI_API_KEY')
            client = openai.OpenAI(api_key=api_key)
            
            for model_name in self.discovered_models['openai']:
                print(f"\n🤖 Testing {model_name}...")
                
                try:
                    start_time = time.time()
                    
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "user", "content": self.test_message}
                        ],
                        max_tokens=100,
                        temperature=0.3
                    )
                    
                    end_time = time.time()
                    latency = (end_time - start_time) * 1000
                    
                    response_text = response.choices[0].message.content
                    
                    print(f"   ✅ Success! ({latency:.0f}ms)")
                    print(f"   📝 Response: {response_text[:100]}...")
                    
                    self.test_results[f"openai_{model_name}"] = {
                        'status': 'success',
                        'latency': latency,
                        'response_length': len(response_text),
                        'response_preview': response_text[:200],
                        'model_info': self.all_models.get(f"openai_{model_name}", {}),
                        'usage': {
                            'prompt_tokens': response.usage.prompt_tokens,
                            'completion_tokens': response.usage.completion_tokens,
                            'total_tokens': response.usage.total_tokens
                        }
                    }
                    
                except Exception as e:
                    print(f"   ❌ Failed: {str(e)}")
                    self.test_results[f"openai_{model_name}"] = {
                        'status': 'failed',
                        'error': str(e),
                        'latency': 0,
                        'model_info': self.all_models.get(f"openai_{model_name}", {})
                    }
                
                # Rate limiting
                await asyncio.sleep(1)
                
        except Exception as e:
            print(f"❌ OpenAI testing failed: {e}")

    async def _test_anthropic_models(self):
        """Test all discovered Anthropic models"""
        if not self.discovered_models['anthropic']:
            return
            
        self.print_subsection("Testing Anthropic Models")
        
        try:
            import anthropic
            
            api_key = os.getenv('ANTHROPIC_API_KEY')
            client = anthropic.Anthropic(api_key=api_key)
            
            for model_name in self.discovered_models['anthropic']:
                print(f"\n🧠 Testing {model_name}...")
                
                try:
                    start_time = time.time()
                    
                    response = client.messages.create(
                        model=model_name,
                        max_tokens=100,
                        temperature=0.3,
                        messages=[
                            {"role": "user", "content": self.test_message}
                        ]
                    )
                    
                    end_time = time.time()
                    latency = (end_time - start_time) * 1000
                    
                    response_text = response.content[0].text if response.content else ""
                    
                    print(f"   ✅ Success! ({latency:.0f}ms)")
                    print(f"   📝 Response: {response_text[:100]}...")
                    
                    self.test_results[f"anthropic_{model_name}"] = {
                        'status': 'success',
                        'latency': latency,
                        'response_length': len(response_text),
                        'response_preview': response_text[:200],
                        'model_info': self.all_models.get(f"anthropic_{model_name}", {}),
                        'usage': {
                            'input_tokens': response.usage.input_tokens,
                            'output_tokens': response.usage.output_tokens
                        }
                    }
                    
                except Exception as e:
                    print(f"   ❌ Failed: {str(e)}")
                    self.test_results[f"anthropic_{model_name}"] = {
                        'status': 'failed',
                        'error': str(e),
                        'latency': 0,
                        'model_info': self.all_models.get(f"anthropic_{model_name}", {})
                    }
                
                # Rate limiting
                await asyncio.sleep(1)
                
        except Exception as e:
            print(f"❌ Anthropic testing failed: {e}")

    async def _test_express_mode_models(self):
        """Test Express Mode service with all available speed tiers"""
        self.print_subsection("Testing Express Mode Service")
        
        try:
            from services.vertex_express_production import VertexExpressModeIntegration
            
            express_service = VertexExpressModeIntegration()
            
            # Test connectivity
            connectivity = await express_service.test_connectivity()
            if connectivity['success']:
                print(f"✅ Express Mode connectivity: {connectivity['latency']:.2f}ms")
                print(f"🎯 Service used: {connectivity.get('service_used', 'unknown')}")
            
            # Test each speed tier
            speed_tiers = ["ultra_fast", "fast", "standard", "research"]
            
            for tier in speed_tiers:
                print(f"\n⚡ Testing Express Mode {tier} tier...")
                
                try:
                    start_time = time.time()
                    
                    response = await express_service.chat_with_express_mode(
                        message=self.test_message,
                        speed_tier=tier,
                        mama_bear_variant="efficiency_bear"
                    )
                    
                    end_time = time.time()
                    latency = (end_time - start_time) * 1000
                    
                    if response['success']:
                        print(f"   ✅ Success! ({latency:.0f}ms)")
                        print(f"   🎯 Service: {response.get('service_used', 'unknown')}")
                        print(f"   🚀 Model: {response.get('model_used', 'unknown')}")
                        print(f"   📝 Response: {response['response'][:100]}...")
                        
                        self.test_results[f"express_mode_{tier}"] = {
                            'status': 'success',
                            'latency': latency,
                            'service_used': response.get('service_used'),
                            'model_used': response.get('model_used'),
                            'response_length': len(response['response']),
                            'response_preview': response['response'][:200],
                            'cost_savings': response.get('cost_savings', 0)
                        }
                        
                        # Track as discovered model
                        self.discovered_models['express_mode'].add(f"{tier}_tier")
                    else:
                        print(f"   ❌ Failed: {response.get('error', 'Unknown error')}")
                        self.test_results[f"express_mode_{tier}"] = {
                            'status': 'failed',
                            'error': response.get('error'),
                            'latency': latency
                        }
                        
                except Exception as e:
                    print(f"   ❌ Exception: {str(e)}")
                    self.test_results[f"express_mode_{tier}"] = {
                        'status': 'failed',
                        'error': str(e),
                        'latency': 0
                    }
                
                # Rate limiting
                await asyncio.sleep(1)
                
        except Exception as e:
            print(f"❌ Express Mode testing failed: {e}")

    def generate_resource_inventory(self):
        """Generate comprehensive resource inventory"""
        self.print_section("Complete Resource Inventory")
        
        # Calculate totals
        total_discovered = sum(len(models) for models in self.discovered_models.values())
        total_tested = len(self.test_results)
        successful_tests = {k: v for k, v in self.test_results.items() if v['status'] == 'success'}
        failed_tests = {k: v for k, v in self.test_results.items() if v['status'] == 'failed'}
        
        print(f"📊 DISCOVERY SUMMARY")
        print(f"   🔍 Total Models Discovered: {total_discovered}")
        print(f"   🧪 Total Models Tested: {total_tested}")
        print(f"   ✅ Successful Tests: {len(successful_tests)}")
        print(f"   ❌ Failed Tests: {len(failed_tests)}")
        print(f"   🎯 Success Rate: {len(successful_tests)/total_tested*100:.1f}%")
        
        # Service breakdown
        self.print_subsection("Models by Service")
        for service, models in self.discovered_models.items():
            if models:
                successful_for_service = [k for k in successful_tests.keys() if k.startswith(service)]
                print(f"🔧 {service.upper()}: {len(models)} discovered, {len(successful_for_service)} working")
                
                # List working models for each service
                if successful_for_service:
                    print("   ✅ Working models:")
                    for model_key in sorted(successful_for_service):
                        result = successful_tests[model_key]
                        model_name = model_key.replace(f"{service}_", "")
                        latency = result.get('latency', 0)
                        print(f"      - {model_name} ({latency:.0f}ms)")
        
        # Performance analysis
        if successful_tests:
            self.print_subsection("Performance Analysis")
            
            # Service performance
            service_performance = {}
            for test_name, result in successful_tests.items():
                service = test_name.split('_')[0]
                if service not in service_performance:
                    service_performance[service] = []
                service_performance[service].append(result['latency'])
            
            for service, latencies in service_performance.items():
                avg_latency = sum(latencies) / len(latencies)
                min_latency = min(latencies)
                max_latency = max(latencies)
                print(f"⚡ {service.upper()}: {avg_latency:.0f}ms avg (min: {min_latency:.0f}ms, max: {max_latency:.0f}ms)")
            
            # ALL working models (not just top 10)
            print(f"\n📋 ALL {len(successful_tests)} WORKING MODELS (sorted by speed):")
            sorted_results = sorted(successful_tests.items(), key=lambda x: x[1]['latency'])
            for i, (model, result) in enumerate(sorted_results):
                service_icon = {
                    'google': '🔮',
                    'vertex': '🤖', 
                    'openai': '🤖',
                    'anthropic': '🧠',
                    'express': '⚡'
                }.get(model.split('_')[0], '🔧')
                
                print(f"{service_icon} #{i+1}: {model} - {result['latency']:.0f}ms")
        
        # Create comprehensive inventory
        self.resource_inventory = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_discovered': total_discovered,
                'total_tested': total_tested,
                'successful': len(successful_tests),
                'failed': len(failed_tests),
                'success_rate': len(successful_tests)/total_tested*100 if total_tested > 0 else 0
            },
            'discovered_models': {k: list(v) for k, v in self.discovered_models.items()},
            'working_models': list(successful_tests.keys()),
            'failed_models': list(failed_tests.keys()),
            'service_performance': {
                service: {
                    'count': len(latencies),
                    'avg_latency_ms': sum(latencies) / len(latencies),
                    'min_latency_ms': min(latencies),
                    'max_latency_ms': max(latencies)
                } for service, latencies in service_performance.items()
            } if successful_tests else {},
            'detailed_results': self.test_results,
            'model_catalog': self.all_models
        }
        
        # Save comprehensive report
        report_path = backend_dir / 'data' / 'comprehensive_model_inventory.json'
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(self.resource_inventory, f, indent=2)
        
        print(f"\n📄 Complete inventory saved to: {report_path}")
        
        # Create quick reference for multi-modal chat
        self.create_multimodal_chat_config()

    def create_multimodal_chat_config(self):
        """Create configuration file for multi-modal chat integration"""
        self.print_subsection("Multi-Modal Chat Configuration")
        
        successful_tests = {k: v for k, v in self.test_results.items() if v['status'] == 'success'}
        
        # Organize models by capability and speed
        config = {
            'ultra_fast_models': [],  # <500ms
            'fast_models': [],        # 500ms-1000ms  
            'standard_models': [],    # 1000ms-2000ms
            'research_models': [],    # >2000ms
            'service_endpoints': {},
            'recommended_defaults': {}
        }
        
        for model_key, result in successful_tests.items():
            latency = result['latency']
            model_config = {
                'key': model_key,
                'latency_ms': latency,
                'service': model_key.split('_')[0],
                'model_name': model_key.replace(f"{model_key.split('_')[0]}_", "")
            }
            
            if latency < 500:
                config['ultra_fast_models'].append(model_config)
            elif latency < 1000:
                config['fast_models'].append(model_config)
            elif latency < 2000:
                config['standard_models'].append(model_config)
            else:
                config['research_models'].append(model_config)
        
        # Sort each category by speed
        for category in ['ultra_fast_models', 'fast_models', 'standard_models', 'research_models']:
            config[category].sort(key=lambda x: x['latency_ms'])
        
        # Service endpoints
        config['service_endpoints'] = {
            'google_ai': '/api/google-ai/chat',
            'vertex_ai': '/api/vertex-ai/chat', 
            'openai': '/api/openai/chat',
            'anthropic': '/api/anthropic/chat',
            'express_mode': '/api/vertex-express/chat'
        }
        
        # Recommended defaults
        if config['ultra_fast_models']:
            config['recommended_defaults']['ultra_fast'] = config['ultra_fast_models'][0]
        if config['fast_models']:
            config['recommended_defaults']['fast'] = config['fast_models'][0]
        if config['standard_models']:
            config['recommended_defaults']['standard'] = config['standard_models'][0]
        if config['research_models']:
            config['recommended_defaults']['research'] = config['research_models'][0]
        
        # Save multimodal config
        config_path = backend_dir / 'data' / 'multimodal_chat_config.json'
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"🎯 Multi-modal chat config saved to: {config_path}")
        
        # Print summary
        print(f"\n📊 MULTI-MODAL CHAT READY:")
        print(f"   ⚡ Ultra Fast Models: {len(config['ultra_fast_models'])} available")
        print(f"   🚀 Fast Models: {len(config['fast_models'])} available") 
        print(f"   📊 Standard Models: {len(config['standard_models'])} available")
        print(f"   🔬 Research Models: {len(config['research_models'])} available")
        
        if config['recommended_defaults']:
            print(f"\n🎯 RECOMMENDED DEFAULTS:")
            for speed_tier, model in config['recommended_defaults'].items():
                print(f"   {speed_tier}: {model['key']} ({model['latency_ms']:.0f}ms)")

    async def run_comprehensive_discovery(self):
        """Run complete model discovery and testing"""
        print("🔍 Comprehensive Model Discovery & Testing Suite")
        print("="*80)
        print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Environment check
        self.print_subsection("Environment Check")
        env_checks = {
            'PRIMARY_SERVICE_ACCOUNT_PATH': os.path.exists(os.getenv('PRIMARY_SERVICE_ACCOUNT_PATH', '')),
            'VERTEX_AI_PROJECT_ID': bool(os.getenv('VERTEX_AI_PROJECT_ID')),
            'GOOGLE_API_KEY': bool(os.getenv('GOOGLE_API_KEY')),
            'OPENAI_API_KEY': bool(os.getenv('OPENAI_API_KEY')),
            'ANTHROPIC_API_KEY': bool(os.getenv('ANTHROPIC_API_KEY')),
            'VERTEX_AI_EXPRESS_API_KEY': bool(os.getenv('VERTEX_AI_EXPRESS_API_KEY'))
        }
        
        for key, available in env_checks.items():
            status = "✅" if available else "❌"
            print(f"{status} {key}: {'Configured' if available else 'Missing'}")
        
        # Discovery phase
        await self.discover_google_ai_models()
        await self.discover_vertex_ai_models()
        await self.discover_openai_models()
        await self.discover_anthropic_models()
        
        # Testing phase
        await self.test_all_discovered_models()
        
        # Generate comprehensive inventory
        self.generate_resource_inventory()
        
        print(f"\n🏁 Discovery completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("🎉 Comprehensive model discovery and testing complete!")

async def main():
    """Main discovery runner"""
    discoverer = ComprehensiveModelDiscovery()
    await discoverer.run_comprehensive_discovery()

if __name__ == '__main__':
    asyncio.run(main())
