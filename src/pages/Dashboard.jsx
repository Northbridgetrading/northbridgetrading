// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Utils
import { COINS, STARTING_BALANCE } from "../Utils/constants";
import { fmtUSD, fmt } from "../Utils/formatters";

// Hooks
import { useIsMobile } from "../hooks/useIsMobile";
import { usePrices } from "../hooks/usePrices";
import { useSparklines } from "../hooks/useSparklines";
import { useChartData } from "../hooks/useChartData";
import { useDepositListener } from "../hooks/useDepositListener";

// Components
import { DesktopLayout } from "../components/layout/DesktopLayout";
import { MobileLayout } from "../components/layout/MobileLayout";
import { HomeFeed } from "../components/dashboard/HomeFeed";
import { HistoryView } from "../components/dashboard/HistoryView";
import { CoinDetail } from "../components/dashboard/CoinDetail";
import { TradeSheet } from "../components/Sheets/TradeSheet";
import { DepositSheet } from "../components/Sheets/DepositSheet";
import { WithdrawSheet } from "../components/Sheets/WithdrawSheet";
import { SearchSheet } from "../components/Sheets/SearchSheet";
import { InvestSheet } from "../components/Sheets/InvestSheet";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { calculateInvestmentState } from "../Utils/investmentUtils";

