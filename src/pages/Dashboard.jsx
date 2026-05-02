import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Dashboard.css";
import Chart from "../components/Charts";
import axios from "axios";
import {
  LayoutDashboard, Briefcase, TrendingUp, Search,
  Settings, Bell, LogOut, User
} from "lucide-react";

const COINS = [
  { id: "bitcoin",      symbol: "BTC",  label: "Bitcoin"  },
  { id: "ethereum",     symbol: "ETH",  label: "Ethereum" },
  { id: "solana",       symbol: "SOL",  label: "Solana"   },
  { id: "binancecoin",  symbol: "BNB",  label: "BNB"      },
  { id: "dogecoin",     symbol: "DOGE", label: "Dogecoin" },
];

const STARTING_BALANCE = 10000;

function Dashboard({ session }) {
  const navigate = useNavigate();

  const user      = session.user;
  const userId    = user.id;
  const userEmail = user.email;
  const userName  = user.user_metadata?.full_name || user.email;

  const [dbLoaded, setDbLoaded] = useState(false);
  const [prices, setPrices]         = useState({});
  const [portfolio, setPortfolio]   = useState({});
  const [balance, setBalance]       = useState(STARTING_BALANCE);
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [chartData, setChartData]   = useState([]);
  const [tradeAmount, setTradeAmount] = useState("");
  const [activeNav, setActiveNav]   = useState("Dashboard");
  const [notification, setNotification] = useState("");
  const [search, setSearch]         = useState("");
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (profile) setBalance(profile.balance ?? STARTING_BALANCE);

      const { data: holdings } = await supabase
        .from("portfolio")
        .select("*")
        .eq("user_id", user.id);

      if (holdings) {
        const mapped = {};
        holdings.forEach((h) => {
          mapped[h.coin_id] = {
            qty:      h.qty,
            avgPrice: h.avg_price,
            symbol:   h.symbol,
            label:    h.label,
          };
        });
        setPortfolio(mapped);
      }

      setDbLoaded(true);
    };

    loadProfile();
  }, []);

  const saveToSupabase = useCallback(async (newBalance, newPortfolio) => {
    setSaving(true);
    try {
      await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", userId);

      const upserts = [];
      const deletes = [];

      Object.entries(newPortfolio).forEach(([coinId, h]) => {
        if (!h || h.qty <= 0) {
          deletes.push(coinId);
        } else {
          upserts.push({
            user_id:   userId,
            coin_id:   coinId,
            qty:       h.qty,
            avg_price: h.avgPrice,
            symbol:    h.symbol,
            label:     h.label,
          });
        }
      });

      if (upserts.length > 0) {
        await supabase
          .from("portfolio")
          .upsert(upserts, { onConflict: "user_id,coin_id" });
      }

      for (const coinId of deletes) {
        await supabase
          .from("portfolio")
          .delete()
          .eq("user_id", userId)
          .eq("coin_id", coinId);
      }
    } catch (err) {
      console.error("Save failed", err);
    }
    setSaving(false);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,SOL,BNB,DOGE&tsyms=USD`
        );
        const raw = res.data.RAW;
        const formatted = {};
        COINS.forEach((coin) => {
          const data = raw[coin.symbol]?.USD;
          if (data) {
            formatted[coin.id] = {
              usd: data.PRICE,
              usd_24h_change: data.CHANGEPCT24HOUR,
            };
          }
        });
        setPrices(formatted);
      } catch (err) {
        console.warn("Price fetch failed", err);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await axios.get(
          `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${selectedCoin.symbol}&tsym=USD&limit=30`
        );
        const formatted = res.data.Data.Data.map((d) => ({
          time:  d.time,
          open:  d.open,
          high:  d.high,
          low:   d.low,
          close: d.close,
        }));
        setChartData(formatted);
      } catch (err) {
        console.warn("Chart fetch failed", err);
      }
    };
    fetchChart();
  }, [selectedCoin]);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleBuy = async () => {
    const amount = parseFloat(tradeAmount);
    const price  = prices[selectedCoin.id]?.usd;
    if (!amount || !price || amount <= 0) return notify("⚠️ Enter a valid amount");
    if (amount > balance) return notify("⚠️ Insufficient balance");

    const qty        = amount / price;
    const newBalance = balance - amount;
    const newPortfolio = {
      ...portfolio,
      [selectedCoin.id]: {
        qty:      (portfolio[selectedCoin.id]?.qty || 0) + qty,
        avgPrice: price,
        symbol:   selectedCoin.symbol,
        label:    selectedCoin.label,
      },
    };

    setBalance(newBalance);
    setPortfolio(newPortfolio);
    notify(`✅ Bought $${amount} of ${selectedCoin.symbol}`);
    setTradeAmount("");
    await saveToSupabase(newBalance, newPortfolio);
  };

  const handleSell = async () => {
    const amount  = parseFloat(tradeAmount);
    const price   = prices[selectedCoin.id]?.usd;
    const holding = portfolio[selectedCoin.id];
    if (!amount || !price || amount <= 0) return notify("⚠️ Enter a valid amount");
    if (!holding || holding.qty * price < amount) return notify("⚠️ Not enough holdings");

    const qty        = amount / price;
    const newQty     = holding.qty - qty;
    const newBalance = balance + amount;
    const newPortfolio = {
      ...portfolio,
      [selectedCoin.id]: newQty <= 0
        ? undefined
        : { ...holding, qty: newQty },
    };

    setBalance(newBalance);
    setPortfolio(newPortfolio);
    notify(`✅ Sold $${amount} of ${selectedCoin.symbol}`);
    setTradeAmount("");
    await saveToSupabase(newBalance, newPortfolio);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const portfolioValue = Object.entries(portfolio).reduce((acc, [id, h]) => {
    if (!h) return acc;
    return acc + (prices[id]?.usd || 0) * h.qty;
  }, 0);

  const totalValue = balance + portfolioValue;
  const pnl        = totalValue - STARTING_BALANCE;

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { icon: <Briefcase size={20} />,       label: "Portfolio"  },
    { icon: <TrendingUp size={20} />,      label: "Markets"    },
    { icon: <Search size={20} />,          label: "Discover"   },
    { icon: <Settings size={20} />,        label: "Settings"   },
  ];

  const movers = [...COINS].sort((a, b) => {
    const aChange = Math.abs(prices[a.id]?.usd_24h_change || 0);
    const bChange = Math.abs(prices[b.id]?.usd_24h_change || 0);
    return bChange - aChange;
  }).slice(0, 4);

  if (!dbLoaded) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
      <div style={{ width: 44, height: 44, border: "4px solid #e2e8f0", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">N</div>
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`nav-icon ${activeNav === item.label ? "active" : ""}`}
            onClick={() => setActiveNav(item.label)}
          >
            {item.icon}
            <span className="tooltip">{item.label}</span>
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="nav-icon" onClick={() => navigate("/profile")}>
            <User size={20} />
            <span className="tooltip">Profile</span>
          </div>
          <div className="nav-icon" style={{ color: "#ef4444" }} onClick={handleLogout}>
            <LogOut size={20} />
            <span className="tooltip">Logout</span>
          </div>
        </div>
      </aside>

      {/* TICKER BAR */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...COINS, ...COINS].map((coin, i) => {
            const p      = prices[coin.id];
            const change = p?.usd_24h_change;
            return (
              <div key={i} className="ticker-item">
                <span className="t-symbol">{coin.symbol}</span>
                <span className="t-price">{p ? `$${p.usd.toLocaleString()}` : "..."}</span>
                <span className={`t-change ${change >= 0 ? "up" : "down"}`}>
                  {change ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "..."}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <main className="main">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text, #1a1a2e)", margin: 0 }}>
              Welcome back, {userName.split(" ")[0]} 👋
            </h2>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{userEmail}</p>
          </div>
          {saving && (
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 10, height: 10, border: "2px solid #cbd5e1", borderTopColor: "#64748b", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              Saving...
            </span>
          )}
        </div>

        <div className="search-bar">
          <Search size={16} color="#94a3b8" />
          <input
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {COINS.filter(c =>
            c.symbol.toLowerCase().includes(search.toLowerCase()) ||
            c.label.toLowerCase().includes(search.toLowerCase()) ||
            search === ""
          ).map((coin) => (
            <button
              key={coin.id}
              className={`coin-btn ${selectedCoin.id === coin.id ? "active" : ""}`}
              onClick={() => setSelectedCoin(coin)}
            >
              {coin.symbol}
            </button>
          ))}
        </div>

        <div className="chart-box">
          <div style={{ marginBottom: "12px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>{selectedCoin.label}</h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
              {prices[selectedCoin.id]
                ? `$${prices[selectedCoin.id].usd.toLocaleString()} · `
                : "Loading... · "}
              <span className={prices[selectedCoin.id]?.usd_24h_change >= 0 ? "up" : "down"}>
                {prices[selectedCoin.id]?.usd_24h_change
                  ? `${prices[selectedCoin.id].usd_24h_change.toFixed(2)}% today`
                  : ""}
              </span>
            </p>
          </div>
          <Chart data={chartData} />
        </div>

        <div className="trade-box">
          <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1a1a2e" }}>
            Trade {selectedCoin.symbol}
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="number"
              placeholder="Amount in USD"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1a1a2e", fontSize: "14px", outline: "none" }}
            />
            <button className="buy-btn" onClick={handleBuy}>Buy</button>
            <button className="sell-btn" onClick={handleSell}>Sell</button>
          </div>
          {notification && (
            <p style={{ marginTop: "10px", fontSize: "13px", color: notification.includes("⚠️") ? "#ef4444" : "#22c55e" }}>
              {notification}
            </p>
          )}
        </div>

        <div className="stats">
          <div className="card">
            💼 Portfolio Value
            <strong>${portfolioValue.toFixed(2)}</strong>
          </div>
          <div className="card">
            💰 Cash Balance
            <strong>${balance.toFixed(2)}</strong>
          </div>
          <div className="card">
            📈 Total P&L
            <strong style={{ color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
              {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
            </strong>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#1a1a2e" }}>
            🔥 Big Movers
          </h3>
          <div className="movers-grid">
            {movers.map((coin) => {
              const p      = prices[coin.id];
              const change = p?.usd_24h_change;
              return (
                <div key={coin.id} className="mover-card" onClick={() => setSelectedCoin(coin)} style={{ cursor: "pointer" }}>
                  <div className="m-symbol">{coin.symbol}</div>
                  <div className="m-price">{p ? `$${p.usd.toLocaleString()}` : "Loading..."}</div>
                  <div className={`m-change ${change >= 0 ? "up" : "down"}`}>
                    {change ? `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}%` : "..."}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* RIGHT PANEL */}
      <aside className="right">
        <div style={{ paddingTop: "16px" }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#15803d" }}>💰 Cash Balance</p>
            <p style={{ fontSize: "22px", fontWeight: "800", color: "#1a1a2e", margin: "4px 0" }}>
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: "12px", color: pnl >= 0 ? "#22c55e" : "#ef4444", fontWeight: "600" }}>
              {pnl >= 0 ? "▲" : "▼"} ${Math.abs(pnl).toFixed(2)} total P&L
            </p>
          </div>

          <h3>Watchlist</h3>
          {COINS.map((coin) => {
            const p      = prices[coin.id];
            const change = p?.usd_24h_change;
            return (
              <div key={coin.id} className="asset" onClick={() => setSelectedCoin(coin)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "14px" }}>{coin.symbol}</strong>
                  <span className={change >= 0 ? "up" : "down"} style={{ fontSize: "12px", fontWeight: "600" }}>
                    {change ? `${change.toFixed(2)}%` : "..."}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  {p ? `$${p.usd.toLocaleString()}` : "Loading..."}
                </div>
              </div>
            );
          })}

          <h3>My Holdings</h3>
          {Object.entries(portfolio).filter(([, h]) => h).length === 0
            ? <p style={{ opacity: 0.4, fontSize: "13px" }}>No holdings yet</p>
            : Object.entries(portfolio).filter(([, h]) => h).map(([id, h]) => (
              <div key={id} className="asset">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "14px" }}>{h.symbol}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{h.qty.toFixed(6)}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  ≈ ${((prices[id]?.usd || 0) * h.qty).toFixed(2)}
                </div>
              </div>
            ))
          }
        </div>
      </aside>

    </div>
  );
}

export default Dashboard;