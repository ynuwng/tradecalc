/**
 * Calculate all trading metrics
 * @param {Object} inputs - Trading inputs
 * @returns {Object} Calculated metrics
 */
export function calculateMetrics(inputs) {
  const {
    shares = 0,
    entry = 0,
    fees = 0,
    slippagePct = 0,
    stopRate = 0,
    tpRate = 0,
    equity = 0,
    riskPct = 0,
    buyingPower = 0,
    current = 0,
    dailyLossRate = 0,
    pdtTrades = 0,
    margin = 'none'
  } = inputs;

  const stopPrice = entry * (1 - stopRate / 100);
  const tpPrice = entry * (1 + tpRate / 100);

  // Realized + unrealized inputs
  const effectiveEntry = entry * (1 + slippagePct / 100); // assume adverse slippage on entry
  const effectiveExit = current * (1 - slippagePct / 100); // adverse slippage on exit
  const positionCost = shares * effectiveEntry + fees;
  const pl = shares * (effectiveExit - effectiveEntry) - fees;
  const roi = positionCost > 0 ? (pl / positionCost) * 100 : NaN;

  // P/L at stop & TP (assuming fill with slippage + fees)
  const effStop = stopPrice * (1 - slippagePct / 100);
  const effTP = tpPrice * (1 - slippagePct / 100);
  const plStop = shares * (effStop - effectiveEntry) - fees;
  const plTP = shares * (effTP - effectiveEntry) - fees;

  // R:R using per-share delta (ignoring fees for ratio stability)
  const riskPerShare = Math.max(1e-9, effectiveEntry - effStop);
  const rewardPerShare = Math.max(0, effTP - effectiveEntry);
  const rr = rewardPerShare / riskPerShare;

  // Recommended shares by risk budgeting & buying power
  const riskBudget = equity * (riskPct / 100);
  const recByRisk = Math.floor(riskBudget / riskPerShare);
  const recByBP = Math.floor(buyingPower / effectiveEntry);
  const recShares = Math.max(0, Math.min(recByRisk, recByBP));

  // Guardrails & PDT
  const dailyLossLimit = equity * (dailyLossRate / 100);
  const pdtRisk = (equity < 25000) && (margin !== 'none') && (pdtTrades >= 4);

  return {
    shares,
    entry,
    fees,
    slippagePct,
    stopRate,
    tpRate,
    equity,
    riskPct,
    buyingPower,
    stopPrice,
    tpPrice,
    current,
    effectiveEntry,
    effectiveExit,
    positionCost,
    pl,
    roi,
    effStop,
    effTP,
    plStop,
    plTP,
    rr,
    recShares,
    riskBudget,
    dailyLossLimit,
    pdtRisk,
    pdtTrades,
    margin
  };
}
