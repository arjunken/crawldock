import axios from 'axios';
import logger from '../logger.js';
export class GoogleSearchEngine {
    config;
    maxRetries = 3;
    retryDelay = 1000; // 1 second
    constructor(config) {
        this.config = config;
        logger.info('CrowlDock Google Search Engine initialized', {
            hasApiKey: !!config.googleApiKey,
            hasSearchEngineId: !!config.googleSearchEngineId
        });
    }
    async search(query, options = {}) {
        const startTime = Date.now();
        if (!this.config.googleApiKey || !this.config.googleSearchEngineId) {
            logger.warn('Google API credentials not provided');
            throw new Error('Google API credentials not configured');
        }
        let lastError = null;
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                logger.info(`Starting Google search (attempt ${attempt}/${this.maxRetries})`, { query, options });
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
                const results = (response.data.items || []).map((item) => ({
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
                    processingTime,
                    attempt
                });
                return {
                    query,
                    results,
                    totalResults: parseInt(response.data.searchInformation?.totalResults || '0'),
                    searchEngine: 'google',
                    timestamp: new Date().toISOString(),
                    processingTime
                };
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                // Check if it's a retryable error
                const isRetryable = this.isRetryableError(lastError);
                logger.error(`Google search failed (attempt ${attempt}/${this.maxRetries})`, {
                    query,
                    error: lastError.message,
                    processingTime: Date.now() - startTime,
                    isRetryable,
                    attempt
                });
                if (attempt < this.maxRetries && isRetryable) {
                    const delay = this.retryDelay * attempt; // Exponential backoff
                    logger.info(`Retrying Google search in ${delay}ms`, { attempt });
                    await this.sleep(delay);
                }
                else {
                    break;
                }
            }
        }
        const processingTime = Date.now() - startTime;
        logger.error('Google search failed after all retries', {
            query,
            error: lastError?.message || 'Unknown error',
            processingTime
        });
        throw lastError || new Error('Google search failed');
    }
    isRetryableError(error) {
        const retryableErrors = [
            'ECONNRESET',
            'ETIMEDOUT',
            'ENOTFOUND',
            'ECONNREFUSED',
            'timeout',
            'network',
            '429', // Rate limit
            '500', // Server error
            '502', // Bad gateway
            '503', // Service unavailable
            '504' // Gateway timeout
        ];
        const errorMessage = error.message.toLowerCase();
        return retryableErrors.some(retryableError => errorMessage.includes(retryableError.toLowerCase()));
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getDateRestrict(timeRange) {
        switch (timeRange) {
            case 'day': return 'd1';
            case 'week': return 'w1';
            case 'month': return 'm1';
            case 'year': return 'y1';
            default: return '';
        }
    }
    isConfigured() {
        return !!(this.config.googleApiKey && this.config.googleSearchEngineId);
    }
}
//# sourceMappingURL=google.js.map