export default function Dashboard({ session }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const user = session?.user;
  const userId = user?.id;
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Investor";

  // State
  const [dbLoaded, setDbLoaded] = useState(false);
  const [positions, setPositions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [trades, setTrades] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [buyingPower, setBuyingPower] = useState(STARTING_BALANCE);
  const [totalDeposited, setTotalDeposited] = useState(STARTING_BALANCE);
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [activeNav, setActiveNav] = useState("home");
  const [activeTime, setActiveTime] = useState("1D");
  const [hoveredVal, setHoveredVal] = useState(null);
  const [showTradeSheet, setShowTradeSheet] = useState(false);
  const [showCoinDetail, setShowCoinDetail] = useState(false);
  const [showDepositSheet, setShowDepositSheet] = useState(false);
  const [showWithdrawSheet, setShowWithdrawSheet] = useState(false);
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [showInvestSheet, setShowInvestSheet] = useState(false);
  const [tradeMode, setTradeMode] = useState("buy");
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);

  // Custom hooks
  const prices = usePrices();
  const { sparklines } = useSparklines();
  const { chartData } = useChartData(selectedCoin, activeTime);

  // Load user data from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        const [
          { data: profile },
          { data: pos },
          { data: wl },
          { data: tr },
          { data: inv }
        ] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).single(),
          supabase.from("positions").select("*").eq("user_id", userId),
          supabase.from("watchlist").select("*").eq("user_id", userId),
          supabase.from("trades").select("*").eq("user_id", userId)
            .order("created_at", { ascending: false }).limit(20),
          supabase.from("investments").select("*").eq("user_id", userId)
            .order("created_at", { ascending: false })
        ]);
        
        if (profile) {
          setBuyingPower(profile.buying_power ?? STARTING_BALANCE);
          setTotalDeposited(profile.total_deposited ?? STARTING_BALANCE);
        }
        setPositions(pos || []);
        setWatchlist(wl || []);
        setTrades(tr || []);
        setInvestments(inv || []);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setDbLoaded(true);
      }
    };
    
    loadUserData();
  }, [userId]);

  // Notifications
  const notify = useCallback((msg, type = "success") => {
    clearTimeout(notifTimer.current);
    setNotification({ msg, type });
    notifTimer.current = setTimeout(() => setNotification(null), 3500);
  }, []);


  // Realtime deposit listener
  useDepositListener(
  userId,
  (deposit) => {
    // Play a success chime
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.setValueAtTime(523, ctx.currentTime);
    o.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    o.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.6);

    setBuyingPower(prev => prev + deposit.amount);
    setTotalDeposited(prev => prev + deposit.amount);
    notify(`🎉 Deposit of ${fmtUSD(deposit.amount)} approved!`, "success");
  },
  (deposit) => {
    notify(`Your deposit of ${fmtUSD(deposit.amount)} was rejected. Contact support.`, "error");
  }
);

  // Toggle Watchlist
  const toggleWatchlist = useCallback(async (coin) => {
    const existing = watchlist.find(w => w.symbol === coin.symbol);
    if (existing) {
      await supabase.from("watchlist").delete().eq("id", existing.id);
      setWatchlist(prev => prev.filter(w => w.symbol !== coin.symbol));
      notify(`${coin.symbol} removed from watchlist`, "success");
    } else {
      const { data } = await supabase.from("watchlist").insert({
        user_id: userId,
        symbol: coin.symbol,
        name: coin.name,
        asset_type: "crypto"
      }).select().single();
      if (data) {
        setWatchlist(prev => [...prev, data]);
        notify(`${coin.symbol} added to watchlist`, "success");
      }
    }
  }, [watchlist, userId, notify]);

  // Calculate portfolio values
  const portfolioValue = positions.reduce(
    (a, p) => a + (prices[p.symbol]?.price || 0) * p.quantity, 
    0
  );
  const totalValue = buyingPower + portfolioValue;
  const pnl = totalValue - totalDeposited;
  const pnlPct = totalDeposited > 0 ? (pnl / totalDeposited) * 100 : 0;

  // Selected coin data
  const coinPrice = prices[selectedCoin.symbol]?.price;
  const coinChange = prices[selectedCoin.symbol]?.change24h;
  const displayPrice = hoveredVal ?? coinPrice;
  const isUp = (coinChange ?? 0) >= 0;
  const ownedPosition = positions.find(p => p.symbol === selectedCoin.symbol);
  const maxSellValue = ownedPosition ? ownedPosition.quantity * (coinPrice || 0) : 0;

  // Handle Trade
  const handleTrade = async (mode, amount) => {
    const price = coinPrice;
    if (!price) {
      notify("Price unavailable", "error");
      return false;
    }
    
    const dollars = parseFloat(amount);
    if (!dollars || dollars <= 0) {
      notify("Enter a valid amount", "error");
      return false;
    }
    
    if (mode === "buy") {
      if (dollars > buyingPower) {
        notify("Insufficient buying power", "error");
        return false;
      }
      
      const qty = dollars / price;
      const newBP = buyingPower - dollars;
      const existing = positions.find(p => p.symbol === selectedCoin.symbol);
      const newAvg = existing
        ? ((existing.avg_buy_price * existing.quantity) + (price * qty)) / (existing.quantity + qty)
        : price;
      const newQty = (existing?.quantity || 0) + qty;
      
      setBuyingPower(newBP);
      
      const { data: upserted } = await supabase.from("positions").upsert({
        user_id: userId,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        asset_type: "crypto",
        quantity: newQty,
        avg_buy_price: newAvg,
        ...(existing ? { id: existing.id } : {})
      }, { onConflict: "user_id,symbol" }).select().single();
      
      if (upserted) {
        setPositions(prev => {
          const filtered = prev.filter(p => p.symbol !== selectedCoin.symbol);
          return [...filtered, upserted];
        });
      }
      
      const { data: trade } = await supabase.from("trades").insert({
        user_id: userId,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        asset_type: "crypto",
        trade_type: "buy",
        quantity: qty,
        price,
        total: dollars
      }).select().single();
      
      if (trade) setTrades(prev => [trade, ...prev]);
      
      await supabase.from("profiles").update({ 
        buying_power: newBP
      }).eq("id", userId);
      
      notify(`Bought ${fmtUSD(dollars)} of ${selectedCoin.symbol}`, "success");
      return true;
      
    } else {
      if (!ownedPosition) {
        notify("You don't own this asset", "error");
        return false;
      }
      
      const maxSell = ownedPosition.quantity * price;
      if (dollars > maxSell) {
        notify(`Max sell: ${fmtUSD(maxSell)}`, "error");
        return false;
      }
      
      const qty = dollars / price;
      const newQty = ownedPosition.quantity - qty;
      const newBP = buyingPower + dollars;
      
      setBuyingPower(newBP);
      
      if (newQty <= 0.000001) {
        await supabase.from("positions").delete().eq("id", ownedPosition.id);
        setPositions(prev => prev.filter(p => p.symbol !== selectedCoin.symbol));
      } else {
        const { data: updated } = await supabase.from("positions")
          .update({ quantity: newQty }).eq("id", ownedPosition.id).select().single();
        if (updated) {
          setPositions(prev => prev.map(p => p.symbol === selectedCoin.symbol ? updated : p));
        }
      }
      
      const { data: trade } = await supabase.from("trades").insert({
        user_id: userId,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        asset_type: "crypto",
        trade_type: "sell",
        quantity: qty,
        price,
        total: dollars
      }).select().single();
      
      if (trade) setTrades(prev => [trade, ...prev]);
      
      await supabase.from("profiles").update({ 
        buying_power: newBP
      }).eq("id", userId);
      
      notify(`Sold ${fmtUSD(dollars)} of ${selectedCoin.symbol}`, "success");
      return true;
    }
  };

  // Handle Deposit
  const handleDeposit = async (amount) => {
    try {
      const depositAmount = parseFloat(amount);
      
      if (!depositAmount || depositAmount <= 0) {
        notify("Please enter a valid amount", "error");
        return false;
      }
      
      if (depositAmount > 50000) {
        notify("Maximum deposit is $50,000 per transaction", "error");
        return false;
      }
      
      const newBuyingPower = buyingPower + depositAmount;
      const newTotalDeposited = totalDeposited + depositAmount;
      
      setBuyingPower(newBuyingPower);
      setTotalDeposited(newTotalDeposited);
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          buying_power: newBuyingPower,
          total_deposited: newTotalDeposited,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      try {
        await supabase.from("transactions").insert({
          user_id: userId,
          type: "deposit",
          amount: depositAmount,
          status: "completed",
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Transaction logging failed:", err);
      }
      
      notify(`Successfully deposited ${fmtUSD(depositAmount)}!`, "success");
      return true;
      
    } catch (error) {
      console.error("Deposit failed:", error);
      notify("Deposit failed. Please try again.", "error");
      return false;
    }
  };

  // Handle Withdraw
  const handleWithdraw = async (amount, address) => {
    try {
      const withdrawAmount = parseFloat(amount);
      const networkFee = 5;
      const totalCost = withdrawAmount + networkFee;
      
      if (!withdrawAmount || withdrawAmount <= 0) {
        notify("Please enter a valid amount", "error");
        return false;
      }
      
      if (withdrawAmount < 100) {
        notify("Minimum withdrawal is $100", "error");
        return false;
      }
      
      if (totalCost > buyingPower) {
        notify(`Insufficient funds including network fee. Need ${fmtUSD(totalCost)}`, "error");
        return false;
      }
      
      if (!address || address.length < 26) {
        notify("Please enter a valid Bitcoin address", "error");
        return false;
      }
      
      const newBuyingPower = buyingPower - totalCost;
      setBuyingPower(newBuyingPower);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          buying_power: newBuyingPower,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
      
      if (error) throw error;
      
      await supabase.from("transactions").insert({
        user_id: userId,
        type: "withdrawal",
        amount: withdrawAmount,
        status: "completed",
        payment_method: "bitcoin",
        crypto_address: address,
        network_fee: networkFee,
        created_at: new Date().toISOString()
      });
      
      notify(`Successfully withdrew ${fmtUSD(withdrawAmount)}`, "success");
      return true;
      
    } catch (error) {
      console.error("Withdrawal failed:", error);
      notify("Withdrawal failed. Please try again.", "error");
      return false;
    }
  };

  // Handle Investment
  const handleInvest = async (plan, amount) => {
    try {
      const investedAmount = parseFloat(amount);
      
      if (!investedAmount || investedAmount <= 0) {
        notify("Please enter a valid amount", "error");
        return false;
      }
      
      if (investedAmount > buyingPower) {
        notify("Insufficient funds", "error");
        return false;
      }
      
      if (investedAmount < plan.minAmount) {
        notify(`Minimum investment is ${fmtUSD(plan.minAmount)}`, "error");
        return false;
      }
      
      let daysToAdd = 30;
      if (plan.term === "60 days") daysToAdd = 60;
      if (plan.term === "90 days") daysToAdd = 90;
      
      const maturityDate = new Date();
      maturityDate.setDate(maturityDate.getDate() + daysToAdd);
      
      const newBuyingPower = buyingPower - investedAmount;
      setBuyingPower(newBuyingPower);
      
      const { data: newInvestment, error: investError } = await supabase
        .from("investments")
        .insert({
          user_id: userId,
          plan_name: plan.name,
          amount: investedAmount,
          expected_return_percent: plan.returnValue,
          term_days: daysToAdd,
          status: "active",
          invested_at: new Date().toISOString(),
          maturity_date: maturityDate.toISOString(),
          current_value: investedAmount,
          returns_earned: 0
        })
        .select()
        .single();
      
      if (investError) throw investError;
      
      await supabase.from("profiles").update({ 
        buying_power: newBuyingPower,
        updated_at: new Date().toISOString()
      }).eq("id", userId);
      
      await supabase.from("transactions").insert({
        user_id: userId,
        type: "investment",
        amount: investedAmount,
        status: "completed",
        metadata: { plan_name: plan.name, term: plan.term },
        created_at: new Date().toISOString()
      });
      
      setInvestments(prev => [newInvestment, ...prev]);
      
      notify(`Successfully invested ${fmtUSD(investedAmount)} in ${plan.name}!`, "success");
      return true;
      
    } catch (error) {
      console.error("Investment failed:", error);
      notify("Investment failed. Please try again.", "error");
      return false;
    }
  };

  const handleClaimInvestment = async (investment) => {
  try {
    const calculated = calculateInvestmentState(investment);
    const payout = calculated.finalPayout;

    const newBuyingPower = buyingPower + payout;
    setBuyingPower(newBuyingPower);

    await supabase.from("investments").update({
      status: "completed",
      current_value: payout,
      returns_earned: payout - investment.amount,
    }).eq("id", investment.id);

    await supabase.from("profiles").update({
      buying_power: newBuyingPower,
      updated_at: new Date().toISOString()
    }).eq("id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      type: "investment_payout",
      amount: payout,
      status: "completed",
      metadata: { plan_name: investment.plan_name, investment_id: investment.id },
      created_at: new Date().toISOString()
    });

    setInvestments(prev => prev.map(inv =>
      inv.id === investment.id ? { ...inv, status: "completed", current_value: payout } : inv
    ));

    notify(`🎉 Claimed ${fmtUSD(payout)} from ${investment.plan_name}!`, "success");
    return true;

  } catch (error) {
    console.error("Claim failed:", error);
    notify("Failed to claim investment. Please try again.", "error");
    return false;
  }
};

  if (!dbLoaded) return <LoadingSpinner />;

  // Common props to pass to layouts
  const commonProps = {
    activeNav,
    setActiveNav,
    showCoinDetail,
    setShowCoinDetail,
    selectedCoin,
    setSelectedCoin,
    setShowTradeSheet,
    setTradeMode,
    coinPrice,
    handleClaimInvestment,
    coinChange,
    isUp,
    displayPrice,
    userName,
    saving,
    prices,
    COINS,
    totalValue,
    pnl,
    pnlPct,
    chartData,
    activeTime,
    setActiveTime,
    hoveredVal,
    setHoveredVal,
    buyingPower,
    portfolioValue,
    userId,
    positions,
    watchlist,
    sparklines,
    trades,
    navigate,
    ownedPosition,
    setShowDepositSheet,
    setShowWithdrawSheet,
    setShowSearchSheet,
    setShowInvestSheet,
    toggleWatchlist,
    HomeFeedComponent: HomeFeed,
    HistoryViewComponent: HistoryView,
    CoinDetailComponent: CoinDetail
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#f9fafb",
      color: "#111827",
      minHeight: "100vh",
      WebkitFontSmoothing: "antialiased"
    }}>
      {!isMobile ? (
        <DesktopLayout {...commonProps} />
      ) : (
        <MobileLayout {...commonProps} />
      )}

      {/* Sheets */}
      {showTradeSheet && (
        <TradeSheet
          isOpen={showTradeSheet}
          onClose={() => setShowTradeSheet(false)}
          selectedCoin={selectedCoin}
          coinPrice={coinPrice}
          tradeMode={tradeMode}
          setTradeMode={setTradeMode}
          buyingPower={buyingPower}
          ownedPosition={ownedPosition}
          maxSellValue={maxSellValue}
          onTrade={handleTrade}
          notification={notification}
        />
      )}
      
      {showDepositSheet && (
  <DepositSheet
    isOpen={showDepositSheet}
    onClose={() => setShowDepositSheet(false)}
    userId={userId}
  />
)}
      
      {showWithdrawSheet && (
        <WithdrawSheet
          isOpen={showWithdrawSheet}
          onClose={() => setShowWithdrawSheet(false)}
          buyingPower={buyingPower}
          onWithdraw={async (amount, address) => {
            const success = await handleWithdraw(amount, address);
            if (success) setShowWithdrawSheet(false);
            return success;
          }}
        />
      )}
      
      {showSearchSheet && (
        <SearchSheet
          isOpen={showSearchSheet}
          onClose={() => setShowSearchSheet(false)}
          positions={positions}
          prices={prices}
          setSelectedCoin={setSelectedCoin}
          setShowCoinDetail={setShowCoinDetail}
        />
      )}

      {showInvestSheet && (
        <InvestSheet
          isOpen={showInvestSheet}
          onClose={() => setShowInvestSheet(false)}
          buyingPower={buyingPower}
          onInvest={handleInvest}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2000,
          animation: "slideUp 0.3s ease"
        }}>
          <div style={{
            padding: "12px 20px",
            borderRadius: 12,
            background: notification.type === "success" ? "#10b981" : "#ef4444",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            {notification.type === "success" ? "✓" : "⚠️"}
            {notification.msg}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}