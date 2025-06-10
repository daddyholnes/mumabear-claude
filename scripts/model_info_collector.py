"""
Model Information Collector for Podplay Sanctuary

This script gathers detailed information about AI models from various providers
including Gemini, Vertex AI, Anthropic, and OpenAI.
"""

import os
import json
import requests
import google.generativeai as genai
from google.oauth2 import service_account
from google.cloud import aiplatform
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Constants
OUTPUT_DIR = "model_reports"
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
OUTPUT_FILE = f"{OUTPUT_DIR}/model_info_{TIMESTAMP}.md"

# Service account files
SERVICE_ACCOUNT_FILES = [
    "podplay-build-alpha-8fcf03975028.json",
    "podplay-build-beta-10490f7d079e.json"
]

class ModelInfoCollector:
    def __init__(self):
        self.models_info = []
        self.setup_directories()
    
    def setup_directories(self):
        """Create necessary directories."""
        Path(OUTPUT_DIR).mkdir(exist_ok=True)
    
    def get_gemini_models(self) -> List[Dict[str, Any]]:
        """Fetch Gemini model information."""
        try:
            gemini_models = []
            # Try both API keys
            for key_name in ['GEMINI_API_KEY_PRIMARY', 'GEMINI_API_KEY_FALLBACK']:
                api_key = os.getenv(key_name)
                if not api_key or api_key.startswith('your-'):
                    continue
                    
                genai.configure(api_key=api_key)
                response = genai.list_models()
                
                for model in response:
                    if 'gemini' in model.name.lower():
                        gemini_models.append({
                            'provider': 'Google AI (Gemini)',
                            'model_name': model.name,
                            'context_window': model.input_token_limit if hasattr(model, 'input_token_limit') else 'N/A',
                            'output_limit': model.output_token_limit if hasattr(model, 'output_token_limit') else 'N/A',
                            'features': model.supported_generation_methods if hasattr(model, 'supported_generation_methods') else [],
                            'pricing_url': 'https://ai.google.dev/pricing',
                            'rpm': 'varies',
                            'notes': 'Check Google AI Studio for latest pricing and limits'
                        })
            return gemini_models
        except Exception as e:
            print(f"Error fetching Gemini models: {str(e)}")
            return []

    def get_vertex_models(self) -> List[Dict[str, Any]]:
        """Fetch Vertex AI model information."""
        vertex_models = []
        
        # Check if we have service account files in the expected location
        service_account_files = [
            os.path.join(os.getcwd(), sa_file) for sa_file in SERVICE_ACCOUNT_FILES
        ]
        
        # Also check in the parent directory (common location for service accounts)
        parent_dir = os.path.dirname(os.getcwd())
        service_account_files.extend([
            os.path.join(parent_dir, sa_file) for sa_file in SERVICE_ACCOUNT_FILES
        ])
        
        # Add the path from environment variables if they exist
        primary_path = os.getenv('PRIMARY_SERVICE_ACCOUNT_PATH')
        fallback_path = os.getenv('FALLBACK_SERVICE_ACCOUNT_PATH')
        
        if primary_path and os.path.exists(primary_path):
            service_account_files.append(primary_path)
        if fallback_path and os.path.exists(fallback_path):
            service_account_files.append(fallback_path)
            
        # Remove duplicates while preserving order
        seen = set()
        service_account_files = [x for x in service_account_files 
                              if not (x in seen or seen.add(x))]
        
        if not service_account_files:
            print("⚠️ No service account files found. Please ensure service account JSON files exist.")
            return []
            
        print(f"🔍 Checking {len(service_account_files)} service account files...")
        
        for sa_path in service_account_files:
            if not os.path.exists(sa_path):
                print(f"  ⚠️ Service account file not found: {sa_path}")
                continue
                
            try:
                credentials = service_account.Credentials.from_service_account_file(
                    sa_path,
                    scopes=['https://www.googleapis.com/auth/cloud-platform']
                )
                
                aiplatform.init(credentials=credentials)
                
                # List available models (this is a simplified example)
                models = aiplatform.Model.list()
                
                for model in models:
                    vertex_models.append({
                        'provider': 'Google Cloud (Vertex AI)',
                        'model_name': model.display_name,
                        'context_window': 'Varies by model',
                        'output_limit': 'Varies by model',
                        'features': model.supported_deployment_resources_types if hasattr(model, 'supported_deployment_resources_types') else [],
                        'pricing_url': 'https://cloud.google.com/vertex-ai/pricing',
                        'rpm': 'Varies by model and region',
                        'notes': 'Check Vertex AI documentation for specific model capabilities'
                    })
                    
            except Exception as e:
                error_msg = str(e)
                if "SERVICE_DISABLED" in error_msg:
                    print(f"  ⚠️ Service account error: {sa_path}")
                    print(f"     {error_msg.split('message: ')[1].split('\n')[0]}")
                    print(f"     Please enable the Cloud Resource Manager API for this project")
                elif "PERMISSION_DENIED" in error_msg or "IAM_PERMISSION_DENIED" in error_msg:
                    print(f"  🔒 Permission denied for service account: {sa_path}")
                    print(f"     Please ensure the service account has the 'AI Platform Admin' role")
                else:
                    print(f"  ❌ Error with service account {sa_path}: {error_msg[:200]}...")
                    
                # Add a placeholder model to indicate the error
                vertex_models.append({
                    'provider': 'Google Cloud (Vertex AI)',
                    'model_name': f'Error: {os.path.basename(sa_path)}',
                    'context_window': 'N/A',
                    'output_limit': 'N/A',
                    'features': ['Error fetching models'],
                    'pricing_url': 'https://cloud.google.com/vertex-ai/pricing',
                    'rpm': 'N/A',
                    'notes': 'Check service account permissions and enable required APIs'
                })
        
        return vertex_models

    def get_anthropic_models(self) -> List[Dict[str, Any]]:
        """Fetch Anthropic model information."""
        try:
            # Try multiple possible environment variable names for Anthropic key
            api_key = os.getenv('ANTHROPIC_API_KEY') or os.getenv('ANTHROPIC_API_KEY_PRIMARY')
            if not api_key or not api_key.startswith('sk-ant-'):
                print("⚠️ No valid Anthropic API key found. Please set ANTHROPIC_API_KEY in your .env file")
                return []
                
            print(f"🔑 Using Anthropic API key: {api_key[:10]}...{api_key[-4:]}")
            headers = {
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'anthropic-beta': 'tools-2024-04-04'  # For latest features
            }
            
            # Anthropic doesn't have a direct models endpoint, so we'll use a predefined list
            # with their known models and specifications
            return [
                {
                    'provider': 'Anthropic',
                    'model_name': 'claude-3-opus-20240229',
                    'context_window': 200000,
                    'output_limit': 4096,
                    'features': ['text', 'vision', 'json'],
                    'pricing_url': 'https://www.anthropic.com/pricing',
                    'rpm': 15000,
                    'notes': 'Most capable model, best for highly complex tasks'
                },
                {
                    'provider': 'Anthropic',
                    'model_name': 'claude-3-sonnet-20240229',
                    'context_window': 200000,
                    'output_limit': 4096,
                    'features': ['text', 'vision', 'json'],
                    'pricing_url': 'https://www.anthropic.com/pricing',
                    'rpm': 30000,
                    'notes': 'Ideal balance of intelligence and speed'
                },
                {
                    'provider': 'Anthropic',
                    'model_name': 'claude-3-haiku-20240307',
                    'context_window': 200000,
                    'output_limit': 4096,
                    'features': ['text', 'vision', 'json'],
                    'pricing_url': 'https://www.anthropic.com/pricing',
                    'rpm': 100000,
                    'notes': 'Fastest and most cost-effective model'
                }
            ]
            
        except Exception as e:
            print(f"Error fetching Anthropic models: {str(e)}")
            return []

    def get_openai_models(self) -> List[Dict[str, Any]]:
        """Fetch OpenAI model information."""
        try:
            # Try multiple possible environment variable names for OpenAI key
            api_key = os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY_PRIMARY')
            if not api_key or api_key.startswith('sk-your'):
                print("⚠️ No valid OpenAI API key found. Please set OPENAI_API_KEY in your .env file")
                return []
                
            print(f"🔑 Using OpenAI API key: {api_key[:10]}...{api_key[-4:]}")
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get('https://api.openai.com/v1/models', headers=headers)
            response.raise_for_status()
            
            openai_models = []
            models_data = response.json()
            
            # Known model specifications (as OpenAI doesn't provide all details via API)
            model_specs = {
                'gpt-4-turbo': {
                    'context_window': 128000,
                    'output_limit': 4096,
                    'features': ['text', 'json', 'function_calling'],
                    'rpm': 10000
                },
                'gpt-4': {
                    'context_window': 8192,
                    'output_limit': 4096,
                    'features': ['text', 'json', 'function_calling'],
                    'rpm': 10000
                },
                'gpt-3.5-turbo': {
                    'context_window': 16385,
                    'output_limit': 4096,
                    'features': ['text', 'json', 'function_calling'],
                    'rpm': 10000
                },
                'dall-e-3': {
                    'context_window': 'N/A',
                    'output_limit': '1-4 images',
                    'features': ['image_generation'],
                    'rpm': 50
                },
                'whisper-1': {
                    'context_window': '25MB audio files',
                    'output_limit': 'Text transcription',
                    'features': ['audio_transcription'],
                    'rpm': 50
                }
            }
            
            for model in models_data['data']:
                model_id = model['id']
                spec = model_specs.get(model_id, {
                    'context_window': 'N/A',
                    'output_limit': 'N/A',
                    'features': [],
                    'rpm': 'N/A'
                })
                
                openai_models.append({
                    'provider': 'OpenAI',
                    'model_name': model_id,
                    'context_window': spec['context_window'],
                    'output_limit': spec['output_limit'],
                    'features': spec['features'],
                    'pricing_url': 'https://openai.com/pricing',
                    'rpm': spec['rpm'],
                    'notes': 'Check OpenAI documentation for latest capabilities'
                })
                
            return openai_models
            
        except Exception as e:
            print(f"Error fetching OpenAI models: {str(e)}")
            return []

    def generate_markdown_report(self):
        """Generate a markdown report with all model information."""
        # Add timestamp and title
        markdown = f"# 🐻 Podplay Sanctuary - AI Model Information Report\n"
        markdown += f"*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
        
        # Add a summary table
        markdown += "## 📊 Summary\n\n"
        markdown += "| Provider | Model Name | Context Window | Output Limit | RPM |\n"
        markdown += "|----------|------------|----------------|--------------|-----|\n"
        
        for model in self.models_info:
            markdown += f"| {model['provider']} | {model['model_name']} | {model['context_window']} | {model['output_limit']} | {model['rpm']} |\n"
        
        # Add detailed sections for each provider
        providers = set(m['provider'] for m in self.models_info)
        
        for provider in sorted(providers):
            markdown += f"\n## 🏷️ {provider} Models\n\n"
            provider_models = [m for m in self.models_info if m['provider'] == provider]
            
            for model in provider_models:
                markdown += f"### 🎯 {model['model_name']}\n\n"
                markdown += f"- **Context Window:** {model['context_window']}\n"
                markdown += f"- **Output Limit:** {model['output_limit']}\n"
                markdown += f"- **RPM (Requests per Minute):** {model['rpm']}\n"
                
                if model['features']:
                    markdown += f"- **Features:** {', '.join(str(f) for f in model['features'])}\n"
                
                if 'pricing_url' in model:
                    markdown += f"- **Pricing:** [View Pricing]({model['pricing_url']})\n"
                
                if 'notes' in model and model['notes']:
                    markdown += f"- **Notes:** {model['notes']}\n"
                
                markdown += "\n"
        
        return markdown

    def collect_all_models(self):
        """Collect models from all providers."""
        print("🐻 Starting Podplay Sanctuary Model Information Collection...\n")
        print("🔍 Collecting model information from all providers...\n")
        
        print("🌐 Fetching Gemini models...")
        gemini_models = self.get_gemini_models()
        self.models_info.extend(gemini_models)
        print(f"✅ Found {len(gemini_models)} Gemini models")
        
        print("\n☁️  Fetching Vertex AI models...")
        vertex_models = self.get_vertex_models()
        self.models_info.extend(vertex_models)
        print(f"✅ Found {len(vertex_models)} Vertex AI models")
        
        print("\n🤖 Fetching Anthropic models...")
        anthropic_models = self.get_anthropic_models()
        self.models_info.extend(anthropic_models)
        print(f"✅ Found {len(anthropic_models)} Anthropic models")
        
        print("\n🔮 Fetching OpenAI models...")
        openai_models = self.get_openai_models()
        self.models_info.extend(openai_models)
        print(f"✅ Found {len(openai_models)} OpenAI models")
        
        print("\n📊 Generating report...")
        report = self.generate_markdown_report()
        
        with open(OUTPUT_FILE, 'w') as f:
            f.write(report)
        
        print(f"\n🎉 Report generated successfully: {os.path.abspath(OUTPUT_FILE)}")
        print(f"📋 Total models found: {len(self.models_info)}")
        print("\n🐾 Thank you for using Podplay Sanctuary! 🐾")

if __name__ == "__main__":
    collector = ModelInfoCollector()
    collector.collect_all_models()
