/**
 * API service for stock data
 */
export class ApiService {
  constructor() {
    this.baseUrl = '/api';
  }

  /**
   * Fetch stock quote from API
   * @param {string} symbol - Stock symbol
   * @param {string} token - API token
   * @returns {Promise<Object>} Quote data
   */
  async fetchQuote(symbol, token) {
    try {
      const url = `${this.baseUrl}/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(token)}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.c && !data.pc) {
        throw new Error('Invalid symbol or API response');
      }

      return {
        current: Number(data.c || data.pc),
        previousClose: Number(data.pc) || Number(data.c || data.pc),
        change: Number(data.d || 0),
        changePercent: Number(data.dp || 0),
        high: Number(data.h || 0),
        low: Number(data.l || 0),
        open: Number(data.o || 0),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
