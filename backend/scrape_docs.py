import asyncio
import json
import os
from services.mama_bear_scrapybara_integration import create_mama_bear_scrapybara_agent

async def scrape_and_save(agent, url, output_file):
    """Scrapes a URL and saves the content to a file."""
    print(f"Scraping {url}...")
    try:
        result = await agent.copycapy_website(url, "doc_scraper")
        if result["success"]:
            with open(output_file, "a") as f:
                f.write(json.dumps({"url": url, "content": result["result"]}) + "\n")
            print(f"Successfully scraped and saved {url}")
        else:
            print(f"Failed to scrape {url}: {result['error']}")
    except Exception as e:
        print(f"Failed to scrape {url}: {e}")

def load_local_docs(output_file):
    """Load local documentation files into the scraped docs."""
    print("Loading local documentation files...")
    
    local_docs = [
        {
            "path": "docs/images/agent-rules.md",
            "title": "Scrapybara Agent Rules and SDK Documentation",
            "description": "Comprehensive Scrapybara SDK usage guide for Python and TypeScript"
        },
        {
            "path": "docs/images/scrapybara-llm.md",
            "title": "Complete Scrapybara Documentation",
            "description": "Full Scrapybara platform documentation including API reference, tools, and examples"
        }
    ]
    
    for doc in local_docs:
        try:
            if os.path.exists(doc["path"]):
                with open(doc["path"], "r", encoding="utf-8") as f:
                    content = f.read()
                
                doc_entry = {
                    "url": f"local://{doc['path']}",
                    "title": doc["title"],
                    "description": doc["description"],
                    "content": content,
                    "type": "local_documentation"
                }
                
                with open(output_file, "a") as f:
                    f.write(json.dumps(doc_entry) + "\n")
                print(f"Successfully loaded {doc['path']}")
            else:
                print(f"Warning: {doc['path']} not found")
        except Exception as e:
            print(f"Failed to load {doc['path']}: {e}")

async def main():
    """Main function to scrape documentation."""
    config = {
        'scrapybara_api_key': 'default-key',
        'scrapybara_base_url': 'https://api.scrapybara.com/v1'
    }
    
    # Comprehensive Scrapybara documentation URLs
    urls_to_scrape = [
        # Core Documentation
        "https://docs.scrapybara.com/introduction",
        "https://docs.scrapybara.com/getting-started",
        "https://docs.scrapybara.com/best-practices",
        
        # Act SDK
        "https://docs.scrapybara.com/act-sdk",
        "https://docs.scrapybara.com/conversations",
        "https://docs.scrapybara.com/tools",
        
        # Instance Types
        "https://docs.scrapybara.com/ubuntu",
        "https://docs.scrapybara.com/browser",
        "https://docs.scrapybara.com/windows",
        
        # Protocols
        "https://docs.scrapybara.com/protocols/browser",
        "https://docs.scrapybara.com/protocols/code",
        "https://docs.scrapybara.com/protocols/env",
        
        # Models
        "https://docs.scrapybara.com/openai",
        "https://docs.scrapybara.com/anthropic",
        
        # Auth States
        "https://docs.scrapybara.com/auth-states",
        
        # API Reference
        "https://docs.scrapybara.com/api-reference",
        
        # SDKs
        "https://docs.scrapybara.com/sdk-reference/python",
        "https://docs.scrapybara.com/sdk-reference/typescript",
        
        # Templates and Examples
        "https://docs.scrapybara.com/starter-templates",
        "https://docs.scrapybara.com/cursor-rules",
        
        # Cookbook
        "https://docs.scrapybara.com/cookbook",
        "https://docs.scrapybara.com/cookbook/copycapy",
        "https://docs.scrapybara.com/cookbook/wide-research",
        
        # OpenAI Computer Use Assistant docs
        "https://platform.openai.com/docs/assistants/overview",
        "https://platform.openai.com/docs/assistants/how-it-works",
        "https://platform.openai.com/docs/assistants/tools",
        "https://platform.openai.com/docs/assistants/computer-use",
    ]

    output_file = "docs/scraped_docs.jsonl"

    # Clear the output file
    with open(output_file, "w") as f:
        pass

    # First, load local documentation files
    load_local_docs(output_file)
    
    # Then scrape online documentation
    try:
        agent = await create_mama_bear_scrapybara_agent(config)
        async with agent:
            print(f"Starting to scrape {len(urls_to_scrape)} URLs...")
            tasks = [scrape_and_save(agent, url, output_file) for url in urls_to_scrape]
            await asyncio.gather(*tasks)
            print("Scraping completed!")
    except Exception as e:
        print(f"Error during scraping: {e}")
        print("Local documentation has been loaded successfully.")

if __name__ == "__main__":
    asyncio.run(main())