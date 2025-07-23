import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import logger from './logger.js';
import { SearchManager } from './search-manager.js';
const SearchOptionsSchema = z.object({
    maxResults: z.number().min(1).max(50).optional(),
    language: z.string().optional(),
    region: z.string().optional(),
    safeSearch: z.boolean().optional(),
    timeRange: z.enum(['day', 'week', 'month', 'year']).optional()
});
export class MCPServer {
    server;
    searchManager;
    constructor(config) {
        this.server = new Server({
            name: 'web-search-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.searchManager = new SearchManager(config);
        this.setupHandlers();
        logger.info('MCP Server initialized', {
            serverName: 'web-search-mcp-server',
            version: '1.0.0'
        });
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools = [
                {
                    name: 'web_search',
                    description: 'Search the web using Google Custom Search API, DuckDuckGo, or web scraping as fallbacks',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'The search query to execute'
                            },
                            options: {
                                type: 'object',
                                properties: {
                                    maxResults: {
                                        type: 'number',
                                        description: 'Maximum number of results to return (1-50)',
                                        minimum: 1,
                                        maximum: 50
                                    },
                                    language: {
                                        type: 'string',
                                        description: 'Language code for search results (e.g., "en", "es", "fr")'
                                    },
                                    region: {
                                        type: 'string',
                                        description: 'Region code for search results (e.g., "us", "uk", "ca")'
                                    },
                                    safeSearch: {
                                        type: 'boolean',
                                        description: 'Enable safe search filtering'
                                    },
                                    timeRange: {
                                        type: 'string',
                                        enum: ['day', 'week', 'month', 'year'],
                                        description: 'Filter results by time range'
                                    }
                                },
                                additionalProperties: false
                            }
                        },
                        required: ['query'],
                        additionalProperties: false
                    }
                },
                {
                    name: 'get_rate_limit_info',
                    description: 'Get current rate limit information',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                        additionalProperties: false
                    }
                },
                {
                    name: 'update_search_config',
                    description: 'Update search configuration (Google API keys, etc.)',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            googleApiKey: {
                                type: 'string',
                                description: 'Google Custom Search API key'
                            },
                            googleSearchEngineId: {
                                type: 'string',
                                description: 'Google Custom Search Engine ID'
                            },
                            maxResults: {
                                type: 'number',
                                description: 'Default maximum results per search',
                                minimum: 1,
                                maximum: 50
                            }
                        },
                        additionalProperties: false
                    }
                }
            ];
            logger.debug('Listed available tools', { toolCount: tools.length });
            return { tools };
        });
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            logger.info('Tool called', { toolName: name, arguments: args });
            try {
                switch (name) {
                    case 'web_search': {
                        const { query, options = {} } = args;
                        if (!query || typeof query !== 'string') {
                            throw new Error('Query parameter is required and must be a string');
                        }
                        // Validate options
                        const validatedOptions = SearchOptionsSchema.parse(options);
                        logger.info('Executing web search', { query, options: validatedOptions });
                        const result = await this.searchManager.search(query, validatedOptions);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2)
                                }
                            ]
                        };
                    }
                    case 'get_rate_limit_info': {
                        const rateLimitInfo = this.searchManager.getRateLimitInfo();
                        logger.debug('Rate limit info requested', rateLimitInfo);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        remaining: rateLimitInfo.remaining,
                                        total: rateLimitInfo.total,
                                        resetTime: new Date(rateLimitInfo.resetTime).toISOString(),
                                        resetIn: Math.max(0, rateLimitInfo.resetTime - Date.now())
                                    }, null, 2)
                                }
                            ]
                        };
                    }
                    case 'update_search_config': {
                        const config = args;
                        logger.info('Updating search configuration', {
                            hasGoogleApiKey: !!config.googleApiKey,
                            hasGoogleSearchEngineId: !!config.googleSearchEngineId,
                            maxResults: config.maxResults
                        });
                        this.searchManager.updateConfig(config);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        message: 'Search configuration updated successfully',
                                        googleConfigured: !!(config.googleApiKey && config.googleSearchEngineId)
                                    }, null, 2)
                                }
                            ]
                        };
                    }
                    default:
                        logger.error('Unknown tool called', { toolName: name });
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                logger.error('Tool execution failed', {
                    toolName: name,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined
                });
                throw error;
            }
        });
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        logger.info('MCP Server started and connected via stdio transport');
    }
}
//# sourceMappingURL=mcp-server.js.map