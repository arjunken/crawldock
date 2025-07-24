# Cursor.ai Setup Guide for CrowlDock

This guide will help you set up CrowlDock (Web Search MCP Server) with Cursor.ai for enhanced web search capabilities in your coding workflow.

## Prerequisites

- [Cursor.ai](https://cursor.ai/) installed on your system
- Node.js 18 or higher
- Git (to clone the repository)

## Step 1: Install CrowlDock

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/crawldock.git
cd crawldock
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

## Step 2: Configure Environment (Optional)

For best results, configure Google API credentials:

1. **Create `.env` file:**
```bash
cp .env.example .env
```

2. **Edit `.env` with your credentials:**
```env
# Google Custom Search API (Optional - provides best results)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Other settings (optional)
MAX_RESULTS=10
SEARCH_TIMEOUT=10000
```

## Step 3: Configure Cursor.ai

1. **Open Cursor.ai**

2. **Go to Settings:**
   - Click the gear icon (⚙️) in the bottom left
   - Or use `Ctrl/Cmd + ,`

3. **Navigate to MCP Settings:**
   - Go to **Extensions** → **MCP**
   - Click **Add Server**

4. **Add CrowlDock Configuration:**
```json
{
  "name": "web-search",
  "command": "node",
  "args": ["dist/index.js"],
  "cwd": "/path/to/your/crawldock",
  "transport": "stdio"
}
```

**Important:** Replace `/path/to/your/crawldock` with the actual path to your CrowlDock installation.

**Example paths:**
- Windows: `C:\\Users\\YourName\\crawldock`
- macOS: `/Users/YourName/crawldock`
- Linux: `/home/YourName/crawldock`

## Step 4: Test the Setup

1. **Restart Cursor.ai**

2. **Open a new chat or conversation**

3. **Test web search:**
   - Try: "Search for React best practices 2024"
   - Try: "Find the latest TypeScript features"
   - Try: "Search for Python async/await tutorials"

## Usage Examples

### In Chat
```
You: "Search for the latest React 19 features"
Assistant: [Uses web search to find current information about React 19]

You: "Find best practices for error handling in TypeScript"
Assistant: [Searches for TypeScript error handling best practices]
```

### In Code Comments
```typescript
// TODO: Search for React performance optimization techniques
// TODO: Find the latest Next.js 15 features
// TODO: Search for TypeScript strict mode best practices
```

### In Documentation
```markdown
<!-- Search for the latest AI development tools -->
<!-- Find current web development trends 2024 -->
```

## Troubleshooting

### Issue: "Tool call failed for web_search()"

**Possible causes:**
1. **Incorrect path in `cwd`**: Make sure the path points to your CrowlDock directory
2. **Missing `.env` file**: The server needs the `.env` file to load API keys
3. **Server not built**: Run `npm run build` again

**Solution:**
1. Check your Cursor.ai MCP configuration
2. Verify the `cwd` path is correct
3. Ensure `.env` file exists in the CrowlDock directory
4. Rebuild: `npm run build`

### Issue: "All search engines failed to return results"

**Possible causes:**
1. **No API keys configured**: CrowlDock works without Google API, but results may be limited
2. **Network issues**: Check your internet connection
3. **Rate limiting**: Wait a few minutes and try again

**Solution:**
1. Configure Google API keys (optional but recommended)
2. Check internet connection
3. Wait and retry

### Issue: Cursor.ai doesn't recognize the MCP server

**Solution:**
1. Restart Cursor.ai completely
2. Check the MCP configuration syntax
3. Verify the server path is correct

## Advanced Configuration

### Custom Search Options

You can customize search behavior by modifying the `.env` file:

```env
# Search Settings
MAX_RESULTS=15
SEARCH_TIMEOUT=15000
LOG_LEVEL=debug

# Rate Limiting
MAX_REQUESTS_PER_DAY=1000
RATE_LIMIT_WINDOW_HOURS=24
```

### Multiple Search Engines

CrowlDock automatically uses:
1. **Google Custom Search API** (if configured) - Best quality
2. **DuckDuckGo API** - Good quality, no API key needed
3. **Web Scraping** - Fallback option

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/crawldock/issues)
- **Documentation**: See the main [README.md](../README.md) for detailed information
- **MCP Protocol**: Learn more about [Model Context Protocol](https://modelcontextprotocol.io/)

## Features

- 🔍 **Multi-Engine Search**: Google, DuckDuckGo, and web scraping
- 🤖 **LLM-Optimized**: Results formatted for AI consumption
- 🔑 **Flexible Auth**: Use Google API or free alternatives
- 🛡️ **Rate Limiting**: Built-in protection against abuse
- 📊 **Rich Results**: Titles, URLs, summaries, and metadata
- ⚡ **Fast Fallbacks**: Automatic failover between engines

Happy coding with CrowlDock! 🚀 