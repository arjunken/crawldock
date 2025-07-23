import axios from 'axios';
import logger from '../logger.js';
import { SearchResult, SearchResponse, SearchConfig, SearchOptions } from '../types.js';

export class GoogleSearchEngine {
  private config: SearchConfig;

  constructor(config: SearchConfig) {
    this.config = config;
    logger.info('Google Search Engine initialized', {
      hasApiKey: !!config.googleApiKey,
      hasSearchEngineId: !!config.googleSearchEngineId
    });
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    const startTime = Date.now();
    
    if (!this.config.googleApiKey || !this.config.googleSearchEngineId) {
      logger.warn('Google API credentials not provided');
      throw new Error('Google API credentials not configured');
    }

    try {
      logger.info('Starting Google search', { query, options });

      const params = {
        key: this.config.googleApiKey,
        cx: this.config.googleSearchEngineId,
        q: query,
        num: Math.min(options.maxResults || this.config.maxResults, 10),
        safe: options.safeSearch ? 'active' : 'off',
        ...(options.language && { lr: `lang_${options.language}` }),
        ...(options.region && { gl: options.region }),
        ...(options.timeRange && { dateRestrict: this.getDateRestrict(options.timeRange) })
      };

      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params,
        timeout: this.config.timeout,
        headers: {
          'User-Agent': this.config.userAgent
        }
      });

      const results: SearchResult[] = (response.data.items || []).map((item: any) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        displayUrl: item.displayLink,
        source: 'Google Custom Search',
        metadata: {
          domain: new URL(item.link).hostname,
          favicon: item.pagemap?.cse_image?.[0]?.src
        }
      }));

      const processingTime = Date.now() - startTime;
      
      logger.info('Google search completed', {
        query,
        resultsCount: results.length,
        totalResults: response.data.searchInformation?.totalResults,
        processingTime
      });

      return {
        query,
        results,
        totalResults: parseInt(response.data.searchInformation?.totalResults || '0'),
        searchEngine: 'google',
        timestamp: new Date().toISOString(),
        processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      logger.error('Google search failed', {
        query,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime
      });
      throw error;
    }
  }

  private getDateRestrict(timeRange: string): string {
    switch (timeRange) {
      case 'day': return 'd1';
      case 'week': return 'w1';
      case 'month': return 'm1';
      case 'year': return 'y1';
      default: return '';
    }
  }

  isConfigured(): boolean {
    return !!(this.config.googleApiKey && this.config.googleSearchEngineId);
  }
}