// src/services/cryptoApi.js
import axios from "axios";
import { TIME_LIMITS } from "../Utils/constants";

export const fetchCryptoPrices = async (coins) => {
  try {
    const syms = coins.map(c => c.symbol).join(",");
    const res = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${syms}&tsyms=USD`
    );
    const raw = res.data.RAW;
    const out = {};
    coins.forEach(coin => {
      const d = raw[coin.symbol]?.USD;
      if (d) out[coin.symbol] = { price: d.PRICE, change24h: d.CHANGEPCT24HOUR };
    });
    return out;
  } catch (error) {
    console.error("Price fetch failed:", error);
    throw error;
  }
};

export const fetchChartData = async (symbol, timeFilter) => {
  try {
    const { limit, endpoint } = TIME_LIMITS[timeFilter];
    const res = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/${endpoint}` +
      `?fsym=${symbol}&tsym=USD&limit=${limit}`
    );
    // Add safety check for the response structure
    if (res.data?.Data?.Data && Array.isArray(res.data.Data.Data)) {
      return res.data.Data.Data.map((d, i) => ({ i, value: d.close }));
    }
    return [];
  } catch (error) {
    console.error("Chart fetch failed:", error);
    return [];
  }
};

export const fetchSparkline = async (symbol) => {
  try {
    const res = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=24`
    );
    // Add safety check for the response structure
    if (res.data?.Data?.Data && Array.isArray(res.data.Data.Data)) {
      return res.data.Data.Data.map((d, i) => ({ i, value: d.close }));
    }
    return []; // Return empty array if data is missing
  } catch (error) {
    console.error(`Sparkline fetch failed for ${symbol}:`, error);
    return []; // Return empty array on error
  }
};

export const fetchBTCPrice = async () => {
  try {
    const res = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD"
    );
    return res.data.USD;
  } catch (error) {
    console.error("Failed to fetch BTC price", error);
    return 50000; // fallback
  }
};