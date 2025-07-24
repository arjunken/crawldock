# Changelog

All notable changes to CrawlDock will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced logging with correlation IDs and LLM-specific events
- Performance monitoring and tracking for search engines
- Retry logic with exponential backoff for transient failures
- Comprehensive error handling and fallback mechanisms
- LLM-optimized response formatting with relevance scoring
- Console logging for better visibility in MCP clients
- Graceful shutdown handling for various signals
- Test scripts for server verification and search functionality
- Comprehensive documentation and troubleshooting guides

### Changed
- Rebranded from "Web Search MCP Server" to "CrawlDock"
- Updated server name from "crawldock" to "web-search" for better UX
- Enhanced MCP server configuration with `cwd` field requirement
- Improved error messages with engine-specific results
- Updated all documentation to reflect universal MCP compatibility

### Fixed
- Logger initialization issue causing server startup failures
- Environment variable loading in LM Studio with `cwd` configuration
- Multiple server instance conflicts and process management
- TypeScript compilation errors and linter issues
- Search engine configuration and API key loading

## [1.0.0] - 2025-07-24

### Added
- Initial release of CrawlDock MCP Server
- Google Custom Search API integration
- DuckDuckGo API fallback
- Web scraping fallback (Startpage, Searx)
- Rate limiting (500 requests/day)
- Winston logging with structured output
- TypeScript implementation
- MCP stdio transport support
- Environment-based configuration
- Comprehensive error handling
- Retry logic for transient failures
- LLM-optimized search results
- Performance monitoring tools
- Security best practices documentation

### Features
- Multi-engine search with automatic failover
- LLM-optimized response formatting
- Comprehensive logging with correlation IDs
- Rate limiting and performance tracking
- Graceful error handling and retry logic
- Universal MCP client compatibility
- Security-focused API key management
- Extensive documentation and troubleshooting guides

### Supported MCP Clients
- LM Studio
- Claude Desktop
- Ollama
- Any MCP-compliant application

### Search Engines
- **Primary**: Google Custom Search API
- **Fallback 1**: DuckDuckGo API
- **Fallback 2**: Web scraping (Startpage, Searx)

---

## Version History

### Version 1.0.0
- **Release Date**: July 24, 2025
- **Status**: Stable Release
- **Key Features**: Multi-engine search, LLM optimization, comprehensive logging
- **Breaking Changes**: None (initial release)
- **Deprecations**: None

---

## Contributing to the Changelog

When adding entries to the changelog, please follow these guidelines:

### Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes

### Format
- Use clear, concise descriptions
- Reference issue numbers when applicable
- Group related changes together
- Use present tense ("Add" not "Added")
- Use imperative mood ("Move" not "Moves")

### Example
```markdown
### Added
- New search engine support for Bing
- Performance monitoring dashboard
- API rate limiting improvements

### Fixed
- Issue with Google API key validation (#123)
- Memory leak in search manager (#124)
- Incorrect error messages for failed searches
```

---

**For more information about CrawlDock, see the [README.md](README.md).** 