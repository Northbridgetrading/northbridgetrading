// utils/formatters.js
export const fmt = (n, d = 2) => 
  n?.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";

export const fmtUSD = (n) => `$${fmt(n)}`;