import { ref, computed, watch } from 'vue';
import { calculateMetrics } from '../utils/calculations.js';

export function useTradeCalculator() {
  // Input refs
  const shares = ref(100);
  const purchasePrice = ref(150);
  const fees = ref(2);
  const slippage = ref(0.05);
  const stopRate = ref(2);
  const tpRate = ref(4);
  const equity = ref(25000);
  const riskPct = ref(0.5);
  const margin = ref('none');
  const buyingPower = ref(100000);
  const dailyLoss = ref(2);
  const pdtTrades = ref(0);

  // Alert state
  const crossedStop = ref(false);
  const crossedTP = ref(false);

  // Computed metrics
  const metrics = computed(() => {
    return calculateMetrics({
      shares: shares.value,
      entry: purchasePrice.value,
      fees: fees.value,
      slippagePct: slippage.value,
      stopRate: stopRate.value,
      tpRate: tpRate.value,
      equity: equity.value,
      riskPct: riskPct.value,
      buyingPower: buyingPower.value,
      current: 0, // Will be updated externally
      dailyLossRate: dailyLoss.value,
      pdtTrades: pdtTrades.value,
      margin: margin.value
    });
  });

  function updateCurrentPrice(price) {
    if (isFinite(price)) {
      const updatedMetrics = calculateMetrics({
        shares: shares.value,
        entry: purchasePrice.value,
        fees: fees.value,
        slippagePct: slippage.value,
        stopRate: stopRate.value,
        tpRate: tpRate.value,
        equity: equity.value,
        riskPct: riskPct.value,
        buyingPower: buyingPower.value,
        current: price,
        dailyLossRate: dailyLoss.value,
        pdtTrades: pdtTrades.value,
        margin: margin.value
      });

      // Check for stop/TP alerts
      const stopHit = price <= updatedMetrics.stopPrice && isFinite(price);
      const tpHit = price >= updatedMetrics.tpPrice && isFinite(price);

      if (stopHit && !crossedStop.value) {
        crossedStop.value = true;
        playAlert();
      }
      if (tpHit && !crossedTP.value) {
        crossedTP.value = true;
        playAlert();
      }
      if (!stopHit) crossedStop.value = false;
      if (!tpHit) crossedTP.value = false;

      return updatedMetrics;
    }
    return metrics.value;
  }

  function playAlert() {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAZGF0YQgAAAAA');
      audio.play().catch(() => {});
    } catch (e) {
      // Silent fail
    }
  }

  // Load saved values from localStorage
  function loadSavedValues() {
    const refs = {
      shares,
      purchasePrice,
      fees,
      slippage,
      stopRate,
      tpRate,
      equity,
      riskPct,
      margin,
      buyingPower,
      dailyLoss,
      pdtTrades
    };

    Object.entries(refs).forEach(([key, ref]) => {
      const savedValue = localStorage.getItem(`tc_${key}`);
      if (savedValue !== null) {
        if (key === 'margin') {
          ref.value = savedValue;
        } else {
          const numValue = parseFloat(savedValue);
          if (!isNaN(numValue)) {
            ref.value = numValue;
          }
        }
      }
    });
  }

  // Save values to localStorage
  function saveValues() {
    const values = {
      shares: shares.value,
      purchasePrice: purchasePrice.value,
      fees: fees.value,
      slippage: slippage.value,
      stopRate: stopRate.value,
      tpRate: tpRate.value,
      equity: equity.value,
      riskPct: riskPct.value,
      margin: margin.value,
      buyingPower: buyingPower.value,
      dailyLoss: dailyLoss.value,
      pdtTrades: pdtTrades.value
    };

    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(`tc_${key}`, value);
    });
  }

  // Watch for changes and save
  watch([shares, purchasePrice, fees, slippage, stopRate, tpRate, equity, riskPct, margin, buyingPower, dailyLoss, pdtTrades], 
    saveValues, { deep: true });

  return {
    // Inputs
    shares,
    purchasePrice,
    fees,
    slippage,
    stopRate,
    tpRate,
    equity,
    riskPct,
    margin,
    buyingPower,
    dailyLoss,
    pdtTrades,
    
    // Computed
    metrics,
    crossedStop,
    crossedTP,
    
    // Methods
    updateCurrentPrice,
    loadSavedValues,
    saveValues
  };
}
