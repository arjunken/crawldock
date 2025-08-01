export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
  publishedDate?: string;
  source?: string;
  metadata?: {
    domain: string;
    favicon?: string;
    language?: string;
  };
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults?: number;
  searchEngine: 'google' | 'duckduckgo' | 'scraping';
  timestamp: string;
  processingTime: number;
}

// New types for LLM-optimized responses
export interface LLMOptimizedResult {
  title: string;
  url: string;
  summary: string; // More concise than snippet
  relevance: number; // 0-1 score for relevance
  source: string;
  domain: string;
}

export interface LLMOptimizedResponse {
  query: string;
  results: LLMOptimizedResult[];
  summary: string; // Brief overview of all results
  searchEngine: string;
  processingTime: number;
  confidence: number; // Overall confidence in results
}

export interface SearchConfig {
  googleApiKey?: string;
  googleSearchEngineId?: string;
  maxResults: number;
  timeout: number;
  userAgent: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  total: number;
}

export interface SearchOptions {
  maxResults?: number;
  language?: string;
  region?: string;
  safeSearch?: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  // New options for LLM optimization
  formatForLLM?: boolean;
  includeSummary?: boolean;
  relevanceThreshold?: number;
}