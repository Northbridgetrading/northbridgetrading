// src/components/sheets/InvestSheet.jsx
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, X, Users, DollarSign, Clock, Zap } from 'lucide-react';
import { fmtUSD } from '../../Utils/formatters';

const PLANS = [
  {
    id: 1,
    name: "Starter Plan",
    minAmount: 100,
    maxAmount: 4999,
    return: "40% weekly",
    returnValue: 40,
    term: "7 days",
    termDays: 7,
    termLabel: "Weekly",
    risk: "Low",
    description: "40–45% compounding returns weekly",
    highlight: "Guaranteed returns DIP or not",
    badge: null,
    accentColor: "#14b8a6",
    accentBg: "#f0fdfa",
    accentBorder: "#99f6e4",
  },
  {
    id: 2,
    name: "Growth Plan",
    minAmount: 500,
    maxAmount: 9999,
    return: "45% weekly",
    returnValue: 45,
    term: "7 days",
    termDays: 7,
    termLabel: "Weekly",
    risk: "Medium",
    description: "Maximum weekly compounding profits",
    highlight: "Best weekly compounding rate",
    badge: "Most Popular",
    accentColor: "#7c3aed",
    accentBg: "#faf5ff",
    accentBorder: "#ddd6fe",
  },
  {
    id: 3,
    name: "Premium Plan",
    minAmount: 1000,
    maxAmount: 100000,
    return: "200% monthly",
    returnValue: 200,
    term: "30 days",
    termDays: 30,
    termLabel: "Monthly",
    risk: "High",
    description: "200–300% returns on a monthly basis",
    highlight: "Highest monthly return potential",
    badge: "Best Value",
    accentColor: "#f59e0b",
    accentBg: "#fffbeb",
    accentBorder: "#fde68a",
  },
];

// Fake live stats
const STATS = [
  { icon: Users, label: "Active Investors", value: "3,847" },
  { icon: DollarSign, label: "Total Paid Out", value: "$12.4M" },
  { icon: Zap, label: "Avg Weekly Return", value: "42.5%" },
];

// Countdown to next plan cycle (7 days from a fixed anchor)
const getCountdown = () => {
  const anchor = new Date("2025-01-01T00:00:00Z");
  const now = new Date();
  const cycleMs = 7 * 24 * 60 * 60 * 1000;
  const elapsed = (now - anchor) % cycleMs;
  const remaining = cycleMs - elapsed;
  const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((remaining % (1000 * 60)) / 1000);
  return { d, h, m, s };
};

