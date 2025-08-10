import { ref, computed } from 'vue';
import { apiService } from '../utils/api.js';
import { clamp } from '../utils/formatters.js';

export function useStockData() {
  const isConnected = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const source = ref('demo');
  const symbol = ref('AAPL');
  const apiKey = ref('');
  
  const currentPrice = ref(NaN);
  const previousClose = ref(NaN);
  const priceHistory = ref([]);
  
  let pollingTimer = null;
  const pollingInterval = 3000;

  const priceChange = computed(() => {
    const current = currentPrice.value;
    const previous = previousClose.value;
    
    if (!isFinite(current)) {
      return { amount: 0, percent: 0 };
    }
    
    // If we don't have a valid previousClose, return zero change
    if (!isFinite(previous) || previous <= 0) {
      return { amount: 0, percent: 0 };
    }
    
    const amount = current - previous;
    const percent = (amount / previous) * 100;
    
    // Ensure both values are finite numbers
    return { 
      amount: isFinite(amount) ? amount : 0, 
      percent: isFinite(percent) ? percent : 0 
    };
  });

  const lastUpdated = ref(new Date());

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  function addPricePoint(price) {
    if (!isFinite(price) || price <= 0) {
      console.warn('Invalid price value:', price);
      return;
    }
    
    const timestamp = new Date();
    
    // Use a more defensive approach for array updates
    const newPoint = { time: timestamp, price };
    const newHistory = [...priceHistory.value, newPoint];
    
    // Keep only last 300 points
    if (newHistory.length > 300) {
      newHistory.shift();
    }
    
    // Update all values in a batch to minimize reactivity triggers
    priceHistory.value = newHistory;
    currentPrice.value = price;
    lastUpdated.value = timestamp;
  }

  function startDemo(basePrice = 150) {
    stopPolling();
    source.value = 'demo';
    isConnected.value = true;
    error.value = null;
    
    let price = basePrice;
    let drift = 0;
    
    // Initialize - for demo mode, set previous close to simulate market data
    // Use a slight variation from base price to simulate realistic market movement
    previousClose.value = basePrice * (1 + (Math.random() - 0.5) * 0.02); // ±1% variation
    addPricePoint(price);
    
    pollingTimer = setInterval(() => {
      const volatility = 0.15; // per tick volatility
      drift = clamp(drift + (Math.random() - 0.5) * 0.02, -0.2, 0.2);
      price = Math.max(0.01, price * (1 + drift * 0.001 + (Math.random() - 0.5) * volatility * 0.01));
      addPricePoint(price);
    }, pollingInterval);
  }

  async function startLiveData() {
    if (!apiKey.value.trim()) {
      error.value = 'API key required for live data';
      return;
    }

    stopPolling();
    source.value = 'finnhub';
    isLoading.value = true;
    error.value = null;
    clearHistory(); // Clear previous chart data

    const fetchQuote = async () => {
      try {
        const quote = await apiService.fetchQuote(symbol.value, apiKey.value);
        
        // Always update previous close from API data (this is the market's previous close, not our purchase price)
        previousClose.value = quote.previousClose;
        
        addPricePoint(quote.current);
        isConnected.value = true;
        error.value = null;
      } catch (err) {
        error.value = err.message;
        isConnected.value = false;
        console.error('Quote fetch error:', err);
      }
    };

    // Initial fetch
    await fetchQuote();
    isLoading.value = false;

    // Start polling
    if (!error.value) {
      pollingTimer = setInterval(fetchQuote, pollingInterval);
    }
  }

  function disconnect() {
    stopPolling();
    isConnected.value = false;
    source.value = 'demo';
    error.value = null;
  }

  function clearHistory() {
    priceHistory.value = [];
  }

  return {
    // State
    isConnected,
    isLoading,
    error,
    source,
    symbol,
    apiKey,
    currentPrice,
    previousClose,
    priceHistory,
    priceChange,
    lastUpdated,
    
    // Actions
    startDemo,
    startLiveData,
    disconnect,
    clearHistory,
    addPricePoint
  };
}
