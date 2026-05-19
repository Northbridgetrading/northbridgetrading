// src/pages/components/dashboard/HistoryView.jsx
import React from "react";
import { fmt, fmtUSD } from "../../Utils/formatters";

export const HistoryView = ({ isMobile, trades }) => (
  <div style={{ padding: isMobile ? "20px 20px 100px" : "28px 32px" }}>
    <p style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 20 }}>
      Trade History
    </p>
    {trades.length === 0 ? (
      <p style={{ color: "#aaa", fontSize: 14 }}>No trades yet</p>
    ) : (
      trades.map(trade => (
        <div
          key={trade.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 0",
            borderBottom: "1px solid #f5f5f5"
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              flexShrink: 0,
              background: trade.trade_type === "buy" ? "#f0fdf4" : "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: trade.trade_type === "buy" ? "#22c55e" : "#ef4444",
              fontSize: 11,
              fontWeight: 700
            }}
          >
            {trade.trade_type === "buy" ? "BUY" : "SELL"}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
              {trade.trade_type === "buy" ? "Bought" : "Sold"} {trade.symbol}
            </p>
            <p style={{ fontSize: 12, color: "#aaa" }}>
              {new Date(trade.created_at).toLocaleDateString()} ·{" "}
              {fmt(trade.quantity, 6)} units @ {fmtUSD(trade.price)}
            </p>
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: trade.trade_type === "buy" ? "#ef4444" : "#22c55e"
            }}
          >
            {trade.trade_type === "buy" ? "-" : "+"}
            {fmtUSD(trade.total)}
          </p>
        </div>
      ))
    )}
  </div>
);