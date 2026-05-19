// src/components/sheets/WithdrawSheet.jsx
import React, { useState, useEffect } from "react";
import { X, Send, AlertCircle, Bitcoin } from "lucide-react";
import { fmtUSD } from "../../Utils/formatters";
import { fetchBTCPrice } from "../../services/cryptoApi";

export const WithdrawSheet = ({ isOpen, onClose, buyingPower, onWithdraw }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [btcPrice, setBTCPrice] = useState(0);
  const [btcEquivalent, setBTCEquivalent] = useState(0);
  const networkFee = 5;

  useEffect(() => {
    const loadBTCPrice = async () => {
      const price = await fetchBTCPrice();
      setBTCPrice(price);
    };
    if (isOpen) {
      loadBTCPrice();
    }
  }, [isOpen]);

  useEffect(() => {
    if (withdrawAmount && btcPrice) {
      const btc = parseFloat(withdrawAmount) / btcPrice;
      setBTCEquivalent(btc);
    } else {
      setBTCEquivalent(0);
    }
  }, [withdrawAmount, btcPrice]);

  if (!isOpen) return null;

  const totalCost = parseFloat(withdrawAmount) + networkFee;
  const isValid = 
    parseFloat(withdrawAmount) >= 100 &&
    parseFloat(withdrawAmount) <= buyingPower &&
    withdrawAddress.length >= 26;

  const handleWithdraw = async () => {
    if (!isValid) return;
    
    setWithdrawing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await onWithdraw(parseFloat(withdrawAmount), withdrawAddress);
    setWithdrawAmount("");
    setWithdrawAddress("");
    setWithdrawing(false);
    onClose();
  };

  const presetAmounts = [100, 500, 1000, 5000];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 24,
          padding: "24px",
          zIndex: 1001,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>Withdraw Bitcoin</h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              border: "none",
              background: "#f3f4f6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Available Balance */}
        <div style={{
          background: "#f9fafb",
          borderRadius: 16,
          padding: "12px 16px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Available Balance</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
            {fmtUSD(buyingPower)}
          </span>
        </div>

        {/* Withdraw Amount */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginBottom: 8, display: "block" }}>
            Amount (USD)
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            border: "2px solid #e5e7eb",
            borderRadius: 16,
            padding: "12px 16px",
            background: "#fff"
          }}>
            <span style={{ fontSize: 24, color: "#6b7280", marginRight: 8 }}>$</span>
            <input
              type="number"
              placeholder="Min. $100"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              style={{
                flex: 1,
                fontSize: 28,
                fontWeight: 600,
                color: "#111827",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          </div>
          {btcEquivalent > 0 && (
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              ≈ {btcEquivalent.toFixed(8)} BTC
            </p>
          )}
        </div>

        {/* Preset Amounts */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {presetAmounts.map(amt => (
            <button
              key={amt}
              onClick={() => setWithdrawAmount(amt.toString())}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: withdrawAmount === amt.toString() ? "#00b4b4" : "#fff",
                color: withdrawAmount === amt.toString() ? "#fff" : "#374151",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              ${amt}
            </button>
          ))}
          <button
            onClick={() => setWithdrawAmount(Math.floor(buyingPower - 10).toString())}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Max
          </button>
        </div>

        {/* Bitcoin Address */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginBottom: 8, display: "block" }}>
            Bitcoin Address
          </label>
          <input
            type="text"
            placeholder="bc1q... or 1A1zP1..."
            value={withdrawAddress}
            onChange={e => setWithdrawAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "2px solid #e5e7eb",
              fontSize: 14,
              fontFamily: "monospace",
              outline: "none",
              transition: "border-color 0.2s"
            }}
          />
        </div>

        {/* Transaction Details */}
        {withdrawAmount && (
          <div style={{
            background: "#f9fafb",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 24
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>
              Transaction Details
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Withdraw Amount</span>
              <span style={{ fontSize: 12, color: "#111827" }}>{fmtUSD(parseFloat(withdrawAmount))}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Network Fee</span>
              <span style={{ fontSize: 12, color: "#f7931a" }}>{fmtUSD(networkFee)}</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              paddingTop: 8,
              borderTop: "1px solid #e5e7eb",
              marginTop: 4
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Total</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}>
                {fmtUSD(totalCost)}
              </span>
            </div>
          </div>
        )}

        {/* Warning */}
        <div style={{
          background: "#fef3c7",
          borderRadius: 12,
          padding: "12px",
          marginBottom: 24,
          display: "flex",
          gap: 8,
          alignItems: "flex-start"
        }}>
          <AlertCircle size={16} color="#d97706" style={{ marginTop: 2 }} />
          <p style={{ fontSize: 11, color: "#92400e", lineHeight: 1.4 }}>
            Minimum withdrawal: $100. Processing takes 10-30 minutes.<br />
            Double-check your wallet address - transactions are irreversible!
          </p>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={!isValid || withdrawing}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 100,
            border: "none",
            background: isValid && !withdrawing ? "#00b4b4" : "#e5e7eb",
            color: isValid && !withdrawing ? "#fff" : "#9ca3af",
            fontSize: 16,
            fontWeight: 600,
            cursor: isValid && !withdrawing ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
        >
          {withdrawing ? (
            <>
              <div style={{
                width: 18,
                height: 18,
                border: "2px solid #fff",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite"
              }} />
              Processing...
            </>
          ) : (
            <>
              <Send size={18} />
              Withdraw {withdrawAmount ? fmtUSD(parseFloat(withdrawAmount)) : "$0.00"}
            </>
          )}
        </button>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};