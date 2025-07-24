import { SearchResponse, SearchConfig, SearchOptions } from './types.js';
export declare class SearchManager {
    private rateLimiter;
    private googleEngine;
    private duckduckgoEngine;
    private webScraperEngine;
    private config;
    private performanceStats;
    constructor(config: SearchConfig);
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
    private updatePerformanceStats;
    private getPerformanceStats;
    getRateLimitInfo(): import("./types.js").RateLimitInfo;
    getPerformanceInfo(): {
        rateLimit: import("./types.js").RateLimitInfo;
        engineStats: Record<string, any>;
    };
    updateConfig(newConfig: Partial<SearchConfig>): void;
}
//# sourceMappingURL=search-manager.d.ts.map