// Enhanced Vercel Serverless Function - Stock Quote API Proxy
// Path: /api/quote.js

// Simple in-memory cache (resets on cold starts)
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute cache

// Rate limiting (simple in-memory)
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

function isRateLimited(clientId) {
  const now = Date.now();
  const clientRequests = rateLimits.get(clientId) || [];
  
  // Remove old requests outside the window
  const recentRequests = clientRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimits.set(clientId, recentRequests);
  return false;
}

function getCacheKey(symbol, token) {
  // Use a hash of token for privacy (don't store actual tokens)
  const tokenHash = token.slice(0, 8) + '...';
  return `${symbol.toUpperCase()}_${tokenHash}`;
}

function isCacheValid(cacheEntry) {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_TTL;
}

export default async function handler(req, res) {
  // Enhanced CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours preflight cache

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
      allowedMethods: ['GET', 'OPTIONS']
    });
  }

  // Extract and validate parameters
  const { symbol, token } = req.query;
  
  // Get client identifier for rate limiting (IP + User-Agent hash)
  const clientId = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  
  // Rate limiting
  if (isRateLimited(clientId)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute allowed`,
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }

  // Input validation
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Invalid API token',
      message: 'A valid Finnhub API token is required. Get one at https://finnhub.io'
    });
  }

  if (!symbol || typeof symbol !== 'string' || symbol.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Invalid stock symbol',
      message: 'A valid stock symbol is required (e.g., AAPL, TSLA, GOOGL)'
    });
  }

  const normalizedSymbol = symbol.trim().toUpperCase();
  const trimmedToken = token.trim();
  
  // Validate symbol format (basic check)
  if (!/^[A-Z]{1,5}$/.test(normalizedSymbol)) {
    return res.status(400).json({
      error: 'Invalid symbol format',
      message: 'Symbol must be 1-5 uppercase letters (e.g., AAPL, TSLA)'
    });
  }

  try {
    // Check cache first
    const cacheKey = getCacheKey(normalizedSymbol, trimmedToken);
    const cachedData = cache.get(cacheKey);
    
    if (isCacheValid(cachedData)) {
      // Add cache headers
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${Math.floor((CACHE_TTL - (Date.now() - cachedData.timestamp)) / 1000)}`);
      return res.status(200).json(cachedData.data);
    }

    // Fetch from Finnhub API
    const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(normalizedSymbol)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(finnhubUrl, {
      method: 'GET',
      headers: {
        'X-Finnhub-Token': trimmedToken,
        'User-Agent': 'TradeCalc/2.0 (Stock Calculator)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = `Finnhub API error: ${response.status} ${response.statusText}`;
      
      if (response.status === 401) {
        errorMessage = 'Invalid API token. Please check your Finnhub API key.';
      } else if (response.status === 403) {
        errorMessage = 'API access forbidden. Check your subscription plan.';
      } else if (response.status === 429) {
        errorMessage = 'API rate limit exceeded. Please wait before making more requests.';
      } else if (response.status >= 500) {
        errorMessage = 'Finnhub service temporarily unavailable. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Enhanced data validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from Finnhub API');
    }

    // Check if we got valid price data
    if ((!data.c && !data.pc) || (data.c === 0 && data.pc === 0)) {
      return res.status(404).json({ 
        error: 'No data available',
        message: `No price data found for symbol "${normalizedSymbol}". Please check the symbol or try again later.`,
        symbol: normalizedSymbol
      });
    }

    // Validate numeric data
    const numericFields = ['c', 'h', 'l', 'o', 'pc', 'd', 'dp'];
    const sanitizedData = { ...data };
    
    numericFields.forEach(field => {
      if (sanitizedData[field] !== null && sanitizedData[field] !== undefined) {
        const num = Number(sanitizedData[field]);
        sanitizedData[field] = isFinite(num) ? num : null;
      }
    });

    // Add metadata
    const responseData = {
      ...sanitizedData,
      symbol: normalizedSymbol,
      timestamp: Date.now(),
      source: 'finnhub'
    };

    // Cache the response
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    // Set response headers
    res.setHeader('X-Cache-Status', 'MISS');
    res.setHeader('Cache-Control', `public, max-age=${Math.floor(CACHE_TTL / 1000)}`);
    
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('API Proxy Error:', {
      error: error.message,
      symbol: normalizedSymbol,
      timestamp: new Date().toISOString(),
      clientId: clientId.slice(0, 10) + '...' // Partial client ID for privacy
    });

    // Handle specific error types
    if (error.name === 'AbortError') {
      return res.status(408).json({
        error: 'Request timeout',
        message: 'The request to Finnhub API timed out. Please try again.',
        retryable: true
      });
    }

    if (error.message.includes('fetch')) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to Finnhub API. Please try again later.',
        retryable: true
      });
    }

    // Generic error response
    return res.status(500).json({ 
      error: 'Failed to fetch stock data',
      message: error.message,
      timestamp: Date.now(),
      retryable: !error.message.includes('Invalid') && !error.message.includes('forbidden')
    });
  }
}

