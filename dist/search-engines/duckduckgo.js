import axios from 'axios';
import logger from '../logger.js';
export class DuckDuckGoSearchEngine {
    config;
    constructor(config) {
        this.config = config;
        logger.info('CrowlDock DuckDuckGo Search Engine initialized');
    }
    async search(query, options = {}) {
        const startTime = Date.now();
        try {
            logger.info('Starting DuckDuckGo search', { query, options });
            // DuckDuckGo Instant Answer API
            const params = {
                q: query,
                format: 'json',
                no_html: '1',
                skip_disambig: '1',
                no_redirect: '1',
                safe_search: options.safeSearch ? 'strict' : 'moderate'
            };
            logger.debug('DuckDuckGo API request params', { params });
            const response = await axios.get('https://api.duckduckgo.com/', {
                params,
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': this.config.userAgent
                }
            });
            logger.debug('DuckDuckGo API response received', {
                status: response.status,
                dataKeys: Object.keys(response.data || {}),
                hasAbstract: !!response.data?.Abstract,
                hasRelatedTopics: !!response.data?.RelatedTopics
            });
            const results = [];
            const data = response.data;
            // Add abstract if available
            if (data.Abstract) {
                results.push({
                    title: data.Heading || query,
                    url: data.AbstractURL || '',
                    snippet: data.Abstract,
                    source: 'DuckDuckGo',
                    metadata: {
                        domain: data.AbstractSource || 'DuckDuckGo',
                        favicon: data.Image
                    }
                });
            }
            // Add related topics
            if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
                for (const topic of data.RelatedTopics.slice(0, options.maxResults || this.config.maxResults)) {
                    if (topic.Text && topic.FirstURL) {
                        results.push({
                            title: topic.Text.split(' - ')[0] || topic.Text,
                            url: topic.FirstURL,
                            snippet: topic.Text,
                            source: 'DuckDuckGo',
                            metadata: {
                                domain: new URL(topic.FirstURL).hostname,
                                favicon: topic.Icon?.URL
                            }
                        });
                    }
                }
            }
            logger.debug('DuckDuckGo results before HTML fallback', {
                resultsCount: results.length,
                hasAbstract: !!data.Abstract,
                relatedTopicsCount: data.RelatedTopics?.length || 0
            });
            // If no results from instant answers, try the HTML search
            if (results.length === 0) {
                logger.info('No instant answers found, trying HTML search');
                return await this.htmlSearch(query, options, startTime);
            }
            const processingTime = Date.now() - startTime;
            logger.info('DuckDuckGo search completed', {
                query,
                resultsCount: results.length,
                processingTime
            });
            return {
                query,
                results: results.slice(0, options.maxResults || this.config.maxResults),
                searchEngine: 'duckduckgo',
                timestamp: new Date().toISOString(),
                processingTime
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            logger.error('DuckDuckGo search failed', {
                query,
                error: error instanceof Error ? error.message : 'Unknown error',
                processingTime,
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
    async htmlSearch(query, options, startTime) {
        try {
            // Use DuckDuckGo's lite version for easier parsing
            const searchUrl = `https://lite.duckduckgo.com/lite/`;
            const response = await axios.post(searchUrl, new URLSearchParams({
                q: query,
                s: '0', // Start from first result
                dc: (options.maxResults || this.config.maxResults).toString()
            }), {
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': this.config.userAgent,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            // Parse the simple HTML response
            const results = [];
            const html = response.data;
            // Simple regex parsing for lite version
            const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
            const snippetRegex = /<td[^>]*class="result-snippet"[^>]*>([^<]+)<\/td>/g;
            let match;
            let snippetMatch;
            const links = [];
            const snippets = [];
            while ((match = linkRegex.exec(html)) !== null) {
                if (match[1].startsWith('http') && !match[1].includes('duckduckgo.com')) {
                    links.push({ url: match[1], title: match[2] });
                }
            }
            while ((snippetMatch = snippetRegex.exec(html)) !== null) {
                snippets.push(snippetMatch[1]);
            }
            // Combine links and snippets
            for (let i = 0; i < Math.min(links.length, snippets.length, options.maxResults || this.config.maxResults); i++) {
                results.push({
                    title: links[i].title,
                    url: links[i].url,
                    snippet: snippets[i] || '',
                    source: 'DuckDuckGo HTML',
                    metadata: {
                        domain: new URL(links[i].url).hostname
                    }
                });
            }
            const processingTime = Date.now() - startTime;
            return {
                query,
                results,
                searchEngine: 'duckduckgo',
                timestamp: new Date().toISOString(),
                processingTime
            };
        }
        catch (error) {
            logger.error('DuckDuckGo HTML search failed', {
                query,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
}
//# sourceMappingURL=duckduckgo.js.map