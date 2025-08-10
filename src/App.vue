<template>
  <div class="app">
    <div class="header">
      <div class="title">TradeCalc — Professional Stock Calculator</div>
      <div class="controls">
      </div>
    </div>

    <!-- Full Application -->
    <div v-if="showFullApp">
      <div v-if="appError" style="color: #ef4444; background: rgba(239,68,68,0.1); padding: 15px; border-radius: 8px; margin: 10px 0;">
        <strong>Application Error:</strong> {{ appError }}
        <button @click="retryLoad" style="margin-left: 10px; padding: 5px 10px; background: #059669; color: white; border: none; border-radius: 3px;">
          Retry
        </button>
      </div>
      
      <div v-else-if="appLoading" style="color: white; text-align: center; padding: 40px;">
        <div style="font-size: 24px; margin-bottom: 20px;">⏳</div>
        <p>Loading TradeCalc Application...</p>
      </div>
      
      <div v-else-if="stockData && calculator" class="grid">
        <InputPanel 
          v-if="stockData && calculator"
          :stock-data="stockData"
          :calculator="calculator"
          :current-metrics="currentMetrics"
          @connect="handleConnect"
        />
        
        <LivePanel 
          v-if="stockData && calculator && currentMetrics"
          :stock-data="stockData"
          :current-metrics="currentMetrics"
        />
      </div>
      
      <div v-else style="color: white; text-align: center; padding: 40px;">
        <p>⚠️ Components not initialized</p>
        <p>stockData: {{ !!stockData }}, calculator: {{ !!calculator }}</p>
        <button @click="retryLoad" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 5px;">
          Try Again
        </button>
      </div>
    </div>
    <div v-else style="color: white; text-align: center; padding: 40px;">
        <div style="font-size: 24px; margin-bottom: 20px;">⏳</div>
        <p>Loading TradeCalc Application...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import InputPanel from './components/InputPanel.vue';
import LivePanel from './components/LivePanel.vue';
import { useStockData } from './composables/useStockData.js';
import { useTradeCalculator } from './composables/useTradeCalculator.js';

// UI state
const showFullApp = ref(false);
const appLoading = ref(true);
const appError = ref(null);

// App data
const stockData = ref(null);
const calculator = ref(null);

onMounted(() => {
  loadFullApp();
});

async function loadFullApp() {
  appLoading.value = true;
  appError.value = null;
  
  try {
    // Initialize composables
    stockData.value = useStockData();
    calculator.value = useTradeCalculator();
    
    // Load saved values
    calculator.value.loadSavedValues();
    
    // Load saved stock data settings BEFORE setting up watchers
    const savedSymbol = localStorage.getItem('tc_symbol');
    const savedSource = localStorage.getItem('tc_source');
    const savedApiKey = localStorage.getItem('tc_apiKey');
    
    if (savedSymbol) stockData.value.symbol.value = savedSymbol;
    if (savedSource) stockData.value.source.value = savedSource;
    if (savedApiKey) stockData.value.apiKey.value = savedApiKey;
    
    // Set up watchers for saving changes
    watch([() => stockData.value.symbol.value, () => stockData.value.source.value, () => stockData.value.apiKey.value], () => {
      localStorage.setItem('tc_symbol', stockData.value.symbol.value);
      localStorage.setItem('tc_source', stockData.value.source.value);
      localStorage.setItem('tc_apiKey', stockData.value.apiKey.value);
    });
    
    // Small delay for UX and to ensure everything is initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Start demo mode after everything is set up
    stockData.value.startDemo(calculator.value.purchasePrice.value);
    
    showFullApp.value = true;
  } catch (error) {
    console.error('Failed to load application:', error);
    appError.value = error.message || 'Unknown error occurred';
  } finally {
    appLoading.value = false;
  }
}

function retryLoad() {
  appError.value = null;
  loadFullApp();
}

// Compute current metrics with live price
const currentMetrics = computed(() => {
  if (calculator.value && stockData.value) {
    return calculator.value.updateCurrentPrice(stockData.value.currentPrice.value);
  }
  return {};
});

function handleConnect() {
  if (stockData.value && calculator.value) {
    stockData.value.clearHistory();
    
    if (stockData.value.source.value === 'demo') {
      // For demo mode, start from the purchase price as the baseline
      stockData.value.startDemo(calculator.value.purchasePrice.value);
    } else {
      stockData.value.startLiveData();
    }
  }
}
</script>
