# Web Search MCP Server for LM Studio

A comprehensive Model Context Protocol (MCP) server that provides web search capabilities for LM Studio and other MCP-compatible applications. Features Google Custom Search API integration with DuckDuckGo and web scraping fallbacks.

## Features

- 🔍 **Multi-Engine Search**: Google Custom Search API (primary), DuckDuckGo API, and web scraping fallbacks
- 🔑 **Flexible Authentication**: Bring your own Google API key or use free alternatives
- 🛡️ **Rate Limiting**: Built-in 500 requests/day limit for safe usage
- 📊 **Comprehensive Logging**: Detailed logs for debugging and monitoring
- ⚡ **Fast Fallbacks**: Automatic failover between search engines
- 🎯 **Rich Results**: Titles, URLs, snippets, metadata, and source attribution
- 🔧 **Runtime Configuration**: Update API keys and settings without restart

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- LM Studio (for integration)

### Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd web-search-mcp-server
npm install
```

2. **Build the project:**
```bash
npm run build
```

3. **Configure environment (optional):**
```bash
cp .env.example .env
# Edit .env with your Google API credentials (optional)
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
USER_AGENT=Mozilla/5.0 (compatible; WebSearchMCP/1.0)

# Logging
LOG_LEVEL=info
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

## LM Studio Integration

### Method 1: Direct Configuration

Add this to your LM Studio MCP configuration:

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search-mcp-server/dist/index.js"],
      "env": {
        "GOOGLE_API_KEY": "your_key_here",
        "GOOGLE_SEARCH_ENGINE_ID": "your_engine_id_here"
      }
    }
  }
}
```

### Method 2: Using Configuration File

1. Copy `lm-studio-config.json` to your LM Studio plugins directory
2. Restart LM Studio
3. Configure API keys through the LM Studio interface

## Usage

### Available Tools

#### 1. `web_search`
Search the web with comprehensive options:

```json
{
  "query": "latest AI developments 2024",
  "options": {
    "maxResults": 10,
    "language": "en",
    "region": "us",
    "safeSearch": true,
    "timeRange": "week"
  }
}
```

#### 2. `get_rate_limit_info`
Check current rate limit status:

```json
{}
```

#### 3. `update_search_config`
Update configuration at runtime:

```json
{
  "googleApiKey": "new_api_key",
  "googleSearchEngineId": "new_engine_id",
  "maxResults": 15
}
```

### Search Engine Fallback Strategy

1. **Google Custom Search API** (if configured) - Best quality results
2. **DuckDuckGo API** - Good quality, no API key required
3. **Web Scraping** - Startpage and Searx as last resort

## API Response Format

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

## Rate Limiting

- **Default Limit**: 500 requests per 24-hour period
- **Automatic Reset**: Sliding window, oldest requests expire after 24 hours
- **Rate Limit Info**: Check remaining requests with `get_rate_limit_info` tool

## Logging

Logs are written to:
- `logs/combined.log` - All log levels
- `logs/error.log` - Error level only
- Console output with colors

Log levels: `error`, `warn`, `info`, `debug`

## Development

### Running in Development Mode

```bash
npm run dev
```

### Project Structure

```
src/
├── index.ts              # Main entry point
├── mcp-server.ts         # MCP server implementation
├── search-manager.ts     # Search orchestration
├── rate-limiter.ts       # Rate limiting logic
├── logger.ts             # Logging configuration
├── types.ts              # TypeScript definitions
└── search-engines/       # Search engine implementations
    ├── google.ts         # Google Custom Search
    ├── duckduckgo.ts     # DuckDuckGo API
    └── web-scraper.ts    # Web scraping fallback
```

## Troubleshooting

### Common Issues

1. **No search results**: Check if any search engines are working with `get_rate_limit_info`
2. **Rate limit exceeded**: Wait for reset or check limit with rate limit tool
3. **Google API errors**: Verify API key and search engine ID
4. **Connection timeouts**: Increase `SEARCH_TIMEOUT` environment variable

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
3. Review the troubleshooting section
4. Open an issue with detailed logs and configuration