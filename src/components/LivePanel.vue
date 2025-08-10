<template>
  <div class="card right-col">
    <h3>Live Price</h3>
    
    <!-- Price Display -->
    <div class="row">
      <div class="field lg">
        <div style="display:flex;align-items:baseline;gap:12px">
          <div class="price">{{ fmt(stockData?.currentPrice || 0) }}</div>
          <div class="pill" :class="priceChangeClass">
            {{ formatPriceChange() }}
          </div>
        </div>
        <div class="sub">
          Symbol: {{ stockData?.symbol || 'N/A' }} • 
          Source: {{ stockData?.source === 'demo' ? 'Demo' : 'Finnhub' }} • 
          Updated: {{ stockData?.lastUpdated?.toLocaleTimeString() || 'Never' }}
        </div>
        <div v-if="stockData?.error" class="sub" style="color: var(--danger); margin-top: 4px;">
          Error: {{ stockData.error }}
        </div>
      </div>
    </div>

    <!-- Chart -->
    <canvas ref="chartCanvas" id="priceChart" style="height: 200px;"></canvas>

    <div class="divider"></div>

    <!-- Metrics -->
    <div class="row">
      <div class="field sm">
        <label>Return On Investment</label>
        <div class="kpi">
          <div class="name">ROI (%)</div>
          <div class="value">{{ pct(currentMetrics?.roi || 0) }}</div>
        </div>
      </div>
      <div class="field sm">
        <label>Profit & Loss</label>
        <div class="kpi">
          <div class="name">Unrealized P/L</div>
          <div class="value" :style="{ color: getPLColor(currentMetrics?.pl || 0) }">
            {{ fmt(currentMetrics?.pl || 0) }}
          </div>
        </div>
      </div>
      <div class="field sm">
        <label>Stop / Take Profit Prices</label>
        <div class="kpi">
          <div class="name">Stop • Take Profit</div>
          <div class="value">{{ fmt(currentMetrics?.stopPrice || 0) }} • {{ fmt(currentMetrics?.tpPrice || 0) }}</div>
        </div>
      </div>
      <div class="field sm">
        <label>Potential P/L at Stop / TP</label>
        <div class="kpi">
          <div class="name">Stop P/L • TP P/L</div>
          <div class="value">
            <span :style="{ color: getPLColor(currentMetrics?.plStop || 0) }">{{ fmt(currentMetrics?.plStop || 0) }}</span> • 
            <span :style="{ color: getPLColor(currentMetrics?.plTP || 0) }">{{ fmt(currentMetrics?.plTP || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div v-if="stockData?.isConnected" style="color: var(--accent); margin-bottom: 8px;">
        ✅ Connected and receiving data
      </div>
      <div v-else-if="stockData?.isLoading" style="color: var(--warn); margin-bottom: 8px;">
        🔄 Connecting to data source...
      </div>
      <div v-else style="color: var(--sub); margin-bottom: 8px;">
        ⚠️ Not connected - using demo mode
      </div>
      This tool is educational and front‑end only. Real‑time quotes require your own key. 
      Calculations ignore taxes. Double‑check before trading.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { fmt, pct } from '../utils/formatters.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  stockData: Object,
  currentMetrics: Object
});

const chartCanvas = ref(null);
const chart = ref(null);

const priceChangeClass = computed(() => {
  const change = props.stockData?.priceChange;
  if (!change || typeof change.amount !== 'number') return 'ok';
  return change.amount >= 0 ? 'ok' : 'bad';
});

function formatPriceChange() {
  const change = props.stockData?.priceChange;
  if (!change || typeof change.amount !== 'number' || typeof change.percent !== 'number') {
    return '+0.00 (0.00%)';
  }
  const sign = change.amount >= 0 ? '+' : '';
  return `${sign}${change.amount.toFixed(2)} (${sign}${change.percent.toFixed(2)}%)`;
}

function getPLColor(value) {
  if (!isFinite(value)) return 'var(--text)';
  return value >= 0 ? 'var(--ok)' : 'var(--danger)';
}

function initChart() {
  if (!chartCanvas.value) {
    console.warn('Canvas not available for chart initialization');
    return;
  }

  // Destroy existing chart
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }

  try {
    const ctx = chartCanvas.value.getContext('2d');
    
    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Price',
          data: [],
          fill: false,
          tension: 0.25,
          borderColor: '#6ee7b7',
          backgroundColor: '#6ee7b7',
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            ticks: {
              callback: (value) => '$' + value,
              color: '#a6adbb'
            },
            grid: {
              color: '#222b3d'
            }
          }
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Chart initialization error:', error);
  }
}

function addDataPoint(timestamp, price) {
  if (!chart.value || !chart.value.data) {
    return;
  }

  try {
    chart.value.data.labels.push(timestamp.toLocaleTimeString());
    chart.value.data.datasets[0].data.push(price);

    // Keep only last 300 points
    if (chart.value.data.labels.length > 300) {
      chart.value.data.labels.shift();
      chart.value.data.datasets[0].data.shift();
    }

    chart.value.update('none');
  } catch (error) {
    console.warn('Chart update error:', error);
  }
}

function clearChart() {
  if (!chart.value || !chart.value.data) {
    return;
  }

  try {
    chart.value.data.labels = [];
    chart.value.data.datasets[0].data = [];
    chart.value.update('none');
  } catch (error) {
    console.warn('Chart clear error:', error);
  }
}

// Watch for price updates and update chart
watch(() => props.stockData?.priceHistory, (history) => {
  if (history && history.length > 0) {
    const latest = history[history.length - 1];
    addDataPoint(latest.time, latest.price);
  }
}, { deep: true, flush: 'post' });

// Watch for symbol changes to clear chart
watch(() => props.stockData?.symbol, () => {
  clearChart();
}, { flush: 'post' });

onMounted(async () => {
  await nextTick();
  initChart();
});

onUnmounted(() => {
  if (chart.value) {
    try {
      chart.value.destroy();
      chart.value = null;
    } catch (error) {
      console.warn('Chart cleanup error:', error);
    }
  }
});
</script>