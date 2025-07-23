import winston from 'winston';
import { randomUUID } from 'crypto';

// Create a correlation ID for request tracking
const createCorrelationId = () => randomUUID().slice(0, 8);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
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
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory already exists or permission error
}

// Enhanced logger with LLM-specific methods
const enhancedLogger = {
  ...logger,
  
  // Log LLM request with structured data
  llmRequest: (query: string, options?: any) => {
    logger.info('LLM Search Request', {
      query,
      options,
      requestType: 'llm_search',
      timestamp: new Date().toISOString()
    });
  },

  // Log LLM response with result summary
  llmResponse: (query: string, results: any[], processingTime: number, engine: string) => {
    logger.info('LLM Search Response', {
      query,
      resultsCount: results.length,
      processingTime,
      engine,
      responseType: 'llm_search_result',
      timestamp: new Date().toISOString()
    });
  },

  // Log rate limit events for LLM context
  llmRateLimit: (remaining: number, resetTime: number) => {
    logger.warn('LLM Rate Limit Warning', {
      remaining,
      resetTime: new Date(resetTime).toISOString(),
      eventType: 'llm_rate_limit'
    });
  },

  // Log search engine performance for LLM optimization
  enginePerformance: (engine: string, query: string, processingTime: number, success: boolean) => {
    logger.info('Search Engine Performance', {
      engine,
      query: query.substring(0, 100), // Truncate for performance logging
      processingTime,
      success,
      eventType: 'engine_performance'
    });
  }
};

export default enhancedLogger;