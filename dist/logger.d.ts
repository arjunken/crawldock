import winston from 'winston';
declare const logger: {
    error: winston.LeveledLogMethod;
    warn: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;
    debug: winston.LeveledLogMethod;
    llmRequest: (query: string, options?: any) => void;
    llmResponse: (query: string, results: any[], processingTime: number, engine: string) => void;
    llmRateLimit: (remaining: number, resetTime: number) => void;
    enginePerformance: (engine: string, query: string, processingTime: number, success: boolean) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map