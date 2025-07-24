import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import logger from './logger.js';
import { SearchManager } from './search-manager.js';
import { SearchConfig, SearchOptions, LLMOptimizedResponse } from './types.js';

const SearchOptionsSchema = z.object({
  maxResults: z.number().min(1).max(50).optional(),
  language: z.string().optional(),
  region: z.string().optional(),
  safeSearch: z.boolean().optional(),
  timeRange: z.enum(['day', 'week', 'month', 'year']).optional(),
  formatForLLM: z.boolean().optional(),
  includeSummary: z.boolean().optional(),
  relevanceThreshold: z.number().min(0).max(1).optional()
});

export class MCPServer {
  private server: Server;
  private searchManager: SearchManager;

  constructor(config: SearchConfig) {
    this.server = new Server(
      {
        name: 'web-search',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.searchManager = new SearchManager(config);
    this.setupHandlers();

    logger.info('CrawlDock MCP Server initialized', {
      serverName: 'web-search',
      version: '1.0.0'
    });
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.log('[MCP Server] Tools requested by LM Studio');
      const tools: Tool[] = [
        {
          name: 'web_search',
          description: 'Search the web using Google Custom Search API, DuckDuckGo, or web scraping as fallbacks. Optimized for LLM consumption with structured results.',
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
                  },
                  formatForLLM: {
                    type: 'boolean',
                    description: 'Format results optimized for LLM consumption'
                  },
                  includeSummary: {
                    type: 'boolean',
                    description: 'Include a summary of all results'
                  },
                  relevanceThreshold: {
                    type: 'number',
                    description: 'Minimum relevance score (0-1) for results'
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
          name: 'get_performance_info',
          description: 'Get performance statistics for all search engines',
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

      console.log(`[MCP Server] Tool called: ${name}`);
      console.log(`[MCP Server] Arguments:`, JSON.stringify(args, null, 2));
      logger.info('Tool called', { 
        toolName: name,
        arguments: args,
        method: request.method
      });

      try {
        switch (name) {
          case 'web_search': {
            logger.info('Processing web_search tool call', { args });
            console.log(`[MCP Server] Processing web_search query: "${args?.query}"`);
            console.log(`[MCP Server] Search options:`, JSON.stringify(args?.options, null, 2));
            
            const { query, options = {} } = args as { query: string; options?: SearchOptions };
            
            if (!query || typeof query !== 'string') {
              logger.error('Invalid query parameter', { query, type: typeof query });
              throw new Error('Query parameter is required and must be a string');
            }

            // Validate options
            const validatedOptions = SearchOptionsSchema.parse(options);
            
            // Log LLM request
            logger.llmRequest(query, validatedOptions);
            
            logger.info('Executing web search', { query, options: validatedOptions });
            
            const result = await this.searchManager.search(query, validatedOptions);
            
            // Log LLM response
            logger.llmResponse(query, result.results, result.processingTime, result.searchEngine);
            
            // Format response based on LLM optimization
            let responseContent: string;
            if (validatedOptions.formatForLLM) {
              const llmResponse = this.formatForLLM(result, validatedOptions);
              responseContent = JSON.stringify(llmResponse, null, 2);
            } else {
              responseContent = JSON.stringify(result, null, 2);
            }
            
            logger.info('Web search completed successfully', { 
              query, 
              resultsCount: result.results.length,
              processingTime: result.processingTime
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: responseContent
                }
              ]
            };
          }

          case 'get_rate_limit_info': {
            logger.info('Processing get_rate_limit_info tool call');
            
            const rateLimitInfo = this.searchManager.getRateLimitInfo();
            
            logger.debug('Rate limit info requested', rateLimitInfo);
            
            // Log rate limit warning if low
            if (rateLimitInfo.remaining < 50) {
              logger.llmRateLimit(rateLimitInfo.remaining, rateLimitInfo.resetTime);
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    remaining: rateLimitInfo.remaining,
                    total: rateLimitInfo.total,
                    resetTime: new Date(rateLimitInfo.resetTime).toISOString(),
                    resetIn: Math.max(0, rateLimitInfo.resetTime - Date.now()),
                    warning: rateLimitInfo.remaining < 50 ? 'Low rate limit remaining' : undefined
                  }, null, 2)
                }
              ]
            };
          }

          case 'get_performance_info': {
            logger.info('Processing get_performance_info tool call');
            
            const performanceInfo = this.searchManager.getPerformanceInfo();
            
            logger.debug('Performance info requested', performanceInfo);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    rateLimit: {
                      remaining: performanceInfo.rateLimit.remaining,
                      total: performanceInfo.rateLimit.total,
                      resetTime: new Date(performanceInfo.rateLimit.resetTime).toISOString(),
                      resetIn: Math.max(0, performanceInfo.rateLimit.resetTime - Date.now())
                    },
                    engineStats: performanceInfo.engineStats,
                    timestamp: new Date().toISOString()
                  }, null, 2)
                }
              ]
            };
          }

          case 'update_search_config': {
            logger.info('Processing update_search_config tool call', { args });
            
            const config = args as Partial<SearchConfig>;
            
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
                    googleConfigured: !!(config.googleApiKey && config.googleSearchEngineId),
                    timestamp: new Date().toISOString()
                  }, null, 2)
                }
              ]
            };
          }

          default:
            logger.error('Unknown tool called', { toolName: name });
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error('Tool execution failed', {
          toolName: name,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        throw error;
      }
    });
  }

  private formatForLLM(response: any, options: SearchOptions): LLMOptimizedResponse {
    const results = response.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      summary: result.snippet.substring(0, 200), // Truncate for LLM consumption
      relevance: this.calculateRelevance(result, response.query),
      source: result.source || response.searchEngine,
      domain: result.metadata?.domain || new URL(result.url).hostname
    }));

    // Filter by relevance threshold if specified
    const filteredResults = options.relevanceThreshold 
      ? results.filter((r: any) => r.relevance >= (options.relevanceThreshold || 0))
      : results;

    // Generate summary if requested
    let summary = '';
    if (options.includeSummary && filteredResults.length > 0) {
      summary = `Found ${filteredResults.length} relevant results for "${response.query}". ` +
                `Top sources include: ${filteredResults.slice(0, 3).map((r: any) => r.domain).join(', ')}. ` +
                `Search completed in ${response.processingTime}ms using ${response.searchEngine}.`;
    }

    return {
      query: response.query,
      results: filteredResults,
      summary,
      searchEngine: response.searchEngine,
      processingTime: response.processingTime,
      confidence: this.calculateConfidence(filteredResults, response.processingTime)
    };
  }

  private calculateRelevance(result: any, query: string): number {
    const queryLower = query.toLowerCase();
    const titleLower = result.title.toLowerCase();
    const snippetLower = result.snippet.toLowerCase();
    
    let score = 0;
    
    // Title relevance (higher weight)
    if (titleLower.includes(queryLower)) score += 0.4;
    if (titleLower.includes(queryLower.split(' ')[0])) score += 0.2;
    
    // Snippet relevance
    if (snippetLower.includes(queryLower)) score += 0.3;
    if (snippetLower.includes(queryLower.split(' ')[0])) score += 0.1;
    
    // Domain authority (simple heuristic)
    const domain = result.metadata?.domain || new URL(result.url).hostname;
    if (domain.includes('wikipedia.org')) score += 0.1;
    if (domain.includes('stackoverflow.com')) score += 0.1;
    
    return Math.min(1, score);
  }

  private calculateConfidence(results: any[], processingTime: number): number {
    if (results.length === 0) return 0;
    
    let confidence = 0.5; // Base confidence
    
    // More results = higher confidence
    confidence += Math.min(0.3, results.length * 0.05);
    
    // Faster processing = higher confidence
    if (processingTime < 1000) confidence += 0.1;
    else if (processingTime > 5000) confidence -= 0.1;
    
    // Higher average relevance = higher confidence
    const avgRelevance = results.reduce((sum: number, r: any) => sum + r.relevance, 0) / results.length;
    confidence += avgRelevance * 0.1;
    
    return Math.min(1, Math.max(0, confidence));
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('CrawlDock MCP Server started and connected via stdio transport');
  }
}