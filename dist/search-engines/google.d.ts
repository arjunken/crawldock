import { SearchResponse, SearchConfig, SearchOptions } from '../types.js';
export declare class GoogleSearchEngine {
    private config;
    private maxRetries;
    private retryDelay;
    constructor(config: SearchConfig);
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
    private isRetryableError;
    private sleep;
    private getDateRestrict;
    isConfigured(): boolean;
}
//# sourceMappingURL=google.d.ts.map