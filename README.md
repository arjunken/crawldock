# CrawlDock - Web Search MCP Server

A comprehensive Model Context Protocol (MCP) server that provides web search capabilities for any MCP-compliant applications. Features Google Custom Search API integration with DuckDuckGo and web scraping fallbacks, optimized for LLM consumption.

## Features

- 🔍 **Multi-Engine Search**: Google Custom Search API (primary), DuckDuckGo API, and web scraping fallbacks
- 🤖 **LLM-Optimized Results**: Structured responses with relevance scoring and confidence metrics
- 🔑 **Flexible Authentication**: Bring your own Google API key or use free alternatives
- 🛡️ **Rate Limiting**: Built-in 500 requests/day limit for safe usage
- 📊 **Comprehensive Logging**: Detailed logs with correlation IDs and LLM-specific events
- ⚡ **Fast Fallbacks**: Automatic failover between search engines with retry logic
- 🎯 **Rich Results**: Titles, URLs, snippets, metadata, and source attribution
- 🔧 **Runtime Configuration**: Update API keys and settings without restart
- 📈 **Performance Monitoring**: Track search engine performance and success rates
- 🔄 **Retry Logic**: Automatic retry with exponential backoff for transient failures

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Any MCP-compliant application (LM Studio, Claude Desktop, Ollama, etc.)

### Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd crawldock
npm install
```

2. **Build the project:**
```bash
npm run build
```

3. **Configure environment (optional):**
```bash
cp config.example.json config.json
# Edit config.json with your Google API credentials (optional)
```

4. **Test the server:**
```bash
npm start
```

## Configuration

### Environment Variables

Create a `.env` file with the following optional configurations:

```env
# Google Custom Search API (Optional - provides best results)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Search Settings
MAX_RESULTS=10
SEARCH_TIMEOUT=10000
USER_AGENT=Mozilla/5.0 (compatible; CrawlDock/1.0)

# Logging
LOG_LEVEL=info

# Performance Settings
MAX_RETRIES=3
RETRY_DELAY=1000

# Rate Limiting
MAX_REQUESTS_PER_DAY=500
RATE_LIMIT_WINDOW_HOURS=24
```

### Getting Google API Credentials (Optional)

1. **Get API Key:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Custom Search API
   - Create credentials and get your API key

2. **Create Search Engine:**
   - Go to [Google Custom Search](https://cse.google.com/cse/)
   - Create a new search engine
   - Get your Search Engine ID

## MCP Application Integration

### LM Studio Configuration

**Step 1: Build CrawlDock**
```bash
npm install
npm run build
```

**Step 2: Configure LM Studio**
Add this to your LM Studio MCP configuration (`%APPDATA%\LM Studio\mcp.json`):

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "C:\\path\\to\\crawldock"
    }
  }
}
```

**Important**: The `cwd` (current working directory) field is **essential** for loading the `.env` file with your Google API keys. Without this, the server will start without API keys and all search engines will fail.

**Step 3: Restart and Test**
1. Restart LM Studio
2. Start a new conversation
3. You should see a "web-search" toggle
4. Try: "Search for the latest AI developments"

### Claude Desktop Configuration

**Step 1: Build CrawlDock**
```bash
npm install
npm run build
```

