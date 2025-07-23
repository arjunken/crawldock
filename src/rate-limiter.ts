import logger from './logger.js';
import { RateLimitInfo } from './types.js';

export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 500, windowMs: number = 24 * 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    logger.info('CrowlDock Rate Limiter initialized', {
      maxRequests,
      windowHours: windowMs / (60 * 60 * 1000)
    });
  }

  canMakeRequest(): boolean {
    this.cleanOldRequests();
    const canMake = this.requests.length < this.maxRequests;
    
    logger.debug('Rate limit check', {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      canMakeRequest: canMake
    });
    
    return canMake;
  }

  recordRequest(): void {
    this.cleanOldRequests();
    this.requests.push(Date.now());
    
    logger.debug('Request recorded', {
      totalRequests: this.requests.length,
      remaining: this.maxRequests - this.requests.length
    });
  }

  getRateLimitInfo(): RateLimitInfo {
    this.cleanOldRequests();
    const now = Date.now();
    const oldestRequest = this.requests.length > 0 ? Math.min(...this.requests) : now;
    const resetTime = oldestRequest + this.windowMs;
    
    return {
      remaining: Math.max(0, this.maxRequests - this.requests.length),
      resetTime,
      total: this.maxRequests
    };
  }

  private cleanOldRequests(): void {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    const initialLength = this.requests.length;
    
    this.requests = this.requests.filter(timestamp => timestamp > cutoff);
    
    if (this.requests.length !== initialLength) {
      logger.debug('Cleaned old requests', {
        removed: initialLength - this.requests.length,
        remaining: this.requests.length
      });
    }
  }
}