// src/components/dashboard/HistoryView.jsx
import React, { useState, useEffect } from "react";
import { fmt, fmtUSD } from "../../Utils/formatters";
import { supabase } from "../../supabaseClient";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const DepositHistory = ({ userId }) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("deposit_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setDeposits(data || []);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel(`deposit_history:${userId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "deposit_requests",
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        setDeposits(prev =>
          prev.map(d => d.id === payload.new.id ? { ...d, ...payload.new } : d)
        );
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  const StatusBadge = ({ status }) => {
    const config = {
      pending:  { bg: "#fef3c7", color: "#92400e", icon: <Clock size={11} />,        label: "Pending" },
      approved: { bg: "#d1fae5", color: "#065f46", icon: <CheckCircle size={11} />,  label: "Approved" },
      rejected: { bg: "#fee2e2", color: "#991b1b", icon: <XCircle size={11} />,      label: "Rejected" },
    };
    const c = config[status] || config.pending;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: c.bg, color: c.color,
        padding: "3px 9px", borderRadius: 100,
        fontSize: 11, fontWeight: 600
      }}>
        {c.icon} {c.label}
      </span>
    );
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ width: 22, height: 22, border: "2px solid #e5e7eb", borderTopColor: "#1D9E75", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }} />
    </div>
  );

  if (deposits.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>₿</div>
      <p style={{ color: "#aaa", fontSize: 14 }}>No deposits yet</p>
    </div>
  );

  return (
    <div>
      {deposits.map(dep => (
        <div key={dep.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 0", borderBottom: "1px solid #f5f5f5"
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "#FAEEDA", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 18
          }}>₿</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>
              Fund Deposit
            </p>
            <p style={{ fontSize: 12, color: "#aaa", margin: "2px 0 0" }}>
              {new Date(dep.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: "0 0 4px" }}>
              {fmtUSD(dep.amount)}
            </p>
            <StatusBadge status={dep.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const HistoryView = ({ isMobile, trades, userId }) => {
  const [activeTab, setActiveTab] = useState("trades");

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: "8px 18px", borderRadius: 100, border: "none",
        background: activeTab === id ? "#111827" : "transparent",
        color: activeTab === id ? "#fff" : "#6b7280",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
        transition: "all 0.2s"
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: isMobile ? "20px 20px 100px" : "28px 32px" }}>
      <p style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 16 }}>
        History
      </p>

      <div style={{
        display: "inline-flex", background: "#f3f4f6",
        borderRadius: 100, padding: 4, marginBottom: 24
      }}>
        <Tab id="trades" label="Trades" />
        <Tab id="deposits" label="Deposits" />
      </div>

      {activeTab === "trades" && (
        trades.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ color: "#aaa", fontSize: 14 }}>No trades yet</p>
          </div>
        ) : (
          trades.map(trade => (
            <div key={trade.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 0", borderBottom: "1px solid #f5f5f5"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: trade.trade_type === "buy" ? "#f0fdf4" : "#fef2f2",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: trade.trade_type === "buy" ? "#22c55e" : "#ef4444",
                fontSize: 11, fontWeight: 700
              }}>
                {trade.trade_type === "buy" ? "BUY" : "SELL"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>
                  {trade.trade_type === "buy" ? "Bought" : "Sold"} {trade.symbol}
                </p>
                <p style={{ fontSize: 12, color: "#aaa", margin: "2px 0 0" }}>
                  {new Date(trade.created_at).toLocaleDateString()} ·{" "}
                  {fmt(trade.quantity, 6)} units @ {fmtUSD(trade.price)}
                </p>
              </div>
              <p style={{
                fontSize: 14, fontWeight: 600, margin: 0,
                color: trade.trade_type === "buy" ? "#ef4444" : "#22c55e"
              }}>
                {trade.trade_type === "buy" ? "-" : "+"}{fmtUSD(trade.total)}
              </p>
            </div>
          ))
        )
      )}

      {activeTab === "deposits" && <DepositHistory userId={userId} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};