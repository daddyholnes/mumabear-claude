#!/usr/bin/env python3
"""
Comprehensive Documentation Scraper for Podplay Sanctuary
Scrapes documentation from Scrapybara, OpenAI, and Mem0.ai to build a complete knowledge base
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import os
from datetime import datetime

def scrape_comprehensive_docs():
    """Scrape comprehensive documentation from all relevant platforms"""
    
    # Comprehensive documentation URLs
    doc_sources = {
        "scrapybara": [
            "https://docs.scrapybara.com/introduction",
            "https://docs.scrapybara.com/getting-started", 
            "https://docs.scrapybara.com/best-practices",
            "https://docs.scrapybara.com/act-sdk",
            "https://docs.scrapybara.com/conversations",
            "https://docs.scrapybara.com/tools",
            "https://docs.scrapybara.com/ubuntu",
            "https://docs.scrapybara.com/browser",
            "https://docs.scrapybara.com/windows",
            "https://docs.scrapybara.com/protocols/browser",
            "https://docs.scrapybara.com/protocols/code",
            "https://docs.scrapybara.com/protocols/env",
            "https://docs.scrapybara.com/openai",
            "https://docs.scrapybara.com/anthropic",
            "https://docs.scrapybara.com/auth-states",
            "https://docs.scrapybara.com/api-reference",
            "https://docs.scrapybara.com/sdk-reference/python",
            "https://docs.scrapybara.com/sdk-reference/typescript",
            "https://docs.scrapybara.com/starter-templates",
            "https://docs.scrapybara.com/cursor-rules",
            "https://docs.scrapybara.com/cookbook",
            "https://docs.scrapybara.com/cookbook/copycapy",
            "https://docs.scrapybara.com/cookbook/wide-research"
        ],
        "openai": [
            "https://platform.openai.com/docs/overview",
            "https://platform.openai.com/docs/quickstart",
            "https://platform.openai.com/docs/models",
            "https://platform.openai.com/docs/api-reference",
            "https://platform.openai.com/docs/guides/text-generation",
            "https://platform.openai.com/docs/guides/function-calling",
            "https://platform.openai.com/docs/guides/structured-outputs",
            "https://platform.openai.com/docs/guides/vision",
            "https://platform.openai.com/docs/guides/audio",
            "https://platform.openai.com/docs/guides/embeddings",
            "https://platform.openai.com/docs/guides/fine-tuning",
            "https://platform.openai.com/docs/guides/batch",
            "https://platform.openai.com/docs/assistants/overview",
            "https://platform.openai.com/docs/assistants/how-it-works",
            "https://platform.openai.com/docs/assistants/tools",
            "https://platform.openai.com/docs/assistants/computer-use",
            "https://platform.openai.com/docs/guides/reasoning",
            "https://platform.openai.com/docs/guides/prompt-engineering",
            "https://platform.openai.com/docs/guides/production-best-practices",
            "https://platform.openai.com/docs/guides/safety-best-practices",
            "https://platform.openai.com/docs/guides/rate-limits",
            "https://platform.openai.com/docs/guides/error-codes"
        ],
        "mem0": [
            "https://docs.mem0.ai/",
            "https://docs.mem0.ai/quickstart",
            "https://docs.mem0.ai/overview",
            "https://docs.mem0.ai/platform/quickstart",
            "https://docs.mem0.ai/platform/overview",
            "https://docs.mem0.ai/open-source/quickstart",
            "https://docs.mem0.ai/open-source/overview",
            "https://docs.mem0.ai/open-source/installation",
            "https://docs.mem0.ai/open-source/usage",
            "https://docs.mem0.ai/components/memory",
            "https://docs.mem0.ai/components/llms",
            "https://docs.mem0.ai/components/vector-stores",
            "https://docs.mem0.ai/components/embeddings",
            "https://docs.mem0.ai/examples/personal-ai-tutor",
            "https://docs.mem0.ai/examples/customer-support-agent",
            "https://docs.mem0.ai/api-reference/memory",
            "https://docs.mem0.ai/api-reference/users",
            "https://docs.mem0.ai/integrations/langchain",
            "https://docs.mem0.ai/integrations/crewai"
        ]
    }
    
    all_scraped_docs = []
    
    print("🚀 Starting comprehensive documentation scraping...")
    print(f"📊 Total URLs to scrape: {sum(len(urls) for urls in doc_sources.values())}")
    
    for platform, urls in doc_sources.items():
        print(f"\n📖 Scraping {platform.upper()} documentation ({len(urls)} URLs)...")
        
        for i, url in enumerate(urls, 1):
            try:
                print(f"  [{i}/{len(urls)}] Scraping {url}...")
                
                # Add delay to be respectful
                time.sleep(1)
                
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract title
                title = soup.find('title')
                title_text = title.get_text().strip() if title else url
                
                # Extract main content with multiple selectors
                content_selectors = [
                    'main',
                    '.content',
                    '.documentation',
                    '.docs-content',
                    'article',
                    '.markdown-body',
                    '#content',
                    '.prose',
                    '.doc-content'
                ]
                
                content = ""
                for selector in content_selectors:
                    content_elem = soup.select_one(selector)
                    if content_elem:
                        content = content_elem.get_text(separator='\n', strip=True)
                        break
                
                # If no specific content area found, get body text
                if not content:
                    body = soup.find('body')
                    if body:
                        content = body.get_text(separator='\n', strip=True)
                
                # Extract code examples
                code_blocks = soup.find_all(['pre', 'code'])
                code_examples = []
                for block in code_blocks:
                    code_text = block.get_text().strip()
                    if code_text and len(code_text) > 10:  # Filter out small snippets
                        code_examples.append(code_text)
                
                # Extract API endpoints if present
                api_endpoints = []
                api_selectors = ['.endpoint', '.api-endpoint', '[data-method]']
                for selector in api_selectors:
                    endpoints = soup.select(selector)
                    for endpoint in endpoints:
                        api_endpoints.append(endpoint.get_text().strip())
                
                doc_entry = {
                    "url": url,
                    "platform": platform,
                    "title": title_text,
                    "content": content,
                    "code_examples": code_examples,
                    "api_endpoints": api_endpoints,
                    "type": f"{platform}_documentation",
                    "scraped_at": datetime.now().isoformat(),
                    "content_length": len(content),
                    "code_examples_count": len(code_examples)
                }
                
                all_scraped_docs.append(doc_entry)
                print(f"    ✅ Success: {len(content)} chars, {len(code_examples)} code examples")
                
            except Exception as e:
                print(f"    ❌ Error scraping {url}: {e}")
                continue
    
    # Save comprehensive documentation
    output_file = "docs/comprehensive_docs.jsonl"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w') as f:
        for doc in all_scraped_docs:
            f.write(json.dumps(doc) + '\n')
    
    # Generate summary report
    platform_stats = {}
    for doc in all_scraped_docs:
        platform = doc['platform']
        if platform not in platform_stats:
            platform_stats[platform] = {
                'count': 0,
                'total_content': 0,
                'total_code_examples': 0
            }
        platform_stats[platform]['count'] += 1
        platform_stats[platform]['total_content'] += doc['content_length']
        platform_stats[platform]['total_code_examples'] += doc['code_examples_count']
    
    print(f"\n🎉 Comprehensive scraping completed!")
    print(f"📁 Saved {len(all_scraped_docs)} documents to {output_file}")
    print(f"\n📊 Platform Statistics:")
    for platform, stats in platform_stats.items():
        print(f"  {platform.upper()}:")
        print(f"    📄 Documents: {stats['count']}")
        print(f"    📝 Total content: {stats['total_content']:,} characters")
        print(f"    💻 Code examples: {stats['total_code_examples']}")
    
    # Create platform-specific files for easier access
    for platform in doc_sources.keys():
        platform_docs = [doc for doc in all_scraped_docs if doc['platform'] == platform]
        platform_file = f"docs/{platform}_docs.jsonl"
        
        with open(platform_file, 'w') as f:
            for doc in platform_docs:
                f.write(json.dumps(doc) + '\n')
        
        print(f"📁 Created {platform_file} with {len(platform_docs)} documents")
    
    return all_scraped_docs

def analyze_documentation_structure(docs):
    """Analyze the scraped documentation to understand system architecture"""
    
    print("\n🔍 Analyzing documentation structure...")
    
    # Analyze by platform
    analysis = {
        'scrapybara': {
            'key_concepts': [],
            'api_patterns': [],
            'integration_points': []
        },
        'openai': {
            'key_concepts': [],
            'api_patterns': [],
            'integration_points': []
        },
        'mem0': {
            'key_concepts': [],
            'api_patterns': [],
            'integration_points': []
        }
    }
    
    # Keywords to look for in each platform
    keywords = {
        'scrapybara': ['act sdk', 'browser', 'code execution', 'copycapy', 'instance', 'protocol'],
        'openai': ['assistant', 'function calling', 'structured outputs', 'embeddings', 'chat completion'],
        'mem0': ['memory', 'vector store', 'search', 'add', 'user_id', 'agent_id']
    }
    
    for doc in docs:
        platform = doc['platform']
        content_lower = doc['content'].lower()
        
        # Find key concepts
        for keyword in keywords.get(platform, []):
            if keyword in content_lower:
                analysis[platform]['key_concepts'].append(keyword)
    
    # Remove duplicates and sort
    for platform in analysis:
        analysis[platform]['key_concepts'] = sorted(list(set(analysis[platform]['key_concepts'])))
    
    print("📋 Key concepts found:")
    for platform, data in analysis.items():
        print(f"  {platform.upper()}: {', '.join(data['key_concepts'])}")
    
    return analysis

if __name__ == "__main__":
    # Scrape comprehensive documentation
    docs = scrape_comprehensive_docs()
    
    # Analyze the documentation structure
    analysis = analyze_documentation_structure(docs)
    
    print(f"\n✨ Comprehensive documentation scraping and analysis complete!")
    print(f"🎯 Ready to build better Mama Bear integration with full knowledge base")