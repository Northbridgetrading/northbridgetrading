// src/components/layout/MobileLayout.jsx

import React from "react";
import {
  Home,
  Search,
  Bitcoin,
  User,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { fmtUSD, fmt } from "../../Utils/formatters";

export const MobileLayout = ({
  activeNav,
  setActiveNav,
  showCoinDetail,
  setShowSearchSheet,
  CoinDetailComponent,
  HomeFeedComponent,
  HistoryViewComponent,
  selectedCoin,
  displayPrice,
  coinPrice,
  coinChange,
  isUp,
  chartData,
  activeTime,
  setActiveTime,
  hoveredVal,
  setHoveredVal,
  ownedPosition,
  setTradeMode,
  setShowTradeSheet,
  trades,
  totalValue,
  pnl,
  pnlPct,
  buyingPower,
  portfolioValue,
  positions,
  prices,
  sparklines,
  watchlist,
  setSelectedCoin,
  setShowCoinDetail,
  toggleWatchlist,
  setShowDepositSheet,
  setShowWithdrawSheet,
  navigate,
}) => {
  const navItems = [
    {
      icon: Home,
      label: "Home",
      id: "home",
    },
    {
      icon: Bitcoin,
      label: "Crypto",
      id: "crypto",
    },
    {
      icon: Clock,
      label: "History",
      id: "history",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* APP CONTAINER */}
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          background: "#f8fafc",
          position: "relative",
          overflow: "hidden",
          paddingBottom: 100,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(18px)",
            background: "rgba(255,255,255,0.82)",
            borderBottom: "1px solid #eef2f7",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <button
            onClick={() => {
              setActiveNav("home");
              setShowCoinDetail(false);
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: "none",
              background:
                "linear-gradient(135deg,#2dd4bf,#0f766e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              boxShadow:
                "0 10px 30px rgba(20,184,166,0.22)",
            }}
          >
            N
          </button>

          {/* HEADER ACTIONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              onClick={() => setShowSearchSheet(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4b5563",
                cursor: "pointer",
                transition: "all .2s ease",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* PORTFOLIO CARD */}
        {!showCoinDetail && activeNav !== "history" && (
          <div
            style={{
              padding: "18px",
              paddingBottom: 12,
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 28,
                padding: 24,
                background:
                  "linear-gradient(135deg,#14b8a6,#0f766e)",
                color: "#fff",
                boxShadow:
                  "0 20px 40px rgba(15,118,110,0.25)",
              }}
            >
              {/* DECORATIVE BLOBS */}
              <div
                style={{
                  position: "absolute",
                  width: 140,
                  height: 140,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  top: -60,
                  right: -40,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: 100,
                  height: 100,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.05)",
                  bottom: -40,
                  left: -20,
                }}
              />

              <div style={{ position: "relative" }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    opacity: 0.8,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Portfolio Value
                </p>

                <h1
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    letterSpacing: "-1.5px",
                    marginBottom: 18,
                  }}
                >
                  {fmtUSD(totalValue || 0)}
                </h1>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background:
                        pnl >= 0
                          ? "rgba(16,185,129,0.18)"
                          : "rgba(239,68,68,0.18)",
                      border:
                        pnl >= 0
                          ? "1px solid rgba(16,185,129,0.22)"
                          : "1px solid rgba(239,68,68,0.22)",
                      padding: "8px 12px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {pnl >= 0 ? (
                      <ArrowUpRight size={15} />
                    ) : (
                      <ArrowDownRight size={15} />
                    )}

                    {fmtUSD(Math.abs(pnl || 0))}
                    ({fmt(Math.abs(pnlPct || 0))}%)
                  </div>

                  <span
                    style={{
                      fontSize: 13,
                      opacity: 0.8,
                      fontWeight: 500,
                    }}
                  >
                    All Time
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <div
          style={{
            paddingBottom: 24,
          }}
        >
          {activeNav === "history" ? (
            <HistoryViewComponent
              isMobile={true}
              trades={trades}
            />
          ) : showCoinDetail ? (
            <CoinDetailComponent
              isMobile={true}
              selectedCoin={selectedCoin}
              displayPrice={displayPrice}
              coinPrice={coinPrice}
              coinChange={coinChange}
              isUp={isUp}
              chartData={chartData}
              activeTime={activeTime}
              setActiveTime={setActiveTime}
              hoveredVal={hoveredVal}
              setHoveredVal={setHoveredVal}
              ownedPosition={ownedPosition}
              setTradeMode={setTradeMode}
              setShowTradeSheet={setShowTradeSheet}
            />
          ) : (
            <HomeFeedComponent
              isMobile={true}
              totalValue={totalValue}
              pnl={pnl}
              pnlPct={pnlPct}
              chartData={chartData}
              activeTime={activeTime}
              setActiveTime={setActiveTime}
              hoveredVal={hoveredVal}
              setHoveredVal={setHoveredVal}
              buyingPower={buyingPower}
              portfolioValue={portfolioValue}
              positions={positions}
              prices={prices}
              sparklines={sparklines}
              watchlist={watchlist}
              setSelectedCoin={setSelectedCoin}
              setShowCoinDetail={setShowCoinDetail}
              toggleWatchlist={toggleWatchlist}
              setShowDepositSheet={setShowDepositSheet}
              setShowWithdrawSheet={setShowWithdrawSheet}
            />
          )}
        </div>

        {/* BOTTOM NAV */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            maxWidth: 430,
            zIndex: 100,
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.88)",
            borderTop: "1px solid #eef2f7",
            display: "flex",
            paddingTop: 8,
            paddingBottom:
              "max(env(safe-area-inset-bottom), 10px)",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setShowCoinDetail(false);
                }}
                style={{
                  flex: 1,
                  border: "none",
                  background: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  color: isActive ? "#0f766e" : "#9ca3af",
                  padding: "8px 0",
                  cursor: "pointer",
                  transition: "all .2s ease",
                }}
              >
                <item.icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {item.label}
                </span>

                <div
                  style={{
                    width: isActive ? 5 : 0,
                    height: 5,
                    borderRadius: 999,
                    background: "#14b8a6",
                    transition: "all .2s ease",
                  }}
                />
              </button>
            );
          })}

          {/* PROFILE */}
          <button
            onClick={() => navigate("/profile")}
            style={{
              flex: 1,
              border: "none",
              background: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              color: "#9ca3af",
              padding: "8px 0",
              cursor: "pointer",
            }}
          >
            <User size={21} />

            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Profile
            </span>

            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: "transparent",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};