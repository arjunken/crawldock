import logger from './logger.js';
import { RateLimiter } from './rate-limiter.js';
import { GoogleSearchEngine } from './search-engines/google.js';
import { DuckDuckGoSearchEngine } from './search-engines/duckduckgo.js';
import { WebScraperSearchEngine } from './search-engines/web-scraper.js';
import { SearchResult, SearchResponse, SearchConfig, SearchOptions } from './types.js';

export class SearchManager {
  private rateLimiter: RateLimiter;
  private googleEngine: GoogleSearchEngine;
  private duckduckgoEngine: DuckDuckGoSearchEngine;
  private webScraperEngine: WebScraperSearchEngine;
  private config: SearchConfig;

  constructor(config: SearchConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter();
    this.googleEngine = new GoogleSearchEngine(config);
    this.duckduckgoEngine = new DuckDuckGoSearchEngine(config);
    this.webScraperEngine = new WebScraperSearchEngine(config);

    logger.info('Search Manager initialized', {
      googleConfigured: this.googleEngine.isConfigured(),
      maxResults: config.maxResults,
      timeout: config.timeout
    });
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    // Check rate limit
    if (!this.rateLimiter.canMakeRequest()) {
      const rateLimitInfo = this.rateLimiter.getRateLimitInfo();
      logger.warn('Rate limit exceeded', {
        query,
        remaining: rateLimitInfo.remaining,
        resetTime: new Date(rateLimitInfo.resetTime).toISOString()
      });
      throw new Error(`Rate limit exceeded. Resets at ${new Date(rateLimitInfo.resetTime).toISOString()}`);
    }

    // Record the request
    this.rateLimiter.recordRequest();

    const searchEngines = [
      { name: 'Google', engine: this.googleEngine, enabled: this.googleEngine.isConfigured() },
      { name: 'DuckDuckGo', engine: this.duckduckgoEngine, enabled: true },
      { name: 'WebScraper', engine: this.webScraperEngine, enabled: true }
    ];

    logger.info('Starting search with fallback strategy', {
      query,
      options,
      availableEngines: searchEngines.filter(e => e.enabled).map(e => e.name)
    });

    for (const { name, engine, enabled } of searchEngines) {
      if (!enabled) {
        logger.debug(`Skipping ${name} - not configured`);
        continue;
      }

      try {
        logger.info(`Attempting search with ${name}`, { query });
        const result = await engine.search(query, options);
        
        if (result.results.length > 0) {
          logger.info(`Search successful with ${name}`, {
            query,
            resultsCount: result.results.length,
            engine: name
          });
          return result;
        } else {
          logger.warn(`No results from ${name}`, { query });
        }
      } catch (error) {
        logger.error(`Search failed with ${name}`, {
          query,
          engine: name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Continue to next engine
        continue;
      }
    }

    // If all engines failed
    logger.error('All search engines failed', { query });
    throw new Error('All search engines failed to return results');
  }

  getRateLimitInfo() {
    return this.rateLimiter.getRateLimitInfo();
  }

  updateConfig(newConfig: Partial<SearchConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate engines with new config
    this.googleEngine = new GoogleSearchEngine(this.config);
    this.duckduckgoEngine = new DuckDuckGoSearchEngine(this.config);
    this.webScraperEngine = new WebScraperSearchEngine(this.config);

    logger.info('Search configuration updated', {
      googleConfigured: this.googleEngine.isConfigured(),
      maxResults: this.config.maxResults
    });
  }
}