import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../logger.js';
export class WebScraperSearchEngine {
    config;
    constructor(config) {
        this.config = config;
        logger.info('CrawlDock Web Scraper Search Engine initialized');
    }
    async search(query, options = {}) {
        const startTime = Date.now();
        try {
            logger.info('Starting web scraper search', { query, options });
            // Use multiple search engines for scraping
            const searchEngines = [
                { name: 'Startpage', url: 'https://www.startpage.com/sp/search', param: 'query' },
                { name: 'Searx', url: 'https://searx.be/search', param: 'q' }
            ];
            let allResults = [];
            for (const engine of searchEngines) {
                try {
                    const results = await this.scrapeSearchEngine(engine, query, options);
                    allResults = allResults.concat(results);
                    if (allResults.length >= (options.maxResults || this.config.maxResults)) {
                        break;
                    }
                }
                catch (error) {
                    logger.warn(`Failed to scrape ${engine.name}`, {
                        engine: engine.name,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                    continue;
                }
            }
            // Remove duplicates and limit results
            const uniqueResults = this.removeDuplicates(allResults);
            const limitedResults = uniqueResults.slice(0, options.maxResults || this.config.maxResults);
            const processingTime = Date.now() - startTime;
            logger.info('Web scraper search completed', {
                query,
                resultsCount: limitedResults.length,
                processingTime
            });
            return {
                query,
                results: limitedResults,
                searchEngine: 'scraping',
                timestamp: new Date().toISOString(),
                processingTime
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            logger.error('Web scraper search failed', {
                query,
                error: error instanceof Error ? error.message : 'Unknown error',
                processingTime
            });
            throw error;
        }
    }
    async scrapeSearchEngine(engine, query, options) {
        try {
            const params = new URLSearchParams();
            params.set(engine.param, query);
            if (engine.name === 'Startpage') {
                params.set('cat', 'web');
                params.set('pl', 'opensearch');
            }
            const response = await axios.get(`${engine.url}?${params.toString()}`, {
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': this.config.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive'
                }
            });
            const $ = cheerio.load(response.data);
            const results = [];
            if (engine.name === 'Startpage') {
                $('.w-gl__result').each((_, element) => {
                    const $el = $(element);
                    const titleEl = $el.find('.w-gl__result-title a');
                    const snippetEl = $el.find('.w-gl__description');
                    const urlEl = $el.find('.w-gl__result-url');
                    const title = titleEl.text().trim();
                    const url = titleEl.attr('href');
                    const snippet = snippetEl.text().trim();
                    const displayUrl = urlEl.text().trim();
                    if (title && url && snippet) {
                        results.push({
                            title,
                            url,
                            snippet,
                            displayUrl,
                            source: 'Startpage',
                            metadata: {
                                domain: new URL(url).hostname
                            }
                        });
                    }
                });
            }
            else if (engine.name === 'Searx') {
                $('.result').each((_, element) => {
                    const $el = $(element);
                    const titleEl = $el.find('.result_header a');
                    const snippetEl = $el.find('.result-content');
                    const title = titleEl.text().trim();
                    const url = titleEl.attr('href');
                    const snippet = snippetEl.text().trim();
                    if (title && url && snippet) {
                        results.push({
                            title,
                            url,
                            snippet,
                            source: 'Searx',
                            metadata: {
                                domain: new URL(url).hostname
                            }
                        });
                    }
                });
            }
            logger.debug(`Scraped ${results.length} results from ${engine.name}`);
            return results;
        }
        catch (error) {
            logger.error(`Failed to scrape ${engine.name}`, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return [];
        }
    }
    removeDuplicates(results) {
        const seen = new Set();
        return results.filter(result => {
            const key = `${result.url}-${result.title}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}
//# sourceMappingURL=web-scraper.js.map