**Step 2: Configure Claude Desktop**
Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/crawldock"
    }
  }
}
```

**Important**: The `cwd` (current working directory) field is **essential** for loading the `.env` file with your Google API keys.

**Step 3: Restart and Test**
1. Restart Claude Desktop
2. Start a new conversation
3. Try: "Search for the latest AI developments"

### Ollama Configuration

**Step 1: Build CrawlDock**
```bash
npm install
npm run build
```

**Step 2: Configure Ollama**
Configure in your Ollama MCP plugin settings:

```json
{
  "servers": {
    "web-search": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/crawldock"
    }
  }
}
```

**Important**: The `cwd` (current working directory) field is **essential** for loading the `.env` file with your Google API keys.

**Step 3: Restart and Test**
1. Restart Ollama
2. Start a new conversation
3. Try: "Search for the latest AI developments"

### Custom MCP Client

For any MCP-compliant client, use the stdio transport:

```json
{
  "name": "web-search",
  "command": "node",
  "args": ["dist/index.js"],
  "cwd": "/path/to/crawldock",
  "transport": "stdio"
}
```

**Important**: The `cwd` (current working directory) field is **essential** for loading the `.env` file with your Google API keys.

## Usage

### How to Use in Conversations

Once configured, you can use CrawlDock in your conversations:

#### **Basic Web Search**
```
User: "Search for the latest AI developments"
Assistant: [Uses web-search tool to find current information]
```

#### **Specific Queries**
```
User: "Search for Python tutorials for beginners"
Assistant: [Uses web-search tool with specific parameters]
```

#### **Recent Information**
```
User: "What are the latest news about OpenAI?"
Assistant: [Uses web-search tool with time filtering]
```

### Available Tools

#### 1. `web_search`
Search the web with comprehensive options optimized for LLMs:

```json
{
  "query": "latest AI developments 2024",
  "options": {
    "maxResults": 10,
    "language": "en",
    "region": "us",
    "safeSearch": true,
    "timeRange": "week",
    "formatForLLM": true,
    "includeSummary": true,
    "relevanceThreshold": 0.5
  }
}
```

**LLM-Optimized Response Format:**
```json
{
  "query": "latest AI developments 2024",
  "results": [
    {
      "title": "Latest AI Developments 2024",
      "url": "https://example.com/ai-2024",
      "summary": "Comprehensive overview of AI developments...",
      "relevance": 0.85,
      "source": "Google Custom Search",
      "domain": "example.com"
    }
  ],
  "summary": "Found 8 relevant results for \"latest AI developments 2024\". Top sources include: example.com, techcrunch.com, arxiv.org. Search completed in 1250ms using google.",
  "searchEngine": "google",
  "processingTime": 1250,
  "confidence": 0.92
}
```

#### 2. `get_rate_limit_info`
Check current rate limit status:

```json
{}
```

#### 3. `get_performance_info`
Get performance statistics for all search engines:

```json
{}
```

#### 4. `update_search_config`
Update configuration at runtime:

```json
{
  "googleApiKey": "new_api_key",
  "googleSearchEngineId": "new_engine_id",
  "maxResults": 15
}
```

### Search Engine Fallback Strategy

1. **Google Custom Search API** (if configured) - Best quality results with retry logic
2. **DuckDuckGo API** - Good quality, no API key required
3. **Web Scraping** - Startpage and Searx as last resort

### LLM Optimization Features

- **Relevance Scoring**: Each result gets a 0-1 relevance score based on query matching
- **Confidence Metrics**: Overall confidence score for the search results
- **Structured Summaries**: Auto-generated summaries of search results
- **Performance Tracking**: Monitor search engine success rates and response times
- **Correlation IDs**: Track requests across logs for debugging

## API Response Format

### Standard Response
```json
{
  "query": "search query",
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "snippet": "Page description or excerpt",
      "displayUrl": "example.com",
      "publishedDate": "2024-01-01",
      "source": "Google Custom Search",
      "metadata": {
        "domain": "example.com",
        "favicon": "https://example.com/favicon.ico",
        "language": "en"
      }
    }
  ],
  "totalResults": 1000000,
  "searchEngine": "google",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "processingTime": 1250
}
```

### LLM-Optimized Response
```json
{
  "query": "search query",
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "summary": "Concise summary for LLM consumption",
      "relevance": 0.85,
      "source": "Google Custom Search",
      "domain": "example.com"
    }
  ],
  "summary": "Found 5 relevant results...",
  "searchEngine": "google",
  "processingTime": 1250,
  "confidence": 0.92
}
```

## Rate Limiting

- **Default Limit**: 500 requests per 24-hour period
- **Automatic Reset**: Sliding window, oldest requests expire after 24 hours
- **Rate Limit Info**: Check remaining requests with `get_rate_limit_info` tool
- **Low Limit Warnings**: Automatic warnings when remaining requests < 50

## Logging

### Enhanced Logging Features

- **Correlation IDs**: Track requests across all log entries
- **LLM-Specific Events**: Structured logging for LLM interactions
- **Performance Metrics**: Track search engine performance and success rates
- **Rate Limit Monitoring**: Automatic warnings for low rate limits

Logs are written to:
- `logs/combined.log` - All log levels
- `logs/error.log` - Error level only
- Console output with colors

Log levels: `error`, `warn`, `info`, `debug`

### Log Event Types

- `llm_search` - LLM search requests
- `llm_search_result` - LLM search responses
- `llm_rate_limit` - Rate limit warnings
- `engine_performance` - Search engine performance metrics

## Performance Monitoring

The server tracks performance metrics for each search engine:

- **Success Rate**: Percentage of successful searches
- **Average Processing Time**: Mean response time per engine
- **Failure Analysis**: Detailed error tracking
- **Engine Comparison**: Performance comparison across engines

## Development

### Running in Development Mode

```bash
npm run dev
```

### Project Structure

```
src/
├── index.ts              # Main entry point
├── mcp-server.ts         # MCP server implementation with LLM optimization
├── search-manager.ts     # Search orchestration with performance tracking
├── rate-limiter.ts       # Rate limiting logic
├── logger.ts             # Enhanced logging with LLM-specific methods
├── types.ts              # TypeScript definitions with LLM types
└── search-engines/       # Search engine implementations
    ├── google.ts         # Google Custom Search with retry logic
    ├── duckduckgo.ts     # DuckDuckGo API
    └── web-scraper.ts    # Web scraping fallback