// Confetti component
const Confetti = () => {
  const colors = ["#14b8a6", "#7c3aed", "#f59e0b", "#10b981", "#3b82f6", "#ec4899"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    size: `${6 + Math.random() * 8}px`,
    duration: `${0.8 + Math.random() * 0.6}s`,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "-10px", left: p.left,
          width: p.size, height: p.size,
          background: p.color, borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          opacity: 0
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Animated number
const AnimatedNumber = ({ value, prefix = "$", duration = 600 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = display;
    const end = value;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <span>{prefix}{display.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  );
};

export const InvestSheet = ({ isOpen, onClose, buyingPower = 0, onInvest }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState("");
  const [step, setStep] = useState(1);
  const [isInvesting, setIsInvesting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  const amount = parseFloat(investAmount) || 0;
  const profit = selectedPlan ? amount * (selectedPlan.returnValue / 100) : 0;
  const total = amount + profit;

  const handleInvest = async () => {
    setIsInvesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onInvest(selectedPlan, amount);
    setShowConfetti(true);
    setIsInvesting(false);
    setStep(4);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedPlan(null);
    setInvestAmount("");
    setShowConfetti(false);
    onClose();
  };

  if (!isOpen) return null;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", position: "relative", fontFamily: "'Inter', sans-serif" }}>
        {showConfetti && <Confetti />}

        {/* Header */}
        <div style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid #f1f5f9", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
              {step === 1 ? "Investment Plans" : step === 2 ? "Enter Amount" : step === 3 ? "Confirm Investment" : "Investment Confirmed!"}
            </h2>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "3px 0 0" }}>
              {step === 1 ? "Regulated brokerage • Min 40% weekly" : step === 2 ? "Select your investment amount" : step === 3 ? "Review before confirming" : "Your investment is now active"}
            </p>
          </div>
          <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Step Indicator */}
          {step < 4 && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? "#7c3aed" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: step >= s ? "#fff" : "#9ca3af", flexShrink: 0 }}>
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && <div style={{ flex: 1, height: 2, background: step > s ? "#7c3aed" : "#e5e7eb", margin: "0 6px" }} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* STEP 1: Plans */}
          {step === 1 && (
            <div>
              {/* Live Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                {STATS.map((stat, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 8px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                    <stat.icon size={14} color="#7c3aed" style={{ marginBottom: 4 }} />
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{stat.value}</p>
                    <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={16} color="#fff" />
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600, margin: 0 }}>Next cycle opens in</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ v: countdown.d, l: "d" }, { v: countdown.h, l: "h" }, { v: countdown.m, l: "m" }, { v: countdown.s, l: "s" }].map((t, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", textAlign: "center", minWidth: 36 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0, fontVariantNumeric: "tabular-nums" }}>{pad(t.v)}</p>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", margin: 0 }}>{t.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Balance */}
              <div style={{ background: "linear-gradient(135deg,#faf5ff,#eff6ff)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid #ddd6fe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Available Balance</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{fmtUSD(buyingPower)}</span>
              </div>

              {/* Plans */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {PLANS.map(plan => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      style={{ position: "relative", border: isSelected ? `2px solid ${plan.accentColor}` : "2px solid #e5e7eb", borderRadius: 18, padding: 16, cursor: "pointer", background: isSelected ? plan.accentBg : "#fff", transition: "all 0.2s", boxShadow: isSelected ? `0 8px 24px ${plan.accentColor}22` : "0 2px 8px rgba(0,0,0,0.04)" }}
                    >
                      {/* Badge */}
                      {plan.badge && (
                        <div style={{ position: "absolute", top: -10, left: 16, background: plan.accentColor, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: 0.5 }}>
                          ⭐ {plan.badge}
                        </div>
                      )}

                      {isSelected && (
                        <div style={{ position: "absolute", top: 12, right: 12, width: 22, height: 22, borderRadius: "50%", background: plan.accentColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</div>
                      )}

                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ display: "inline-block", background: plan.accentBg, color: plan.accentColor, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, border: `1px solid ${plan.accentBorder}`, marginBottom: 6 }}>
                            {plan.termLabel}
                          </div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{plan.name}</h3>
                          <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{plan.description}</p>
                          <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0" }}>Min. {fmtUSD(plan.minAmount)}</p>
                        </div>
                        <div style={{ background: plan.risk === "Low" ? "#f0fdf4" : plan.risk === "Medium" ? "#fefce8" : "#fff7ed", color: plan.risk === "Low" ? "#15803d" : plan.risk === "Medium" ? "#a16207" : "#c2410c", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>
                          {plan.risk} Risk
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: 24, fontWeight: 800, color: plan.accentColor, margin: 0 }}>{plan.return}</p>
                          <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>Expected return</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{plan.term}</p>
                          <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>Lock period</p>
                        </div>
                      </div>

                      <div style={{ marginTop: 10, background: "#f9fafb", borderRadius: 8, padding: "6px 10px" }}>
                        <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>✅ {plan.highlight}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => selectedPlan && setStep(2)}
                disabled={!selectedPlan}
                style={{ width: "100%", padding: "14px", borderRadius: 100, border: "none", fontSize: 15, fontWeight: 700, cursor: selectedPlan ? "pointer" : "not-allowed", background: selectedPlan ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb", color: selectedPlan ? "#fff" : "#9ca3af", boxShadow: selectedPlan ? "0 8px 20px rgba(124,58,237,0.3)" : "none" }}
              >
                Continue to Amount →
              </button>
            </div>
          )}

          {/* STEP 2: Amount */}
          {step === 2 && selectedPlan && (
            <div>
              {/* Plan Summary */}
              <div style={{ background: selectedPlan.accentBg, border: `1px solid ${selectedPlan.accentBorder}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}>Selected Plan</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{selectedPlan.name}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}>Return</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: selectedPlan.accentColor, margin: 0 }}>{selectedPlan.return}</p>
                </div>
              </div>

              {/* Amount Input */}
              <div style={{ background: "#f9fafb", borderRadius: 16, padding: "20px 16px", textAlign: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 28, color: "#9ca3af", marginRight: 4, fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    style={{ fontSize: 42, fontWeight: 800, color: "#111827", background: "transparent", border: "none", outline: "none", fontFamily: "inherit", width: "180px", textAlign: "center", letterSpacing: "-1px" }}
                  />
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>USD amount</p>
              </div>

              {/* Slider */}
              <div style={{ marginBottom: 16 }}>
                <input
                  type="range"
                  min={selectedPlan.minAmount}
                  max={Math.min(selectedPlan.maxAmount, buyingPower)}
                  step={50}
                  value={amount || selectedPlan.minAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  style={{ width: "100%", accentColor: selectedPlan.accentColor, cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                  <span>Min {fmtUSD(selectedPlan.minAmount)}</span>
                  <button onClick={() => setInvestAmount(String(Math.min(selectedPlan.maxAmount, buyingPower)))} style={{ background: "none", border: "none", color: selectedPlan.accentColor, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                    Max {fmtUSD(Math.min(selectedPlan.maxAmount, buyingPower))}
                  </button>
                </div>
              </div>

              {/* Quick Amounts */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                {[selectedPlan.minAmount, 1000, 5000].filter(a => a <= buyingPower).map(amt => (
                  <button key={amt} onClick={() => setInvestAmount(String(amt))} style={{ padding: "8px 0", borderRadius: 10, border: amount === amt ? `1.5px solid ${selectedPlan.accentColor}` : "1px solid #e5e7eb", background: amount === amt ? selectedPlan.accentBg : "#fff", color: amount === amt ? selectedPlan.accentColor : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {fmtUSD(amt)}
                  </button>
                ))}
              </div>

              {/* Animated Profit Preview */}
              {amount >= selectedPlan.minAmount && amount <= buyingPower && (
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    📈 Live Profit Preview
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Amount Invested", value: amount, color: "#111827" },
                      { label: `Profit (${selectedPlan.returnValue}%)`, value: profit, color: "#059669" },
                      { label: `Total after ${selectedPlan.term}`, value: total, color: "#059669", large: true },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: i === 2 ? 8 : 0, borderTop: i === 2 ? "1px solid #86efac" : "none" }}>
                        <span style={{ fontSize: 13, color: "#374151" }}>{row.label}</span>
                        <span style={{ fontSize: row.large ? 16 : 14, fontWeight: row.large ? 800 : 600, color: row.color }}>
                          <AnimatedNumber value={row.value} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {amount > 0 && amount < selectedPlan.minAmount && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#dc2626", margin: 0, textAlign: "center" }}>Minimum investment is {fmtUSD(selectedPlan.minAmount)}</p>
                </div>
              )}

              {amount > buyingPower && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#dc2626", margin: 0, textAlign: "center" }}>Insufficient balance. Available: {fmtUSD(buyingPower)}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", borderRadius: 100, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Back
                </button>
                <button
                  onClick={() => { if (amount >= selectedPlan.minAmount && amount <= buyingPower) setStep(3); }}
                  disabled={amount < selectedPlan.minAmount || amount > buyingPower}
                  style={{ flex: 2, padding: "13px", borderRadius: 100, border: "none", background: amount >= selectedPlan.minAmount && amount <= buyingPower ? `linear-gradient(135deg,${selectedPlan.accentColor},${selectedPlan.accentColor}cc)` : "#e5e7eb", color: amount >= selectedPlan.minAmount && amount <= buyingPower ? "#fff" : "#9ca3af", fontSize: 14, fontWeight: 700, cursor: amount >= selectedPlan.minAmount && amount <= buyingPower ? "pointer" : "not-allowed" }}
                >
                  Review Investment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && selectedPlan && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: selectedPlan.accentBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: `2px solid ${selectedPlan.accentBorder}` }}>
                  <TrendingUp size={32} color={selectedPlan.accentColor} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Confirm Investment</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Review your investment details below</p>
              </div>

              <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
                {[
                  { label: "Plan", value: selectedPlan.name },
                  { label: "Amount", value: fmtUSD(amount), bold: true },
                  { label: "Return Rate", value: selectedPlan.return, color: selectedPlan.accentColor },
                  { label: `Profit after ${selectedPlan.term}`, value: `+${fmtUSD(profit)}`, color: "#059669" },
                  { label: "Total Payout", value: fmtUSD(total), color: "#059669", bold: true },
                  { label: "Lock Period", value: selectedPlan.term },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: row.bold ? 700 : 600, color: row.color || "#111827" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#0f766e", margin: 0, lineHeight: 1.6 }}>
                  ✅ Returns are guaranteed on our regulated brokerage platform whether there's a market DIP or not. Profits compound on a {selectedPlan.termLabel?.toLowerCase()} basis.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: "13px", borderRadius: 100, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Edit
                </button>
                <button
                  onClick={handleInvest}
                  disabled={isInvesting}
                  style={{ flex: 2, padding: "13px", borderRadius: 100, border: "none", background: isInvesting ? "#e5e7eb" : "linear-gradient(135deg,#10b981,#059669)", color: isInvesting ? "#9ca3af" : "#fff", fontSize: 14, fontWeight: 700, cursor: isInvesting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {isInvesting ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid #9ca3af", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      Processing...
                    </>
                  ) : "Confirm Investment ✓"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && selectedPlan && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 12px 32px rgba(16,185,129,0.3)" }}>
                <span style={{ fontSize: 36 }}>🎉</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Investment Active!</h3>
              <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px", lineHeight: 1.6 }}>
                Your <strong>{fmtUSD(amount)}</strong> investment in <strong>{selectedPlan.name}</strong> is now active. Expected payout of <strong style={{ color: "#059669" }}>{fmtUSD(total)}</strong> in {selectedPlan.term}.
              </p>

              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 16, padding: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>Invested</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{fmtUSD(amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>Expected Profit</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>+{fmtUSD(profit)}</span>
                </div>
                <div style={{ height: 1, background: "#86efac", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>Total Payout</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>{fmtUSD(total)}</span>
                </div>
              </div>

              <button onClick={handleClose} style={{ width: "100%", padding: "14px", borderRadius: 100, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(124,58,237,0.3)" }}>
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
          input[type=number] { -moz-appearance: textfield; }
        `}</style>
      </div>
    </div>
  );
};

export default InvestSheet;