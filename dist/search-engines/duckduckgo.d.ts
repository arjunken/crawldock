import { SearchResponse, SearchConfig, SearchOptions } from '../types.js';
export declare class DuckDuckGoSearchEngine {
    private config;
    constructor(config: SearchConfig);
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
    private htmlSearch;
}
//# sourceMappingURL=duckduckgo.d.ts.map