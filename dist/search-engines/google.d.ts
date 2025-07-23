import { SearchResponse, SearchConfig, SearchOptions } from '../types.js';
export declare class GoogleSearchEngine {
    private config;
    constructor(config: SearchConfig);
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
    private getDateRestrict;
    isConfigured(): boolean;
}
//# sourceMappingURL=google.d.ts.map