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
}