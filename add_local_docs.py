#!/usr/bin/env python3
import json
import os

def add_local_docs():
    """Add local documentation files to the scraped docs."""
    
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
    
    output_file = "docs/scraped_docs.jsonl"
    
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
                print(f"Successfully added {doc['path']}")
            else:
                print(f"Warning: {doc['path']} not found")
        except Exception as e:
            print(f"Failed to add {doc['path']}: {e}")

if __name__ == "__main__":
    add_local_docs()