import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import axios from "axios";
import {
  LayoutDashboard, Briefcase, TrendingUp, Search,
  Settings, LogOut, User, BarChart2, PieChart, LineChart,
  Edit3, Users, Copy, TrendingDown, Award, Clock
} from "lucide-react";

const COINS = [
  { id: "bitcoin",     symbol: "BTC",  label: "Bitcoin"  },
  { id: "ethereum",    symbol: "ETH",  label: "Ethereum" },
  { id: "solana",      symbol: "SOL",  label: "Solana"   },
  { id: "binancecoin", symbol: "BNB",  label: "BNB"      },
  { id: "dogecoin",    symbol: "DOGE", label: "Dogecoin" },
];

const STARTING_BALANCE = 10000;

export default function Profile({ session }) {
  const navigate = useNavigate();
  const user = session.user;
  const userName = user.user_metadata?.full_name || "Anonymous";
  const userEmail = user.email;
  const userCountry = user.user_metadata?.country || "Unknown";

  const [activeTab, setActiveTab] = useState("Overview");
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [portfolio, setPortfolio] = useState({});
  const [prices, setPrices] = useState({});
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance, bio")
        .eq("id", user.id)
        .single();

      if (profile) {
        setBalance(profile.balance ?? STARTING_BALANCE);
        setBio(profile.bio || "");
        setBioInput(profile.bio || "");
      }

      const { data: holdings } = await supabase
        .from("portfolio")
        .select("*")
        .eq("user_id", user.id);

      if (holdings) {
        const mapped = {};
        holdings.forEach((h) => {
          mapped[h.coin_id] = { qty: h.qty, avgPrice: h.avg_price, symbol: h.symbol, label: h.label };
        });
        setPortfolio(mapped);
      }

      setJoinDate(new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }));
    };
    load();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,SOL,BNB,DOGE&tsyms=USD"
        );
        const raw = res.data.RAW;
        const fmt = {};
        COINS.forEach((c) => {
          const d = raw[c.symbol]?.USD;
          if (d) fmt[c.id] = { usd: d.PRICE, change: d.CHANGEPCT24HOUR };
        });
        setPrices(fmt);
      } catch (e) {}
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30"
        );
        setHistoryData(res.data.Data.Data);
      } catch (e) {}
    };
    fetchHistory();
  }, []);

  const saveBio = async () => {
    await supabase.from("profiles").update({ bio: bioInput }).eq("id", user.id);
    setBio(bioInput);
    setEditingBio(false);
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
  const pnl = totalValue - STARTING_BALANCE;
  const pnlPct = ((pnl / STARTING_BALANCE) * 100).toFixed(2);
  const holdingsCount = Object.values(portfolio).filter(Boolean).length;

  const bestPerformer = Object.entries(portfolio)
    .filter(([, h]) => h)
    .map(([id, h]) => {
      const currentVal = (prices[id]?.usd || 0) * h.qty;
      const costBasis = h.avgPrice * h.qty;
      const gain = currentVal - costBasis;
      return { ...h, id, gain, gainPct: costBasis > 0 ? (gain / costBasis) * 100 : 0 };
    })
    .sort((a, b) => b.gainPct - a.gainPct)[0];

  const tabs = ["Overview", "Stats", "Portfolio", "Chart"];

  const Sparkline = ({ data, color = "#22c55e" }) => {
    if (!data || data.length < 2) return null;
    const vals = data.map((d) => d.close);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const w = 200, h = 50;
    const points = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "60px" }}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "64px", background: "#1a1a2e", display: "flex", flexDirection: "column",
        alignItems: "center", paddingTop: "20px", gap: "8px", position: "fixed",
        top: 0, left: 0, height: "100vh", zIndex: 100
      }}>
        <div style={{
          width: "36px", height: "36px", background: "linear-gradient(135deg, #22c55e, #16a34a)",
          borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "800", fontSize: "16px", marginBottom: "16px"
        }}>N</div>

        {[
          { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
          { icon: <Briefcase size={20} />,       label: "Portfolio"  },
          { icon: <TrendingUp size={20} />,      label: "Markets"    },
          { icon: <Search size={20} />,          label: "Discover"   },
          { icon: <Settings size={20} />,        label: "Settings"   },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate("/Dashboard")}
            title={item.label}
            style={{
              width: "44px", height: "44px", borderRadius: "12px", display: "flex",
              alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8",
            }}
          >
            {item.icon}
          </div>
        ))}

        <div style={{
          width: "44px", height: "44px", borderRadius: "12px", display: "flex",
          alignItems: "center", justifyContent: "center", color: "#22c55e",
          background: "rgba(34,197,94,0.15)",
        }}>
          <User size={20} />
        </div>

        <div style={{ marginTop: "auto", marginBottom: "20px" }}>
          <div onClick={handleLogout} title="Logout" style={{
            width: "44px", height: "44px", borderRadius: "12px", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444",
          }}>
            <LogOut size={20} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: "64px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* PROFILE HEADER */}
        <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "24px 32px 0" }}>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
            People › {userCountry} › {userName.toLowerCase().replace(" ", "")}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "16px",
              background: "linear-gradient(135deg, #1e293b, #334155)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: "800", color: "#22c55e",
              border: "3px solid #e2e8f0", flexShrink: 0
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>{userName}</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>
                {userCountry} · Joined {joinDate}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #f1f5f9" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 24px", background: "none", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: activeTab === tab ? "600" : "400",
                  color: activeTab === tab ? "#1a1a2e" : "#94a3b8",
                  borderBottom: activeTab === tab ? "2px solid #22c55e" : "2px solid transparent",
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                {tab === "Overview"  && <BarChart2 size={14} />}
                {tab === "Stats"     && <TrendingUp size={14} />}
                {tab === "Portfolio" && <PieChart size={14} />}
                {tab === "Chart"     && <LineChart size={14} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding: "28px 32px", flex: 1 }}>

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px" }}>
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 20px" }}>Performance</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  {[
                    { label: "Total Value", value: `$${totalValue.toFixed(2)}`,                        color: "#1a1a2e" },
                    { label: "P&L",         value: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`,         color: pnl >= 0 ? "#22c55e" : "#ef4444" },
                    { label: "Return",      value: `${pnlPct}%`,                                        color: pnl >= 0 ? "#22c55e" : "#ef4444" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 6px" }}>{s.label}</p>
                      <p style={{ fontSize: "20px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                {historyData.length > 0 ? (
                  <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px" }}>BTC 30-day trend</p>
                    <Sparkline data={historyData} color={pnl >= 0 ? "#22c55e" : "#ef4444"} />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px", color: "#cbd5e1", fontSize: "14px" }}>No Data to Display</div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>About {userName.split(" ")[0]}</h3>
                    <button onClick={() => setEditingBio(true)} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                      <Edit3 size={12} /> Edit
                    </button>
                  </div>
                  {editingBio ? (
                    <div>
                      <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} placeholder="Tell investors about your strategy..." style={{ width: "100%", minHeight: "80px", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#1a1a2e", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        <button onClick={saveBio} style={{ flex: 1, padding: "8px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>Save</button>
                        <button onClick={() => setEditingBio(false)} style={{ flex: 1, padding: "8px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                      </div>
                    </div>
                  ) : bio ? (
                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>{bio}</p>
                  ) : (
                    <div style={{ textAlign: "center", padding: "16px 0" }}>
                      <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 12px" }}>Give investors more details about your history, investment approach, and your style</p>
                      <button onClick={() => setEditingBio(true)} style={{ padding: "8px 20px", background: "none", border: "2px solid #22c55e", color: "#22c55e", borderRadius: "999px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>Write Bio</button>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
                    {[
                      { icon: <Copy size={16} />,  label: "Copiers",   value: "N/A" },
                      { icon: <Users size={16} />, label: "Followers", value: "0"   },
                    ].map((s) => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "22px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 4px" }}>{s.value}</p>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>{s.icon}{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Award size={16} color="#f59e0b" /> Best Performer
                  </h3>
                  {bestPerformer ? (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontWeight: "700", fontSize: "15px", color: "#1a1a2e", margin: 0 }}>{bestPerformer.symbol}</p>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>{bestPerformer.label}</p>
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: bestPerformer.gainPct >= 0 ? "#22c55e" : "#ef4444" }}>
                        {bestPerformer.gainPct >= 0 ? "+" : ""}{bestPerformer.gainPct.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: "8px 0" }}>No holdings yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STATS */}
          {activeTab === "Stats" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[
                { label: "Starting Balance", value: `$${STARTING_BALANCE.toLocaleString()}`,              icon: <Clock size={20} color="#94a3b8" /> },
                { label: "Current Balance",  value: `$${balance.toFixed(2)}`,                             icon: <TrendingUp size={20} color="#22c55e" /> },
                { label: "Portfolio Value",  value: `$${portfolioValue.toFixed(2)}`,                      icon: <PieChart size={20} color="#3b82f6" /> },
                { label: "Total P&L",        value: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`,           icon: pnl >= 0 ? <TrendingUp size={20} color="#22c55e" /> : <TrendingDown size={20} color="#ef4444" /> },
                { label: "Return %",         value: `${pnlPct}%`,                                         icon: <BarChart2 size={20} color="#f59e0b" /> },
                { label: "Assets Held",      value: holdingsCount,                                        icon: <Briefcase size={20} color="#8b5cf6" /> },
              ].map((s) => (
                <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 6px" }}>{s.label}</p>
                    <p style={{ fontSize: "24px", fontWeight: "800", color: "#1a1a2e", margin: 0 }}>{s.value}</p>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PORTFOLIO */}
          {activeTab === "Portfolio" && (
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>My Holdings</h3>
              </div>
              {Object.entries(portfolio).filter(([, h]) => h).length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <p style={{ fontSize: "14px", margin: 0 }}>No holdings yet — start trading on the Dashboard</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Asset", "Quantity", "Avg Buy Price", "Current Price", "Value", "P&L"].map((h) => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(portfolio).filter(([, h]) => h).map(([id, h], i) => {
                      const currentPrice = prices[id]?.usd || 0;
                      const value = currentPrice * h.qty;
                      const costBasis = h.avgPrice * h.qty;
                      const gain = value - costBasis;
                      const gainPct = costBasis > 0 ? (gain / costBasis) * 100 : 0;
                      return (
                        <tr key={id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                          <td style={{ padding: "16px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #1e293b, #334155)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontWeight: "800", fontSize: "11px" }}>{h.symbol}</div>
                              <div>
                                <p style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e", margin: 0 }}>{h.symbol}</p>
                                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{h.label}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1a1a2e" }}>{h.qty.toFixed(6)}</td>
                          <td style={{ padding: "16px 24px", fontSize: "14px", color: "#64748b" }}>${h.avgPrice.toLocaleString()}</td>
                          <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1a1a2e" }}>${currentPrice.toLocaleString()}</td>
                          <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>${value.toFixed(2)}</td>
                          <td style={{ padding: "16px 24px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: gain >= 0 ? "#22c55e" : "#ef4444" }}>
                              {gain >= 0 ? "+" : ""}${gain.toFixed(2)} ({gainPct.toFixed(2)}%)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CHART */}
          {activeTab === "Chart" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {COINS.map((coin) => {
                const p = prices[coin.id];
                const change = p?.change;
                return (
                  <div key={coin.id} style={{ background: "white", borderRadius: "16px", padding: "20px 24px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "12px", background: "linear-gradient(135deg, #1e293b, #334155)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontWeight: "800", fontSize: "12px" }}>{coin.symbol}</div>
                      <div>
                        <p style={{ fontWeight: "700", fontSize: "15px", color: "#1a1a2e", margin: 0 }}>{coin.label}</p>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>{coin.symbol}/USD</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "18px", fontWeight: "800", color: "#1a1a2e", margin: 0 }}>{p ? `$${p.usd.toLocaleString()}` : "..."}</p>
                      <p style={{ fontSize: "13px", fontWeight: "600", margin: "2px 0 0", color: change >= 0 ? "#22c55e" : "#ef4444" }}>
                        {change ? `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}%` : "..."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}