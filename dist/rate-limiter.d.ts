import { RateLimitInfo } from './types.js';
export declare class RateLimiter {
    private requests;
    private readonly maxRequests;
    private readonly windowMs;
    constructor(maxRequests?: number, windowMs?: number);
    canMakeRequest(): boolean;
    recordRequest(): void;
    getRateLimitInfo(): RateLimitInfo;
    private cleanOldRequests;
}
//# sourceMappingURL=rate-limiter.d.ts.map