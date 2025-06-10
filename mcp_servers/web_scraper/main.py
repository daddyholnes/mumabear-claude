import asyncio
from typing import Dict, Any
from mcp.server.fastmcp import FastMCP
import requests
from bs4 import BeautifulSoup

mcp = FastMCP("web_scraper")

@mcp.tool()
async def scrape_url(url: str) -> Dict[str, Any]:
    """
    Scrapes the text content from a given URL.

    :param url: The URL to scrape.
    :return: A dictionary containing the scraped text content.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return {"success": True, "content": soup.get_text()}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    mcp.run()