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
  private performanceStats: Map<string, { success: number; failure: number; avgTime: number }> = new Map();

  constructor(config: SearchConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter();
    this.googleEngine = new GoogleSearchEngine(config);
    this.duckduckgoEngine = new DuckDuckGoSearchEngine(config);
    this.webScraperEngine = new WebScraperSearchEngine(config);

    logger.info('CrawlDock Search Manager initialized', {
      googleConfigured: this.googleEngine.isConfigured(),
      maxResults: config.maxResults,
      timeout: config.timeout
    });
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    const startTime = Date.now();
    
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

    const engineResults: Array<{name: string, success: boolean, error?: string, resultsCount?: number}> = [];

    for (const { name, engine, enabled } of searchEngines) {
      if (!enabled) {
        logger.debug(`Skipping ${name} - not configured`);
        engineResults.push({ name, success: false, error: 'Not configured' });
        continue;
      }

      const engineStartTime = Date.now();
      
      try {
        logger.info(`Attempting search with ${name}`, { query });
        const result = await engine.search(query, options);
        
        const engineProcessingTime = Date.now() - engineStartTime;
        
        if (result.results.length > 0) {
          // Update performance stats
          this.updatePerformanceStats(name, true, engineProcessingTime);
          
          // Log engine performance
          logger.enginePerformance(name, query, engineProcessingTime, true);
          
          logger.info(`Search successful with ${name}`, {
            query,
            resultsCount: result.results.length,
            engine: name,
            processingTime: engineProcessingTime
          });
          
          // Add total processing time to result
          result.processingTime = Date.now() - startTime;
          return result;
        } else {
          this.updatePerformanceStats(name, false, engineProcessingTime);
          logger.enginePerformance(name, query, engineProcessingTime, false);
          logger.warn(`No results from ${name}`, { query });
          engineResults.push({ name, success: false, error: 'No results returned', resultsCount: 0 });
        }
      } catch (error) {
        const engineProcessingTime = Date.now() - engineStartTime;
        this.updatePerformanceStats(name, false, engineProcessingTime);
        logger.enginePerformance(name, query, engineProcessingTime, false);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Search failed with ${name}`, {
          query,
          engine: name,
          error: errorMessage,
          processingTime: engineProcessingTime
        });
        
        engineResults.push({ name, success: false, error: errorMessage });
        
        // Continue to next engine
        continue;
      }
    }

    // If all engines failed
    const totalProcessingTime = Date.now() - startTime;
    logger.error('All search engines failed', { 
      query, 
      totalProcessingTime,
      performanceStats: this.getPerformanceStats(),
      engineResults
    });
    throw new Error(`All search engines failed to return results. Engine results: ${JSON.stringify(engineResults)}`);
  }

  private updatePerformanceStats(engineName: string, success: boolean, processingTime: number): void {
    const stats = this.performanceStats.get(engineName) || { success: 0, failure: 0, avgTime: 0 };
    
    if (success) {
      stats.success++;
    } else {
      stats.failure++;
    }
    
    // Update average processing time
    const totalRequests = stats.success + stats.failure;
    stats.avgTime = (stats.avgTime * (totalRequests - 1) + processingTime) / totalRequests;
    
    this.performanceStats.set(engineName, stats);
  }

  private getPerformanceStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    for (const [engine, data] of this.performanceStats.entries()) {
      stats[engine] = {
        success: data.success,
        failure: data.failure,
        successRate: data.success / (data.success + data.failure),
        avgProcessingTime: Math.round(data.avgTime)
      };
    }
    return stats;
  }

  getRateLimitInfo() {
    return this.rateLimiter.getRateLimitInfo();
  }

  getPerformanceInfo() {
    return {
      rateLimit: this.rateLimiter.getRateLimitInfo(),
      engineStats: this.getPerformanceStats()
    };
  }

  updateConfig(newConfig: Partial<SearchConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate engines with new config
    this.googleEngine = new GoogleSearchEngine(this.config);
    this.duckduckgoEngine = new DuckDuckGoSearchEngine(this.config);
    this.webScraperEngine = new WebScraperSearchEngine(this.config);

    logger.info('CrawlDock search configuration updated', {
      googleConfigured: this.googleEngine.isConfigured(),
      maxResults: this.config.maxResults
    });
  }
}