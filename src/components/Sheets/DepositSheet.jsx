// src/components/sheets/DepositSheet.jsx
import React, { useState } from "react";
import { X, CreditCard, Banknote, Zap } from "lucide-react";
import { fmtUSD } from "../../Utils/formatters";

export const DepositSheet = ({ isOpen, onClose, onDeposit }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositing, setDepositing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;
    if (amount > 50000) {
      alert("Maximum deposit is $50,000");
      return;
    }
    
    setDepositing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await onDeposit(amount);
    setDepositAmount("");
    setDepositing(false);
    onClose();
  };

  const presetAmounts = [50, 100, 250, 500, 1000, 5000];

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
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>Add Funds</h2>
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

        {/* Amount Input */}
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
            background: "#fff",
            transition: "border-color 0.2s"
          }}>
            <span style={{ fontSize: 24, color: "#6b7280", marginRight: 8 }}>$</span>
            <input
              type="number"
              placeholder="0.00"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              autoFocus
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
        </div>

        {/* Preset Amounts */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {presetAmounts.map(amt => (
            <button
              key={amt}
              onClick={() => setDepositAmount(amt.toString())}
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: depositAmount === amt.toString() ? "#00b4b4" : "#fff",
                color: depositAmount === amt.toString() ? "#fff" : "#374151",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginBottom: 12 }}>Payment Method</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setSelectedMethod("card")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: selectedMethod === "card" ? "2px solid #00b4b4" : "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center"
              }}
            >
              <CreditCard size={18} color={selectedMethod === "card" ? "#00b4b4" : "#6b7280"} />
              <span style={{ color: selectedMethod === "card" ? "#00b4b4" : "#374151" }}>Debit Card</span>
            </button>
            <button
              onClick={() => setSelectedMethod("bank")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: selectedMethod === "bank" ? "2px solid #00b4b4" : "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center"
              }}
            >
              <Banknote size={18} color={selectedMethod === "bank" ? "#00b4b4" : "#6b7280"} />
              <span style={{ color: selectedMethod === "bank" ? "#00b4b4" : "#374151" }}>Bank Account</span>
            </button>
          </div>
        </div>

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          disabled={depositing || !depositAmount || parseFloat(depositAmount) <= 0}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 100,
            border: "none",
            background: (!depositAmount || parseFloat(depositAmount) <= 0) ? "#e5e7eb" : "#00b4b4",
            color: (!depositAmount || parseFloat(depositAmount) <= 0) ? "#9ca3af" : "#fff",
            fontSize: 16,
            fontWeight: 600,
            cursor: (!depositAmount || parseFloat(depositAmount) <= 0) ? "not-allowed" : "pointer",
            transition: "transform 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
          onMouseEnter={e => {
            if (!depositing && depositAmount && parseFloat(depositAmount) > 0) {
              e.currentTarget.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {depositing ? (
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
              <Zap size={18} />
              {`Deposit ${depositAmount ? fmtUSD(parseFloat(depositAmount)) : "$0.00"}`}
            </>
          )}
        </button>

        <p style={{
          fontSize: 11,
          color: "#9ca3af",
          textAlign: "center",
          marginTop: 16,
          lineHeight: 1.4
        }}>
          Funds are available instantly for trading.<br />
          Bank transfers may take 1-3 business days.
        </p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};