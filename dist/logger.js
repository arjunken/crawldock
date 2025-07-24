import winston from 'winston';
import { randomUUID } from 'crypto';
// Create a correlation ID for request tracking
const createCorrelationId = () => randomUUID().slice(0, 8);
const baseLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
    defaultMeta: {
        service: 'crowldock',
        correlationId: createCorrelationId()
    },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});
// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
    mkdirSync('logs', { recursive: true });
}
catch (error) {
    // Directory already exists or permission error
}
// Enhanced logger with LLM-specific methods
const logger = {
    // Winston logger methods
    error: baseLogger.error.bind(baseLogger),
    warn: baseLogger.warn.bind(baseLogger),
    info: baseLogger.info.bind(baseLogger),
    debug: baseLogger.debug.bind(baseLogger),
    // Log LLM request with structured data
    llmRequest: (query, options) => {
        baseLogger.info('LLM Search Request', {
            query,
            options,
            requestType: 'llm_search',
            timestamp: new Date().toISOString()
        });
    },
    // Log LLM response with result summary
    llmResponse: (query, results, processingTime, engine) => {
        baseLogger.info('LLM Search Response', {
            query,
            resultsCount: results.length,
            processingTime,
            engine,
            responseType: 'llm_search_result',
            timestamp: new Date().toISOString()
        });
    },
    // Log rate limit events for LLM context
    llmRateLimit: (remaining, resetTime) => {
        baseLogger.warn('LLM Rate Limit Warning', {
            remaining,
            resetTime: new Date(resetTime).toISOString(),
            eventType: 'llm_rate_limit'
        });
    },
    // Log search engine performance for LLM optimization
    enginePerformance: (engine, query, processingTime, success) => {
        baseLogger.info('Search Engine Performance', {
            engine,
            query: query.substring(0, 100), // Truncate for performance logging
            processingTime,
            success,
            eventType: 'engine_performance'
        });
    }
};
export default logger;
//# sourceMappingURL=logger.js.map