// src/components/sheets/DepositSheet.jsx
import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight, Copy, Check, Clock } from "lucide-react";
import { fmtUSD } from "../../Utils/formatters";
import { supabase } from "../../supabaseClient";

const BTC_WALLET_ADDRESS = "bc1quy7qyvrnlewmfufp4askz4fc0l3jw0t2v9jyux";
const ETH_WALLET_ADDRESS = "0x6776A6Faa40888fABEF5D16a5Aa7537ECe06a859";

const COINS = [
  {
    id: "btc",
    label: "Bitcoin (BTC)",
    symbol: "BTC",
    icon: "₿",
    color: "#F7931A",
    bg: "#FAEEDA",
    address: BTC_WALLET_ADDRESS,
    prefix: "bitcoin",
    warning: "Only send BTC to this address. Sending any other coin will result in permanent loss."
  },
  {
    id: "eth",
    label: "Ethereum (ETH)",
    symbol: "ETH",
    icon: "Ξ",
    color: "#627EEA",
    bg: "#EEF0FF",
    address: ETH_WALLET_ADDRESS,
    prefix: "ethereum",
    warning: "Only send ETH to this address. Sending any other coin will result in permanent loss."
  }
];

const QRCode = ({ address }) => (
  <img
    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${address}`}
    alt="Wallet QR code"
    style={{ width: 140, height: 140, borderRadius: 12, border: "1px solid #e5e7eb", display: "block" }}
  />
);

const ProgressBar = ({ step }) => (
  <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
    {[1, 2, 3].map(n => (
      <div key={n} style={{
        flex: 1, height: 3, borderRadius: 2,
        background: n <= step ? "#1D9E75" : "#e5e7eb",
        transition: "background 0.3s"
      }} />
    ))}
  </div>
);

export const DepositSheet = ({ isOpen, onClose, userId }) => {
  const [step, setStep] = useState(1);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const amount = parseFloat(depositAmount);
  const presetAmounts = [100, 250, 500, 1000, 2500, 5000];

  const handleClose = () => {
    setStep(1);
    setDepositAmount("");
    setSelectedCoin(COINS[0]);
    setCopied(false);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCoin.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSent = async () => {
    setSubmitting(true);
    try {
      await supabase.from("deposit_requests").insert({
        user_id: userId,
        amount,
        wallet_address: selectedCoin.address,
        coin: selectedCoin.symbol,
        status: "pending",
        created_at: new Date().toISOString(),
      });
      setStep(3);
    } catch (err) {
      console.error("Deposit request failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const btn = (extra = {}) => ({
    width: "100%", padding: "15px", borderRadius: 100,
    border: "none", fontSize: 15, fontWeight: 600,
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 8,
    ...extra
  });

  return (
    <>
      <div onClick={handleClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 1000, backdropFilter: "blur(4px)"
      }} />

      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%", maxWidth: 440,
        background: "#fff", borderRadius: 24, padding: 28,
        zIndex: 1001, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        maxHeight: "90vh", overflowY: "auto",
        fontFamily: "'Inter', sans-serif"
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0, display: "flex" }}>
                <ArrowLeft size={18} />
              </button>
            )}
            <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, margin: 0 }}>
              Step {step} of 3
            </p>
          </div>
          <button onClick={handleClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 50, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4, marginTop: 8 }}>
          {step === 1 && "Add funds"}
          {step === 2 && `Send ${selectedCoin.symbol}`}
          {step === 3 && "Pending approval"}
        </p>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.5 }}>
          {step === 1 && "Enter the amount and choose your payment method"}
          {step === 2 && <span>Send exactly <strong style={{ color: "#111827" }}>{fmtUSD(amount)}</strong> worth of {selectedCoin.symbol} to the address below</span>}
          {step === 3 && "We'll credit your account once we confirm the payment"}
        </p>

        <ProgressBar step={step} />

        {/* STEP 1: Amount + Coin Selection */}
        {step === 1 && (
          <>
            <div style={{ background: "#f9fafb", borderRadius: 16, padding: "20px 16px", textAlign: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, color: "#9ca3af", marginRight: 4, fontWeight: 600 }}>$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  autoFocus
                  style={{
                    fontSize: 42, fontWeight: 700, color: "#111827",
                    background: "transparent", border: "none", outline: "none",
                    fontFamily: "inherit", width: "160px", textAlign: "center",
                    letterSpacing: "-1px"
                  }}
                />
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, marginBottom: 0 }}>USD amount</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
              {presetAmounts.map(amt => {
                const selected = depositAmount === amt.toString();
                return (
                  <button key={amt} onClick={() => setDepositAmount(amt.toString())} style={{
                    padding: "9px 0", borderRadius: 10,
                    border: selected ? "1.5px solid #1D9E75" : "1px solid #e5e7eb",
                    background: selected ? "#E1F5EE" : "#fff",
                    color: selected ? "#0F6E56" : "#374151",
                    fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}>
                    ${amt.toLocaleString()}
                  </button>
                );
              })}
            </div>

            {/* Coin Selection */}
            <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Payment method
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {COINS.map(coin => {
                const isSelected = selectedCoin.id === coin.id;
                return (
                  <button
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin)}
                    style={{
                      border: isSelected ? `1.5px solid ${coin.color}` : "1px solid #e5e7eb",
                      borderRadius: 14, padding: "12px 14px", background: isSelected ? coin.bg : "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left"
                    }}
                  >
                    <div style={{ width: 36, height: 36, background: coin.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: coin.color, fontWeight: 700 }}>
                      {coin.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{coin.label}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Approved within 30 minutes</p>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: 50, background: isSelected ? "#1D9E75" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!amount || amount <= 0 || amount > 50000}
              style={btn({
                background: (!amount || amount <= 0) ? "#e5e7eb" : "#1D9E75",
                color: (!amount || amount <= 0) ? "#9ca3af" : "#fff",
                cursor: (!amount || amount <= 0) ? "not-allowed" : "pointer"
              })}
            >
              Continue <ArrowRight size={16} />
            </button>
          </>
        )}

        {/* STEP 2: Wallet */}
        {step === 2 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20, gap: 8 }}>
              <QRCode address={selectedCoin.address} />
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Scan with your wallet app</p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", marginBottom: 6 }}>{selectedCoin.symbol} wallet address</p>
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#111827", fontFamily: "monospace", wordBreak: "break-all", flex: 1 }}>
                  {selectedCoin.address}
                </span>
                <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#1D9E75" : "#6b7280", flexShrink: 0, padding: 0 }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>
                Send <strong>{fmtUSD(amount)}</strong> worth of {selectedCoin.symbol}. Your balance will be updated after admin confirmation.
              </p>
            </div>

            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "11px 14px", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#9a3412", margin: 0 }}>
                ⚠️ {selectedCoin.warning}
              </p>
            </div>

            <button
              onClick={handleConfirmSent}
              disabled={submitting}
              style={btn({ background: "#1D9E75", color: "#fff", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" })}
            >
              {submitting ? "Submitting..." : "I've sent the payment"}
            </button>
          </>
        )}

        {/* STEP 3: Pending */}
        {step === 3 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: 50, background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Clock size={30} color="#1D9E75" />
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
              {[
                { label: "Amount", value: fmtUSD(amount) },
                { label: "Method", value: selectedCoin.label },
                { label: "Status", isStatus: true },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 16px",
                  borderBottom: i < 2 ? "1px solid #f3f4f6" : "none"
                }}>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{row.label}</p>
                  {row.isStatus ? (
                    <span style={{ fontSize: 12, fontWeight: 600, background: "#FAEEDA", color: "#854F0B", padding: "3px 10px", borderRadius: 100 }}>Pending</span>
                  ) : (
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{row.value}</p>
                  )}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Clock size={12} /> Estimated approval: within 30 minutes
            </p>

            <button onClick={handleClose} style={btn({ background: "#f3f4f6", color: "#374151" })}>
              Done
            </button>
          </>
        )}
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </>
  );
};