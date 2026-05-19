// src/components/layout/DesktopLayout.jsx
import React, { useState } from "react";
import {
  Home, Search, BarChart3, Bitcoin, Clock,
  DollarSign, ArrowUpRight, ArrowDownRight, Send,
  Settings, LogOut, TrendingUp, Wallet, Activity,
  CircleDollarSign, PieChart, Gem
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { fmtUSD, fmt } from "../../Utils/formatters";
import PortfolioView from "../portfolio/PortfolioView";

export const DesktopLayout = ({
  activeNav,
  setActiveNav,
  showCoinDetail,
  setShowSearchSheet,
  selectedCoin,
  setSelectedCoin,
  setShowTradeSheet,
  setTradeMode,
  coinPrice,
  coinChange,
  isUp,
  userName,
  prices,
  COINS,
  HomeFeedComponent,
  HistoryViewComponent,
  CoinDetailComponent,
  totalValue,
  pnl,
  pnlPct,
  chartData,
  activeTime,
  setActiveTime,
  hoveredVal,
  setHoveredVal,
  buyingPower = 0,
  portfolioValue,
  positions = [],
  watchlist,
  sparklines,
  setShowCoinDetail,
  toggleWatchlist,
  setShowDepositSheet,
  setShowWithdrawSheet,
  setShowInvestSheet,
  trades = [],
  investments = [],
  navigate
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const totalGainLoss = pnl || 0;
  const totalGainLossPct = pnlPct || 0;
  const investedPercentage = totalValue > 0 
    ? Math.min(100, ((portfolioValue || 0) / totalValue) * 100) 
    : 0;

  const navItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Search, label: "Search", id: "search", action: () => setShowSearchSheet(true) },
    { icon: BarChart3, label: "Markets", id: "markets" },
    { icon: PieChart, label: "Portfolio", id: "portfolio" },
    { icon: Clock, label: "History", id: "history" }
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans antialiased">
      {/* Left Sidebar */}
      <aside className="w-[72px] min-w-[72px] shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8 h-screen z-10">
        <button 
          onClick={() => { setActiveNav("home"); setShowCoinDetail(false); }}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl cursor-pointer shrink-0 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Home"
        >
          <TrendingUp size={22} strokeWidth={2.5} />
        </button>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = activeNav === item.id && !item.action;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveNav(item.id);
                    setShowCoinDetail(false);
                  }
                }}
                aria-label={item.label}
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                  transition-all duration-200 relative group
                  ${isActive 
                    ? "bg-teal-50 text-teal-600 shadow-sm ring-1 ring-teal-100" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }
                `}
              >
                <item.icon 
                  size={isActive ? 22 : 20} 
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`
              w-11 h-11 rounded-full border-2 flex items-center justify-center 
              text-sm font-bold text-gray-700 shrink-0
              transition-all duration-200
              ${isProfileMenuOpen 
                ? "border-teal-500 bg-teal-50 ring-4 ring-teal-100 shadow-md" 
                : "border-gray-200 bg-gradient-to-br from-gray-100 to-gray-50 hover:border-teal-400 hover:shadow-md"
              }
            `}
          >
            {userName?.charAt(0).toUpperCase() || "U"}
          </button>

          {isProfileMenuOpen && (
            <>
              <div
                onClick={() => setIsProfileMenuOpen(false)}
                className="fixed inset-0 z-30"
              />
              
              <div className="fixed bottom-6 left-20 bg-white rounded-2xl shadow-xl shadow-gray-900/10 py-2 min-w-[220px] z-40 border border-gray-100 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                        {userName || "Investor"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Manage your account</p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { navigate("/profile"); setIsProfileMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 font-medium"
                  >
                    <Settings size={17} className="text-gray-400" />
                    Profile Settings
                  </button>

                  <button
                    onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 flex items-center gap-3 hover:bg-red-50 transition-colors duration-150 font-medium"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Main Feed */}
        <main className="flex-1 min-w-0 bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden">
          {activeNav === "history" ? (
            <HistoryViewComponent isMobile={false} trades={trades} />
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
          ) : showCoinDetail ? (
            <CoinDetailComponent
              isMobile={false}
              selectedCoin={selectedCoin}
              displayPrice={hoveredVal ?? coinPrice}
              coinPrice={coinPrice}
              coinChange={coinChange}
              isUp={isUp}
              chartData={chartData}
              activeTime={activeTime}
              setActiveTime={setActiveTime}
              hoveredVal={hoveredVal}
              setHoveredVal={setHoveredVal}
              ownedPosition={positions?.find(p => p.symbol === selectedCoin?.symbol)}
              setTradeMode={setTradeMode}
              setShowTradeSheet={setShowTradeSheet}
            />
          ) : (
            <HomeFeedComponent
              isMobile={false}
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
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 min-w-[320px] shrink-0 bg-gray-50/50 backdrop-blur-sm p-6 overflow-y-auto overflow-x-hidden">
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Welcome back</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {userName?.split(" ")[0] || "Investor"}
            </h2>
          </div>

          <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-2xl p-6 mb-6 text-white shadow-xl shadow-teal-500/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-4 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <PieChart size={16} className="opacity-80" />
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Portfolio Value</p>
              </div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight tabular-nums">
                {fmtUSD(totalValue || 0)}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                  backdrop-blur-sm border
                  ${totalGainLoss >= 0 
                    ? "bg-emerald-400/20 border-emerald-300/30" 
                    : "bg-red-400/20 border-red-300/30"
                  }
                `}>
                  {totalGainLoss >= 0 ? (
                    <ArrowUpRight size={16} className="text-emerald-300" strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-300" strokeWidth={2.5} />
                  )}
                  <span className="tabular-nums">
                    {totalGainLoss >= 0 ? "+" : "-"}{fmtUSD(Math.abs(totalGainLoss))}
                    <span className="ml-1 opacity-80">
                      ({fmt(Math.abs(totalGainLossPct))}%)
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={14} className="opacity-60" />
                  <span className="text-xs font-medium opacity-75">All time</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={18} className="text-teal-500" strokeWidth={2} />
              <p className="text-sm font-semibold text-gray-900">Cash Management</p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Buying Power</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">{fmtUSD(buyingPower || 0)}</p>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowDepositSheet(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-teal-500/10"
              >
                <CircleDollarSign size={16} strokeWidth={2} />
                Deposit
              </button>
              <button
                onClick={() => setShowWithdrawSheet(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
              >
                <Send size={16} strokeWidth={2} />
                Withdraw
              </button>
            </div>

            {/* Invest Button */}
            <button
              onClick={() => setShowInvestSheet && setShowInvestSheet(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold hover:from-purple-600 hover:to-purple-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-purple-500/20"
            >
              <TrendingUp size={16} strokeWidth={2} />
              Invest Now
            </button>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-gray-500">Portfolio Allocation</span>
                <span className="text-gray-900 font-semibold tabular-nums">{Math.round(investedPercentage)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${investedPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Invested: {fmtUSD(portfolioValue || 0)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span>Cash: {fmtUSD(buyingPower || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-gray-400" strokeWidth={2} />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{trades?.length || 0}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Assets</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{positions?.length || 0}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-400" strokeWidth={2} />
              Top Movers
            </h3>
            <div className="flex flex-col gap-1">
              {COINS && COINS.slice(0, 3).map((coin, index) => {
                const p = prices?.[coin.symbol];
                const up = (p?.change24h ?? 0) >= 0;
                const isSelected = selectedCoin?.symbol === coin.symbol;
                
                return (
                  <div
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin)}
                    className={`
                      flex items-center justify-between p-3 rounded-xl cursor-pointer
                      transition-all duration-200 bg-white border
                      ${isSelected 
                        ? "border-teal-200 bg-teal-50/50 shadow-sm ring-1 ring-teal-100" 
                        : "border-transparent hover:border-gray-200 hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-bold"
                          style={{ 
                            background: `linear-gradient(135deg, ${coin.color}20, ${coin.color}10)`,
                            color: coin.color 
                          }}
                        >
                          {coin.icon}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                            <TrendingUp size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">{coin.symbol}</p>
                        <p className="text-xs text-gray-500 font-medium truncate">{coin.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-bold text-gray-900 tabular-nums leading-tight">
                        {p ? fmtUSD(p.price) : "—"}
                      </p>
                      <p className={`text-xs font-semibold mt-1 tabular-nums ${
                        up ? "text-emerald-500" : "text-red-500"
                      }`}>
                        {p ? `${up ? "↑" : "↓"} ${fmt(Math.abs(p.change24h))}%` : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-bounceIn { animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>
    </div>
  );
};