/**
 * Format number as currency
 * @param {number} n - Number to format
 * @param {number} prec - Decimal precision
 * @returns {string} Formatted currency string
 */
export const fmt = (n, prec = 2) => {
  return isFinite(n) 
    ? `$${Number(n).toLocaleString(undefined, {
        minimumFractionDigits: prec,
        maximumFractionDigits: prec
      })}`
    : '—';
};

/**
 * Format number as percentage
 * @param {number} n - Number to format
 * @param {number} prec - Decimal precision
 * @returns {string} Formatted percentage string
 */
export const pct = (n, prec = 2) => {
  return isFinite(n)
    ? `${Number(n).toLocaleString(undefined, {
        minimumFractionDigits: prec,
        maximumFractionDigits: prec
      })}%`
    : '—';
};

/**
 * Clamp number between min and max
 * @param {number} n - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
