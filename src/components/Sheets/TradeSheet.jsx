// pages/components/sheets/TradeSheet.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { fmtUSD } from "../../Utils/formatters";

export const TradeSheet = ({
  isOpen,
  onClose,
  selectedCoin,
  coinPrice,
  tradeMode,
  setTradeMode,
  buyingPower,
  ownedPosition,
  maxSellValue,
  onTrade,
  notification
}) => {
  const [tradeAmount, setTradeAmount] = useState("");

  if (!isOpen) return null;

  const handleTrade = () => {
    onTrade(tradeMode, tradeAmount);
    setTradeAmount("");
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 40,
          backdropFilter: "blur(2px)"
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "0 24px 48px",
          zIndex: 50,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)"
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: "#e5e7eb",
            borderRadius: 2,
            margin: "12px auto 20px"
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, color: selectedCoin.color }}>
              {selectedCoin.icon}
            </span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                {selectedCoin.name}
              </p>
              <p style={{ fontSize: 12, color: "#888" }}>
                {coinPrice ? fmtUSD(coinPrice) : "···"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f5f5f5",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#666"
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            background: "#f5f5f5",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24
          }}
        >
          {["buy", "sell"].map(mode => (
            <button
              key={mode}
              onClick={() => setTradeMode(mode)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: "none",
                background:
                  tradeMode === mode ? (mode === "buy" ? "#111" : "#ef4444") : "transparent",
                color: tradeMode === mode ? "#fff" : "#888",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            }}
          >
            <span style={{ fontSize: 32, color: "#888", fontWeight: 300 }}>$</span>
            <input
              type="number"
              placeholder="0.00"
              value={tradeAmount}
              onChange={e => setTradeAmount(e.target.value)}
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: "#111",
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                textAlign: "center",
                fontFamily: "inherit"
              }}
            />
          </div>
          <p style={{ fontSize: 13, color: "#aaa", marginTop: 6 }}>
            {tradeMode === "buy"
              ? `${fmtUSD(buyingPower)} available`
              : ownedPosition
              ? `${fmtUSD(maxSellValue)} max`
              : "No position"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["10", "25", "50", "100"].map(amt => (
            <button
              key={amt}
              onClick={() => setTradeAmount(amt)}
              style={{
                flex: 1,
                padding: "8px 4px",
                borderRadius: 10,
                border: "1px solid #f0f0f0",
                background: "#fff",
                fontSize: 13,
                fontWeight: 600,
                color: "#111",
                cursor: "pointer"
              }}
            >
              ${amt}
            </button>
          ))}
        </div>

        <button
          onClick={handleTrade}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 100,
            border: "none",
            background: tradeMode === "buy" ? "#111" : "#ef4444",
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          {tradeMode === "buy" ? "Buy" : "Sell"} {selectedCoin.symbol}
        </button>

        {notification && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              textAlign: "center",
              background: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: notification.type === "success" ? "#16a34a" : "#dc2626"
            }}
          >
            {notification.msg}
          </div>
        )}
      </div>
    </>
  );
};