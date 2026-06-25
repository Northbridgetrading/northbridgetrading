import axios from "axios";

const BASE = "https://api.coingecko.com/api/v3";

const SYMBOL_TO_ID = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  DOGE: "dogecoin",
  XRP: "ripple",
};

const TIME_TO_DAYS = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  "ALL": "max",
};

// ─── Prices + 24h change ─────────────────────────────────────────────────────
export const fetchCryptoPrices = async (coins) => {
  try {
    const ids = coins.map((c) => SYMBOL_TO_ID[c.symbol]).filter(Boolean).join(",");

    const res = await axios.get(`${BASE}/simple/price`, {
      params: { ids, vs_currencies: "usd", include_24hr_change: true },
    });

    const out = {};
    coins.forEach((coin) => {
      const id = SYMBOL_TO_ID[coin.symbol];
      const d = res.data?.[id];
      if (d) {
        out[coin.symbol] = {
          price: d.usd,
          change24h: d.usd_24h_change,
        };
      }
    });

    return out;
  } catch (error) {
    console.error("Price fetch failed:", error);
    return {};
  }
};

// ─── Chart data (OHLC) ───────────────────────────────────────────────────────
export const fetchChartData = async (symbol, timeFilter) => {
  try {
    const id = SYMBOL_TO_ID[symbol];
    if (!id) return [];

    const days = TIME_TO_DAYS[timeFilter] ?? 1;

    const res = await axios.get(`${BASE}/coins/${id}/ohlc`, {
      params: { vs_currency: "usd", days },
    });

    if (!Array.isArray(res.data)) return [];

    return res.data.map(([time, open, high, low, close]) => ({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
    }));
  } catch (error) {
    console.error("Chart fetch failed:", error);
    return [];
  }
};

// ─── All sparklines in ONE request ───────────────────────────────────────────
// Instead of 6 separate calls, fetch all coins at once with sparkline_in_7d
// then slice the last 24 data points for the 24h sparkline
export const fetchAllSparklines = async (coins) => {
  try {
    const ids = coins.map((c) => SYMBOL_TO_ID[c.symbol]).filter(Boolean).join(",");

    const res = await axios.get(`${BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        ids,
        sparkline: true, // includes sparkline_in_7d.price (168 hourly points)
      },
    });

    const out = {};
    res.data.forEach((coin) => {
      const symbol = Object.keys(SYMBOL_TO_ID).find(
        (k) => SYMBOL_TO_ID[k] === coin.id
      );
      if (!symbol) return;

      const prices = coin.sparkline_in_7d?.price || [];
      // Last 24 points = last 24 hours
      const last24 = prices.slice(-24);
      out[symbol] = last24.map((value, i) => ({ time: i, value }));
    });

    return out;
  } catch (error) {
    console.error("Sparklines fetch failed:", error);
    return {};
  }
};

// ─── Single sparkline (kept for backwards compat) ────────────────────────────
export const fetchSparkline = async (symbol) => {
  try {
    const id = SYMBOL_TO_ID[symbol];
    if (!id) return [];

    // Small delay to avoid rate limiting if called individually
    await new Promise((r) => setTimeout(r, 300));

    const res = await axios.get(`${BASE}/coins/markets`, {
      params: { vs_currency: "usd", ids: id, sparkline: true },
    });

    const prices = res.data?.[0]?.sparkline_in_7d?.price || [];
    const last24 = prices.slice(-24);
    return last24.map((value, i) => ({ time: i, value }));
  } catch (error) {
    console.error(`Sparkline fetch failed for ${symbol}:`, error);
    return [];
  }
};

// ─── BTC price ───────────────────────────────────────────────────────────────
export const fetchBTCPrice = async () => {
  try {
    const res = await axios.get(`${BASE}/simple/price`, {
      params: { ids: "bitcoin", vs_currencies: "usd" },
    });
    return res.data?.bitcoin?.usd || 50000;
  } catch (error) {
    console.error("Failed to fetch BTC price:", error);
    return 50000;
  }
};