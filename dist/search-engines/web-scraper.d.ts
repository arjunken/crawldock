import { SearchResponse, SearchConfig, SearchOptions } from '../types.js';
export declare class WebScraperSearchEngine {
    private config;
    constructor(config: SearchConfig);
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
    private scrapeSearchEngine;
    private removeDuplicates;
}
//# sourceMappingURL=web-scraper.d.ts.map