```

## Troubleshooting

### Common Issues

#### **1. "All search engines failed to return results"**

**Symptoms:**
- Google: "Not configured"
- DuckDuckGo: "No results returned"
- WebScraper: "No results returned"

**Root Cause:** LM Studio not loading `.env` file due to missing `cwd` in MCP configuration.

**Solution:**
1. Update your `mcp.json` to include the `cwd` field:
   ```json
   {
     "mcpServers": {
       "web-search": {
         "command": "node",
         "args": ["dist/index.js"],
         "cwd": "C:\\path\\to\\crawldock"
       }
     }
   }
   ```
2. Restart LM Studio completely
3. Start a new conversation

#### **2. Server Not Starting**

**Symptoms:**
- `TypeError: logger.error is not a function`
- Build errors
- Missing dependencies

**Solution:**
1. Rebuild the project: `npm run build`
2. Check all dependencies: `npm install`
3. Verify TypeScript compilation

#### **3. Multiple Server Instances**

**Symptoms:**
- Multiple Node.js processes running
- Conflicting server instances
- Old cached connections

**Solution:**
1. Kill all Node.js processes: `taskkill /F /IM node.exe`
2. Restart LM Studio completely
3. Clear any MCP cache

#### **4. Incorrect Search Results**

**Symptoms:**
- Getting 2024 results instead of 2025
- Outdated information
- Wrong search context

**Solution:**
1. Use specific search queries (e.g., "Super Bowl 2025 winner")
2. Check search engine configuration
3. Verify API key permissions

#### **5. Rate limit exceeded**: Wait for reset or check limit with rate limit tool
#### **6. Connection timeouts**: Increase `SEARCH_TIMEOUT` environment variable
#### **7. Performance issues**: Use `get_performance_info` to identify slow engines

### Debug Logging

Enable debug logging:
```bash
LOG_LEVEL=debug npm start
```

### Health Check

Test the server manually:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

### Check Server Status

**1. Verify Environment Variables:**
```bash
node test-env.js
```

**2. Check Running Processes:**
```bash
# Windows
tasklist | findstr node

# Linux/Mac
ps aux | grep node
```

**3. View Server Logs:**
```bash
# View recent logs
Get-Content logs/combined.log -Tail 20

# Monitor logs in real-time
Get-Content logs/combined.log -Wait
```

**4. Test Search Functionality:**
```bash
node test-search.js
```

### Success Indicators

**Working Server Logs:**
```json
{
  "hasGoogleApiKey": true,
  "hasGoogleSearchEngineId": true,
  "googleConfigured": true,
  "serverName": "web-search"
}
```

**Working LM Studio Integration:**
- `[MCP Server] Tools requested by LM Studio`
- `[MCP Server] Tool called: web_search`
- Search results appear in conversation
- No "Tool call failed" errors

### Performance Analysis

Check engine performance:
```bash
# Use the get_performance_info tool to see:
# - Success rates for each engine
# - Average processing times
# - Rate limit status
# - Recent failures
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Enable debug logging
3. Use `get_performance_info` to diagnose issues
4. Review the troubleshooting section
5. Open an issue with detailed logs and configuration