// utils/constants.js
export const COINS = [
  { id: "bitcoin",     symbol: "BTC",  name: "Bitcoin",  icon: "₿", color: "#f7931a" },
  { id: "ethereum",    symbol: "ETH",  name: "Ethereum", icon: "Ξ", color: "#627eea" },
  { id: "solana",      symbol: "SOL",  name: "Solana",   icon: "◎", color: "#9945ff" },
  { id: "binancecoin", symbol: "BNB",  name: "BNB",      icon: "⬡", color: "#f3ba2f" },
  { id: "dogecoin",    symbol: "DOGE", name: "Dogecoin", icon: "Ð", color: "#c2a633" },
  { id: "ripple",      symbol: "XRP",  name: "XRP",      icon: "✕", color: "#346aa9" },
];

export const TIME_FILTERS = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
export const STARTING_BALANCE = 10000;

export const MOCK_NEWS = [
  { source: "Reuters",   time: "2m ago",  title: "Bitcoin surges past $62K as ETF inflows hit record highs this week" },
  { source: "Bloomberg", time: "18m ago", title: "Fed signals possible rate cut in Q3, crypto markets respond positively" },
  { source: "CoinDesk",  time: "1h ago",  title: "Ethereum upgrade improves network efficiency by 40% in latest testnet" },
  { source: "Forbes",    time: "2h ago",  title: "Solana sees record transaction volume in Q1 2025, analysts bullish" },
  { source: "CNBC",      time: "3h ago",  title: "Global crypto market cap crosses $2.5 trillion milestone for first time" },
];

export const TIME_LIMITS = {
  "1D": { limit: 24, endpoint: "histohour" },
  "1W": { limit: 7,  endpoint: "histoday" },
  "1M": { limit: 30, endpoint: "histoday" },
  "3M": { limit: 90, endpoint: "histoday" },
  "1Y": { limit: 365, endpoint: "histoday" },
  "ALL": { limit: 365, endpoint: "histoday" }
};