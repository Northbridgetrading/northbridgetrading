// src/components/layout/MobileLayout.jsx

import React, { useState } from "react";
import {
  Home, Search, User, Clock,
  ArrowUpRight, ArrowDownRight, TrendingUp,
  Wallet, CircleDollarSign, Send, PieChart,
  Activity, Settings, LogOut, BarChart3
} from "lucide-react";
import { fmtUSD, fmt } from "../../Utils/formatters";
import { COINS } from "../../Utils/constants";
import PortfolioView from "../Portfolio/PortfolioView";

export const MobileLayout = ({
  activeNav, setActiveNav, showCoinDetail,
  setShowSearchSheet, CoinDetailComponent,
  HomeFeedComponent, HistoryViewComponent,
  selectedCoin, displayPrice, coinPrice,
  coinChange, isUp, chartData, activeTime,
  setActiveTime, hoveredVal, setHoveredVal,
  ownedPosition, setTradeMode, setShowTradeSheet,
  trades, totalValue, pnl, pnlPct, buyingPower,
  portfolioValue, positions, prices, sparklines,
  watchlist, setSelectedCoin, setShowCoinDetail,
  toggleWatchlist, setShowDepositSheet,
  setShowWithdrawSheet, setShowInvestSheet,
  navigate, userName, investments,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const totalGainLoss = pnl || 0;
  const totalGainLossPct = pnlPct || 0;
  const investedPercentage = totalValue > 0
    ? Math.min(100, ((portfolioValue || 0) / totalValue) * 100)
    : 0;

  const navItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: BarChart3, label: "Markets", id: "markets" },
    { icon: PieChart, label: "Portfolio", id: "portfolio" },
    { icon: Clock, label: "History", id: "history" },
  ];

  const isHomePage = !showCoinDetail && activeNav === "home";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: "#f8fafc", position: "relative", overflow: "hidden", paddingBottom: 100 }}>

        {/* HEADER */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(18px)", background: "rgba(255,255,255,0.82)", borderBottom: "1px solid #eef2f7", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => { setActiveNav("home"); setShowCoinDetail(false); }}
            style={{ width: 40, height: 40, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#2dd4bf,#0f766e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 10px 30px rgba(20,184,166,0.22)" }}
          >
            N
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setShowSearchSheet(true)}
              style={{ width: 40, height: 40, borderRadius: 14, border: "1px solid #e5e7eb", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", cursor: "pointer" }}
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ width: 40, height: 40, borderRadius: "50%", border: showProfileMenu ? "2px solid #14b8a6" : "2px solid #e5e7eb", background: showProfileMenu ? "#f0fdfa" : "linear-gradient(135deg,#f3f4f6,#e5e7eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              {userName?.charAt(0).toUpperCase() || "U"}
            </button>
          </div>
        </div>

        {/* PROFILE MENU DROPDOWN */}
        {showProfileMenu && (
          <>
            <div onClick={() => setShowProfileMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div style={{ position: "fixed", top: 70, right: 18, background: "#fff", borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.12)", border: "1px solid #f1f5f9", minWidth: 220, zIndex: 50, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#2dd4bf,#0f766e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                  {userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{userName || "Investor"}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Manage your account</p>
                </div>
              </div>
              <button
                onClick={() => { navigate("/profile"); setShowProfileMenu(false); }}
                style={{ width: "100%", padding: "12px 16px", border: "none", background: "none", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#374151", fontWeight: 500, cursor: "pointer", textAlign: "left" }}
              >
                <Settings size={17} color="#9ca3af" /> Profile Settings
              </button>
              <button
                onClick={async () => { const { supabase } = await import("../../supabaseClient"); await supabase.auth.signOut(); navigate("/signin"); setShowProfileMenu(false); }}
                style={{ width: "100%", padding: "12px 16px", border: "none", background: "none", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#ef4444", fontWeight: 500, cursor: "pointer", textAlign: "left" }}
              >
                <LogOut size={17} color="#ef4444" /> Sign Out
              </button>
            </div>
          </>
        )}

        {/* PAGE CONTENT */}
        <div style={{ paddingBottom: 24 }}>
          {activeNav === "history" ? (
            <HistoryViewComponent isMobile={true} trades={trades} />

          ) : activeNav === "portfolio" ? (
            <PortfolioView
              positions={positions}
              prices={prices}
              buyingPower={buyingPower}
              totalValue={totalValue}
              pnl={pnl}
              pnlPct={pnlPct}
              setSelectedCoin={setSelectedCoin}
              setShowCoinDetail={setShowCoinDetail}
              setShowDepositSheet={setShowDepositSheet}
              setShowInvestSheet={setShowInvestSheet}
              setShowWithdrawSheet={setShowWithdrawSheet}
              investments={investments}
            />

          ) : activeNav === "markets" ? (
            <div style={{ padding: "24px 18px" }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Markets</p>
              {COINS && COINS.map(coin => {
                const p = prices?.[coin.symbol];
                const up = (p?.change24h ?? 0) >= 0;
                return (
                  <div
                    key={coin.id}
                    onClick={() => { setSelectedCoin(coin); setShowCoinDetail(true); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, background: `linear-gradient(135deg,${coin.color}20,${coin.color}10)`, color: coin.color }}>
                      {coin.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{coin.name}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{coin.symbol}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{p ? fmtUSD(p.price) : "—"}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: up ? "#10b981" : "#ef4444", margin: "4px 0 0" }}>
                        {p ? `${up ? "+" : ""}${fmt(p.change24h)}%` : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : showCoinDetail ? (
            <CoinDetailComponent
              isMobile={true} selectedCoin={selectedCoin}
              displayPrice={displayPrice} coinPrice={coinPrice}
              coinChange={coinChange} isUp={isUp} chartData={chartData}
              activeTime={activeTime} setActiveTime={setActiveTime}
              hoveredVal={hoveredVal} setHoveredVal={setHoveredVal}
              ownedPosition={ownedPosition} setTradeMode={setTradeMode}
              setShowTradeSheet={setShowTradeSheet}
            />

          ) : (
            <div>
              {/* PORTFOLIO CARD */}
              <div style={{ padding: "18px 18px 12px" }}>
                <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, padding: 24, background: "linear-gradient(135deg,#14b8a6,#0f766e)", color: "#fff", boxShadow: "0 20px 40px rgba(15,118,110,0.25)" }}>
                  <div style={{ position: "absolute", width: 140, height: 140, borderRadius: 999, background: "rgba(255,255,255,0.06)", top: -60, right: -40 }} />
                  <div style={{ position: "absolute", width: 100, height: 100, borderRadius: 999, background: "rgba(255,255,255,0.05)", bottom: -40, left: -20 }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <PieChart size={16} style={{ opacity: 0.8 }} />
                      <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.9, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>Portfolio Value</p>
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.5px", margin: "0 0 18px" }}>
                      {fmtUSD(totalValue || 0)}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, background: totalGainLoss >= 0 ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)", border: totalGainLoss >= 0 ? "1px solid rgba(16,185,129,0.22)" : "1px solid rgba(239,68,68,0.22)", padding: "8px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                        {totalGainLoss >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                        {fmtUSD(Math.abs(totalGainLoss))} ({fmt(Math.abs(totalGainLossPct))}%)
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Activity size={14} style={{ opacity: 0.6 }} />
                        <span style={{ fontSize: 13, opacity: 0.75, fontWeight: 500 }}>All time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CASH MANAGEMENT */}
              <div style={{ padding: "0 18px 16px" }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Wallet size={18} color="#14b8a6" strokeWidth={2} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>Cash Management</p>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Buying Power</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>{fmtUSD(buyingPower || 0)}</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <button
                      onClick={() => setShowDepositSheet(true)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#14b8a6,#0f766e)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                    >
                      <CircleDollarSign size={16} strokeWidth={2} /> Deposit
                    </button>
                    <button
                      onClick={() => setShowWithdrawSheet(true)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 12, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                    >
                      <Send size={16} strokeWidth={2} /> Withdraw
                    </button>
                  </div>
                  <button
                    onClick={() => setShowInvestSheet && setShowInvestSheet(true)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                  >
                    <TrendingUp size={16} strokeWidth={2} /> Invest Now
                  </button>

                  {/* ALLOCATION BAR */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                      <span style={{ color: "#6b7280" }}>Portfolio Allocation</span>
                      <span style={{ color: "#111827", fontWeight: 600 }}>{Math.round(investedPercentage)}%</span>
                    </div>
                    <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${investedPercentage}%`, background: "linear-gradient(90deg,#2dd4bf,#0f766e)", borderRadius: 999, transition: "width 0.7s ease" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#14b8a6" }} />
                        Invested: {fmtUSD(portfolioValue || 0)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d1d5db" }} />
                        Cash: {fmtUSD(buyingPower || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK STATS */}
              <div style={{ padding: "0 18px 16px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Activity size={16} color="#9ca3af" /> Quick Stats
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Total Trades</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>{trades?.length || 0}</p>
                  </div>
                  <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Assets</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>{positions?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* TOP MOVERS */}
              <div style={{ padding: "0 18px 16px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={16} color="#9ca3af" /> Top Movers
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {COINS && COINS.slice(0, 3).map((coin, index) => {
                    const p = prices?.[coin.symbol];
                    const up = (p?.change24h ?? 0) >= 0;
                    const isSelected = selectedCoin?.symbol === coin.symbol;
                    return (
                      <div
                        key={coin.id}
                        onClick={() => { setSelectedCoin(coin); setShowCoinDetail(true); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 16, cursor: "pointer", background: isSelected ? "#f0fdfa" : "#fff", border: isSelected ? "1px solid #99f6e4" : "1px solid transparent", transition: "all 0.2s" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ position: "relative" }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, background: `linear-gradient(135deg,${coin.color}20,${coin.color}10)`, color: coin.color }}>
                              {coin.icon}
                            </div>
                            {index === 0 && (
                              <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#14b8a6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <TrendingUp size={10} color="#fff" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{coin.symbol}</p>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{coin.name}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{p ? fmtUSD(p.price) : "—"}</p>
                          <p style={{ fontSize: 12, fontWeight: 600, color: up ? "#10b981" : "#ef4444", margin: "4px 0 0" }}>
                            {p ? `${up ? "↑" : "↓"} ${fmt(Math.abs(p.change24h))}%` : "—"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HOME FEED */}
              <HomeFeedComponent
                isMobile={true} totalValue={totalValue} pnl={pnl} pnlPct={pnlPct}
                chartData={chartData} activeTime={activeTime} setActiveTime={setActiveTime}
                hoveredVal={hoveredVal} setHoveredVal={setHoveredVal}
                buyingPower={buyingPower} portfolioValue={portfolioValue}
                positions={positions} prices={prices} sparklines={sparklines}
                watchlist={watchlist} setSelectedCoin={setSelectedCoin}
                setShowCoinDetail={setShowCoinDetail} toggleWatchlist={toggleWatchlist}
                setShowDepositSheet={setShowDepositSheet} setShowWithdrawSheet={setShowWithdrawSheet}
              />
            </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: 430, zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.88)", borderTop: "1px solid #eef2f7", display: "flex", paddingTop: 8, paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setShowCoinDetail(false); }}
                style={{ flex: 1, border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, color: isActive ? "#0f766e" : "#9ca3af", padding: "8px 0", cursor: "pointer", transition: "all .2s ease" }}
              >
                <item.icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
                <div style={{ width: isActive ? 5 : 0, height: 5, borderRadius: 999, background: "#14b8a6", transition: "all .2s ease" }} />
              </button>
            );
          })}
          <button
            onClick={() => navigate("/profile")}
            style={{ flex: 1, border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, color: "#9ca3af", padding: "8px 0", cursor: "pointer" }}
          >
            <User size={21} />
            <span style={{ fontSize: 11, fontWeight: 500 }}>Profile</span>
            <div style={{ width: 5, height: 5, borderRadius: 999, background: "transparent" }} />
          </button>
        </div>

      </div>
    </div>
  );
};