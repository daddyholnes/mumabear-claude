ok# MCP Configuration JSON Fix Plan

## Issues Identified in `.kilocode/mcp.json`

### Critical JSON Syntax Errors

1. **Line 86**: Invalid array closing bracket `]` instead of object closing brace `}`
   - Current: `"GOOGLE_API_KEY": "AIzaSyDJqNc2s-L2_RW0-AwMevHRvhYgEMMXLRM",]`
   - Should be: `"GOOGLE_API_KEY": "AIzaSyDJqNc2s-L2_RW0-AwMevHRvhYgEMMXLRM"`

2. **Line 87**: Duplicate `env` property in `task-master-ai` section
   - The section has two `env` properties, which is invalid JSON
   - Second `env: {}` should be removed

3. **Line 106**: Missing `env` property for `@21st-dev/magic` server
   - All other servers have an `env` property for consistency
   - Should add `"env": {}` after the `args` array

### Security Concerns

⚠️ **CRITICAL SECURITY ISSUE**: The file contains exposed API keys and tokens:
- GitHub Personal Access Token
- Anthropic API Key  
- OpenAI API Key
- Google API Key
- Perplexity API Key
- Brave API Key
- Magic API Key

**Recommendation**: Move all sensitive credentials to environment variables or a secure `.env` file.

## Corrected JSON Structure

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "puppeteer": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {}
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/woody"],
      "env": {}
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"],
      "env": {}
    },
    "fetch": {
      "command": "uvx", 
      "args": ["mcp-server-fetch"],
      "env": {}
    },
