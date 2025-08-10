<template>
  <div class="card">
    <h3>Inputs</h3>
    
    <!-- Connection Settings -->
    <div class="row">
      <div class="field sm">
        <label>Price Source</label>
        <select v-model="stockData.source">
          <option value="demo">Demo (simulated)</option>
          <option value="finnhub">Finnhub.io (REST poll)</option>
        </select>
      </div>
      <div class="field sm">
        <label>API Key <span class="sub">(required for Finnhub)</span></label>
        <input 
          v-model="stockData.apiKey" 
          placeholder="Your API token"
          type="password"
        />
      </div>
      <div class="field sm">
        <label>Stock Symbol</label>
        <input 
          v-model="stockData.symbol" 
          placeholder="e.g., AAPL"
          @input="onSymbolChange"
        />
      </div>
      <div class="field sm" style="display:flex;align-items:flex-end">
        <button 
          @click="connect" 
          class="btn primary" 
          style="width:100%"
          :disabled="stockData.isLoading"
        >
          {{ stockData.isLoading ? 'Connecting...' : 'Connect' }}
        </button>
      </div>
    </div>

    <!-- Trading Parameters -->
    <div class="row">
      <div class="field sm">
        <label>Number of Shares</label>
        <input 
          v-model.number="calculator.shares" 
          type="number" 
          min="0" 
          step="1"
        />
      </div>
      <div class="field sm">
        <label>Purchase Price ($)</label>
        <input 
          v-model.number="calculator.purchasePrice" 
          type="number" 
          min="0" 
          step="0.01"
        />
      </div>
      <div class="field sm">
        <label>Commission / Fees ($, round trip)</label>
        <input 
          v-model.number="calculator.fees" 
          type="number" 
          min="0" 
          step="0.01"
        />
      </div>
      <div class="field sm">
        <label>Slippage (%)</label>
        <input 
          v-model.number="calculator.slippage" 
          type="number" 
          min="0" 
          step="0.01"
        />
      </div>
    </div>

    <!-- Risk Management -->
    <div class="row">
      <div class="field sm">
        <label>Stop Loss Rate (%)</label>
        <input 
          v-model.number="calculator.stopRate" 
          type="number" 
          min="0" 
          step="0.05"
        />
      </div>
      <div class="field sm">
        <label>Take Profit Rate (%)</label>
        <input 
          v-model.number="calculator.tpRate" 
          type="number" 
          min="0" 
          step="0.05"
        />
      </div>
      <div class="field sm">
        <label>Account Equity ($)</label>
        <input 
          v-model.number="calculator.equity" 
          type="number" 
          min="0" 
          step="1"
        />
      </div>
      <div class="field sm">
        <label>Risk per Trade (% of equity)</label>
        <input 
          v-model.number="calculator.riskPct" 
          type="number" 
          min="0" 
          step="0.1"
        />
      </div>
    </div>

    <!-- Margin & PDT -->
    <div class="row">
      <div class="field sm">
        <label>Use Margin?</label>
        <select v-model="calculator.margin">
          <option value="none">No</option>
          <option value="intraday">Yes — 4:1 intraday</option>
          <option value="overnight">Yes — 2:1 overnight</option>
        </select>
      </div>
      <div class="field sm">
        <label>Est. Buying Power ($)</label>
        <input 
          v-model.number="calculator.buyingPower" 
          type="number" 
          min="0" 
          step="1"
        />
      </div>
      <div class="field sm">
        <label>Daily Loss Limit (%)</label>
        <input 
          v-model.number="calculator.dailyLoss" 
          type="number" 
          min="0" 
          step="0.1"
        />
      </div>
      <div class="field sm">
        <label>Trades last 5 business days <span class="tooltip" title="US PDT rule: 4+ day trades within 5 business days on a margin account with < $25k equity flags PDT.">?</span></label>
        <input 
          v-model.number="calculator.pdtTrades" 
          type="number" 
          min="0" 
          step="1"
        />
      </div>
    </div>

    <!-- Alerts and KPIs -->
    <div class="divider"></div>
    <div class="kpis">
      <div class="kpi">
        <div class="name">PDT Status</div>
        <div class="value">
          <span v-if="currentMetrics.pdtRisk" class="pill bad">Potential PDT Flag</span>
          <span v-else class="pill" :class="getPdtStatusClass()">
            {{ calculator.equity < 25000 ? 'Equity < $25k' : 'OK' }}
          </span>
        </div>
      </div>
      <div class="kpi">
        <div class="name">Guardrail</div>
        <div class="value">
          <span class="pill" :class="currentMetrics.pl <= -currentMetrics.dailyLossLimit ? 'bad' : 'ok'">
            Risk budget: {{ fmt(currentMetrics.riskBudget) }} • Limit/day: {{ fmt(currentMetrics.dailyLossLimit) }}
          </span>
        </div>
      </div>
      <div class="kpi">
        <div class="name">R:R (TP / Stop)</div>
        <div class="value">{{ isFinite(currentMetrics.rr) ? currentMetrics.rr.toFixed(2) : '—' }}</div>
      </div>
      <div class="kpi">
        <div class="name">Recommended Shares</div>
        <div class="value">{{ isFinite(currentMetrics.recShares) ? currentMetrics.recShares.toLocaleString() : '—' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { fmt } from '../utils/formatters.js';

const props = defineProps({
  stockData: Object,
  calculator: Object,
  currentMetrics: Object
});

const emit = defineEmits(['connect']);

function connect() {
  emit('connect');
}

function onSymbolChange() {
  // Normalize symbol to uppercase
  if (props.stockData && props.stockData.symbol) {
    props.stockData.symbol.value = props.stockData.symbol.value.toUpperCase();
  }
}

function getPdtStatusClass() {
  const { margin, pdtTrades, equity } = props.calculator;
  if (margin.value !== 'none' && pdtTrades.value >= 3 && equity.value < 25000) {
    return 'warn';
  }
  return 'ok';
}
</script>
