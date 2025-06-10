#!/usr/bin/env python3
"""
Scrape Mem0.ai documentation to understand the correct API usage
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import os

def scrape_mem0_docs():
    """Scrape Mem0.ai documentation"""
    
    # Key Mem0 documentation URLs
    mem0_urls = [
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
    
    scraped_docs = []
    
    print(f"Starting to scrape {len(mem0_urls)} Mem0 documentation URLs...")
    
    for url in mem0_urls:
        try:
            print(f"Scraping {url}...")
            
            # Add delay to be respectful
            time.sleep(1)
            
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else url
            
            # Extract main content
            content_selectors = [
                'main',
                '.content',
                '.documentation',
                '.docs-content',
                'article',
                '.markdown-body',
                '#content'
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
            
            doc_entry = {
                "url": url,
                "title": title_text,
                "content": content,
                "code_examples": code_examples,
                "type": "mem0_documentation",
                "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            scraped_docs.append(doc_entry)
            print(f"Successfully scraped {url}")
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    # Save to file
    output_file = "docs/mem0_docs.jsonl"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w') as f:
        for doc in scraped_docs:
            f.write(json.dumps(doc) + '\n')
    
    print(f"\nScraping completed! Saved {len(scraped_docs)} documents to {output_file}")
    return scraped_docs

if __name__ == "__main__":
    scrape_mem0_docs()