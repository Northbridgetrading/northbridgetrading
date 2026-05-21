// src/components/dashboard/HomeFeed.jsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { TIME_FILTERS, COINS, MOCK_NEWS } from "../../Utils/constants";
import { fmt, fmtUSD } from "../../Utils/formatters";
import { Sparkline } from "../common/Sparkline";
import { ChartTooltip } from "../common/ChartTooltip";

export const HomeFeed = ({ 
  isMobile, totalValue, pnl, pnlPct, chartData, activeTime, setActiveTime, 
  hoveredVal, setHoveredVal, buyingPower, portfolioValue, positions, prices,
  sparklines, watchlist, setSelectedCoin, setShowCoinDetail, toggleWatchlist,
  setShowDepositSheet, setShowWithdrawSheet
}) => {
  const isUp = pnl >= 0;
  
  return (
    <div style={{ padding: isMobile ? "0 0 100px" : "0 32px 40px" }}>

      {/* Header + chart — desktop only */}
      {!isMobile && (
        <div style={{ padding: "28px 0 0", marginBottom: 0 }}>
          <h1 style={{ fontSize: 42, fontWeight: 600, color: "#111", letterSpacing: "-1px", lineHeight: 1 }}>
            {fmtUSD(totalValue)}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            {pnl >= 0 ? <ArrowUpRight size={14} color="#22c55e" /> : <ArrowDownRight size={14} color="#ef4444" />}
            <span style={{ fontSize: 14, fontWeight: 500, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
              {pnl >= 0 ? "+" : ""}{fmtUSD(Math.abs(pnl))} ({pnl >= 0 ? "+" : ""}{fmt(pnlPct)}%)
            </span>
            <span style={{ fontSize: 14, color: "#bbb" }}>All time</span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ margin: isMobile ? "16px -4px 0" : "16px -8px 0" }}>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart
            data={chartData || []}
            onMouseMove={e => { if (e?.activePayload) setHoveredVal(e.activePayload[0]?.value); }}
            onMouseLeave={() => setHoveredVal(null)}
          >
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.08} />
                <stop offset="100%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone" dataKey="value"
              stroke={isUp ? "#22c55e" : "#ef4444"}
              strokeWidth={1.5} fill="url(#pg)" dot={false}
              activeDot={{ r: 3, fill: isUp ? "#22c55e" : "#ef4444", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time filters */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        padding: isMobile ? "0 20px 12px" : "0 0 12px",
        borderBottom: "1px solid #f5f5f5", marginBottom: 24
      }}>
        {TIME_FILTERS.map(t => (
          <button key={t} onClick={() => setActiveTime(t)} style={{
            padding: "5px 10px", borderRadius: 100, border: "none",
            background: activeTime === t ? "#111" : "transparent",
            color: activeTime === t ? "#fff" : "#aaa",
            fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: isMobile ? "0 20px" : "0" }}>

        {/* Buying Power — desktop only */}
        {!isMobile && (
          <div style={{ background: "#f8f9fa", borderRadius: 16, padding: "16px 18px", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>Buying Power</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: "#111" }}>{fmtUSD(buyingPower || 0)}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowDepositSheet(true)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, border: "none", background: "#111", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  <Plus size={14} /> Deposit
                </button>
                <button
                  onClick={() => setShowWithdrawSheet(true)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, border: "1px solid #e5e7eb", background: "#fff", color: "#111", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Withdraw
                </button>
              </div>
            </div>
            <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${totalValue > 0 ? Math.min(100, ((portfolioValue || 0) / totalValue) * 100) : 0}%`,
                background: "#111", borderRadius: 2, transition: "width 0.5s ease"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginTop: 6 }}>
              <span>Invested {fmtUSD(portfolioValue || 0)}</span>
              <span>Cash {fmtUSD(buyingPower || 0)}</span>
            </div>
          </div>
        )}

        {/* Positions */}
        {positions && positions.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 16 }}>Positions</p>
            {positions.map(pos => {
              const coin = COINS.find(c => c.symbol === pos.symbol);
              const price = prices?.[pos.symbol]?.price || 0;
              const value = pos.quantity * price;
              const cost = pos.quantity * pos.avg_buy_price;
              const gain = value - cost;
              const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
              const up = gain >= 0;
              return (
                <div
                  key={pos.id}
                  onClick={() => { if (coin) { setSelectedCoin(coin); setShowCoinDetail(true); } }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${coin?.color || "#111"}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: coin?.color || "#111", flexShrink: 0 }}>
                    {coin?.icon || pos.symbol[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{pos.symbol}</p>
                    <p style={{ fontSize: 12, color: "#aaa" }}>{fmt(pos.quantity, 4)} shares</p>
                  </div>
                  <Sparkline data={sparklines?.[pos.symbol] || []} up={up} />
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{fmtUSD(value)}</p>
                    <p style={{ fontSize: 12, color: up ? "#22c55e" : "#ef4444" }}>{up ? "+" : ""}{fmt(gainPct)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Watchlist */}
        {watchlist && watchlist.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>Watchlist</p>
              <button style={{ background: "none", border: "none", fontSize: 13, color: "#aaa", cursor: "pointer" }}>Edit</button>
            </div>
            {watchlist.map(w => {
              const coin = COINS.find(c => c.symbol === w.symbol);
              const p = prices?.[w.symbol];
              const up = (p?.change24h ?? 0) >= 0;
              return (
                <div
                  key={w.id}
                  onClick={() => { if (coin) { setSelectedCoin(coin); setShowCoinDetail(true); } }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${coin?.color || "#111"}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: coin?.color || "#111", flexShrink: 0 }}>
                    {coin?.icon || w.symbol[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{w.symbol}</p>
                    <p style={{ fontSize: 12, color: "#aaa" }}>{w.name}</p>
                  </div>
                  <Sparkline data={sparklines?.[w.symbol] || []} up={up} />
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{p ? fmtUSD(p.price) : "···"}</p>
                    <p style={{ fontSize: 12, color: up ? "#22c55e" : "#ef4444" }}>{p ? `${up ? "+" : ""}${fmt(p.change24h)}%` : "···"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Crypto List */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 16 }}>Crypto</p>
          {COINS && COINS.map(coin => {
            const p = prices?.[coin.symbol];
            const up = (p?.change24h ?? 0) >= 0;
            const isWatched = watchlist?.some(w => w.symbol === coin.symbol) || false;
            return (
              <div
                key={coin.id}
                onClick={() => { setSelectedCoin(coin); setShowCoinDetail(true); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${coin.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: coin.color, flexShrink: 0 }}>
                  {coin.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{coin.name}</p>
                  <p style={{ fontSize: 12, color: "#aaa" }}>{coin.symbol}</p>
                </div>
                <Sparkline data={sparklines?.[coin.symbol] || []} up={up} />
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{p ? fmtUSD(p.price) : "···"}</p>
                  <p style={{ fontSize: 12, color: up ? "#22c55e" : "#ef4444" }}>{p ? `${up ? "+" : ""}${fmt(p.change24h)}%` : "···"}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleWatchlist(coin); }}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #f0f0f0", background: isWatched ? "#111" : "#fff", color: isWatched ? "#fff" : "#ccc", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >+</button>
              </div>
            );
          })}
        </div>

        {/* News */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 16 }}>News</p>
          {MOCK_NEWS && MOCK_NEWS.map((n, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#aaa" }}>{n.source}</span>
                <span style={{ fontSize: 11, color: "#ddd" }}>·</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 14, color: "#111", lineHeight: 1.5, fontWeight: 500 }}>{n.title}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};