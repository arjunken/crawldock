import { SearchConfig } from './types.js';
export declare class MCPServer {
    private server;
    private searchManager;
    constructor(config: SearchConfig);
    private setupHandlers;
    start(): Promise<void>;
}
//# sourceMappingURL=mcp-server.d.ts.map