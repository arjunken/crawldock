#!/usr/bin/env node
import dotenv from 'dotenv';
import { MCPServer } from './mcp-server.js';
import logger from './logger.js';
// Load environment variables
dotenv.config();
async function main() {
    try {
        logger.info('Starting CrowlDock MCP Server');
        const config = {
            googleApiKey: process.env.GOOGLE_API_KEY,
            googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
            maxResults: parseInt(process.env.MAX_RESULTS || '10'),
            timeout: parseInt(process.env.SEARCH_TIMEOUT || '10000'),
            userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (compatible; CrowlDock/1.0)'
        };
        logger.info('Configuration loaded', {
            hasGoogleApiKey: !!config.googleApiKey,
            hasGoogleSearchEngineId: !!config.googleSearchEngineId,
            maxResults: config.maxResults,
            timeout: config.timeout
        });
        const server = new MCPServer(config);
        await server.start();
        // Handle graceful shutdown
        const gracefulShutdown = (signal) => {
            logger.info(`Received ${signal}, shutting down gracefully`);
            // Give the server time to finish any ongoing operations
            setTimeout(() => {
                logger.info('Server shutdown complete');
                process.exit(0);
            }, 1000);
        };
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught exception', {
                error: error.message,
                stack: error.stack
            });
            process.exit(1);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled promise rejection', {
                reason: reason instanceof Error ? reason.message : String(reason),
                promise: promise
            });
            process.exit(1);
        });
    }
    catch (error) {
        logger.error('Failed to start server', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        process.exit(1);
    }
}
main().catch((error) => {
    logger.error('Unhandled error in main', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
});
//# sourceMappingURL=index.js.map