import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  User, Mail, Lock, ArrowUpRight, ArrowDownRight,
  ChevronRight, LogOut, ArrowLeft, Eye, EyeOff,
  TrendingUp, DollarSign, BarChart2, Shield
} from "lucide-react";

const fmt    = (n, d = 2) => n?.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
const fmtUSD = (n) => `$${fmt(n)}`;

export default function Profile({ session }) {
  const navigate  = useNavigate();
  const user      = session.user;
  const userId    = user.id;

  const [profile,       setProfile]       = useState(null);
  const [trades,        setTrades]        = useState([]);
  const [positions,     setPositions]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [saving,        setSaving]        = useState(false);
  const [notification,  setNotification]  = useState(null);

  // Edit profile state
  const [fullName,  setFullName]  = useState("");
  const [editName,  setEditName]  = useState(false);

  // Password state
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [pwLoading,  setPwLoading]  = useState(false);

  useEffect(() => {
    const load = async () => {
      const [
        { data: prof },
        { data: tr },
        { data: pos }
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("trades").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("positions").select("*").eq("user_id", userId),
      ]);
      if (prof) { setProfile(prof); setFullName(prof.full_name || ""); }
      if (tr)   setTrades(tr);
      if (pos)  setPositions(pos);
      setLoading(false);
    };
    load();
  }, [userId]);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveName = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
    setProfile(prev => ({ ...prev, full_name: fullName }));
    setEditName(false);
    setSaving(false);
    notify("Name updated successfully");
  };

  const handleChangePassword = async () => {
    if (!newPw || newPw.length < 6) return notify("Password must be at least 6 characters", "error");
    if (newPw !== confirmPw) return notify("Passwords don't match", "error");
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) return notify(error.message, "error");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    notify("Password changed successfully");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  // Stats
  const totalTrades    = trades.length;
  const buyTrades      = trades.filter(t => t.trade_type === "buy");
  const sellTrades     = trades.filter(t => t.trade_type === "sell");
  const totalInvested  = buyTrades.reduce((a, t) => a + t.total, 0);
  const totalReturned  = sellTrades.reduce((a, t) => a + t.total, 0);
  const buyingPower    = profile?.buying_power ?? 0;
  const totalDeposited = profile?.total_deposited ?? 10000;
  const portfolioValue = positions.reduce((a, p) => a + (p.quantity * (p.avg_buy_price || 0)), 0);
  const totalValue     = buyingPower + portfolioValue;
  const pnl            = totalValue - totalDeposited;
  const pnlPct         = totalDeposited > 0 ? (pnl / totalDeposited) * 100 : 0;
  const userName       = profile?.full_name || user.email?.split("@")[0] || "Investor";
  const initials       = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const sections = [
    { id: "profile",  label: "Profile",  icon: User },
    { id: "stats",    label: "Stats",    icon: BarChart2 },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", background: "#fff"
    }}>
      <div style={{
        width: 28, height: 28, border: "2.5px solid #f0f0f0",
        borderTopColor: "#111", borderRadius: "50%",
        animation: "spin 0.7s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      fontFamily: "'Geist Variable', ui-sans-serif, system-ui, sans-serif",
      color: "#111", WebkitFontSmoothing: "antialiased"
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff", borderBottom: "1px solid #f0f0f0",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 500, color: "#111"
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <p style={{ fontSize: 15, fontWeight: 600 }}>Account</p>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: "#ef4444", fontWeight: 500
          }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* ── AVATAR + NAME ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", padding: "32px 0 24px",
          borderBottom: "1px solid #f5f5f5", marginBottom: 24
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#111", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, color: "#fff",
            marginBottom: 14
          }}>
            {initials}
          </div>
          <p style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 4 }}>
            {userName}
          </p>
          <p style={{ fontSize: 13, color: "#aaa" }}>{user.email}</p>
          <div style={{
            marginTop: 12, padding: "4px 12px",
            background: "#f0fdf4", borderRadius: 100,
            fontSize: 12, fontWeight: 600, color: "#16a34a"
          }}>
            Active Account
          </div>
        </div>

        {/* ── SECTION TABS ── */}
        <div style={{
          display: "flex", gap: 4,
          background: "#f5f5f5", borderRadius: 12,
          padding: 4, marginBottom: 28
        }}>
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                flex: 1, padding: "9px 8px", borderRadius: 10, border: "none",
                background: activeSection === id ? "#fff" : "transparent",
                color: activeSection === id ? "#111" : "#888",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, transition: "all 0.15s",
                boxShadow: activeSection === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ── NOTIFICATION ── */}
        {notification && (
          <div style={{
            padding: "12px 16px", borderRadius: 12, marginBottom: 20,
            fontSize: 13, fontWeight: 500,
            background: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: notification.type === "success" ? "#16a34a" : "#dc2626",
            border: `1px solid ${notification.type === "success" ? "#bbf7d0" : "#fecaca"}`
          }}>
            {notification.type === "success" ? "✓" : "⚠"} {notification.msg}
          </div>
        )}

        {/* ══ PROFILE SECTION ══ */}
        {activeSection === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Name */}
            <div style={{
              border: "1px solid #f0f0f0", borderRadius: 16, padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editName ? 16 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "#f5f5f5", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#666"
                  }}><User size={16} /></div>
                  <div>
                    <p style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>Full Name</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                      {profile?.full_name || "Not set"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditName(!editName)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: "#1E4A7C", fontWeight: 500
                  }}
                >
                  {editName ? "Cancel" : "Edit"}
                </button>
              </div>
              {editName && (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      border: "1px solid #f0f0f0", background: "#f8f9fa",
                      fontSize: 14, color: "#111", outline: "none",
                      fontFamily: "inherit"
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    style={{
                      padding: "10px 20px", borderRadius: 10, border: "none",
                      background: "#111", color: "#fff",
                      fontSize: 13, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{
              border: "1px solid #f0f0f0", borderRadius: 16, padding: 20,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#f5f5f5", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#666"
              }}><Mail size={16} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>Email Address</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{user.email}</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#16a34a",
                background: "#f0fdf4", padding: "3px 10px", borderRadius: 100
              }}>Verified</span>
            </div>

            {/* Account created */}
            <div style={{
              border: "1px solid #f0f0f0", borderRadius: 16, padding: 20,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#f5f5f5", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#666"
              }}><TrendingUp size={16} /></div>
              <div>
                <p style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>Member Since</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
            </div>

            {/* Buying power */}
            <div style={{
              border: "1px solid #f0f0f0", borderRadius: 16, padding: 20,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#f5f5f5", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#666"
              }}><DollarSign size={16} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>Buying Power</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{fmtUSD(buyingPower)}</p>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </div>

          </div>
        )}

        {/* ══ STATS SECTION ══ */}
        {activeSection === "stats" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Total value */}
            <div style={{
              background: "#f8f9fa", borderRadius: 16, padding: 20
            }}>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>Total Portfolio Value</p>
              <p style={{ fontSize: 32, fontWeight: 600, color: "#111", letterSpacing: "-0.5px", marginBottom: 6 }}>
                {fmtUSD(totalValue)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {pnl >= 0
                  ? <ArrowUpRight size={14} color="#22c55e" />
                  : <ArrowDownRight size={14} color="#ef4444" />
                }
                <span style={{ fontSize: 13, fontWeight: 500, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
                  {pnl >= 0 ? "+" : ""}{fmtUSD(Math.abs(pnl))} ({pnl >= 0 ? "+" : ""}{fmt(pnlPct)}%) All time
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Total Deposited",  value: fmtUSD(totalDeposited),  color: "#111" },
                { label: "Buying Power",     value: fmtUSD(buyingPower),     color: "#111" },
                { label: "Total Invested",   value: fmtUSD(totalInvested),   color: "#111" },
                { label: "Total Returned",   value: fmtUSD(totalReturned),   color: "#22c55e" },
                { label: "Total Trades",     value: totalTrades,              color: "#111" },
                { label: "Open Positions",   value: positions.length,         color: "#111" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  border: "1px solid #f0f0f0", borderRadius: 14,
                  padding: "14px 16px"
                }}>
                  <p style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Recent trades */}
            {trades.length > 0 && (
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 14 }}>
                  Recent Trades
                </p>
                {trades.slice(0, 5).map(t => (
                  <div key={t.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 0", borderBottom: "1px solid #f5f5f5"
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: t.trade_type === "buy" ? "#f0fdf4" : "#fef2f2",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: t.trade_type === "buy" ? "#22c55e" : "#ef4444",
                      fontSize: 10, fontWeight: 700
                    }}>
                      {t.trade_type === "buy" ? "BUY" : "SELL"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                        {t.trade_type === "buy" ? "Bought" : "Sold"} {t.symbol}
                      </p>
                      <p style={{ fontSize: 11, color: "#aaa" }}>
                        {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p style={{
                      fontSize: 13, fontWeight: 600,
                      color: t.trade_type === "buy" ? "#ef4444" : "#22c55e"
                    }}>
                      {t.trade_type === "buy" ? "-" : "+"}{fmtUSD(t.total)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SECURITY SECTION ══ */}
        {activeSection === "security" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Change password */}
            <div style={{
              border: "1px solid #f0f0f0", borderRadius: 16, padding: 20
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#f5f5f5", display: "flex",
                  alignItems: "center", justifyContent: "center", color: "#666"
                }}><Lock size={16} /></div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Change Password</p>
                  <p style={{ fontSize: 12, color: "#aaa" }}>Update your account password</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "New Password",     value: newPw,      setter: setNewPw },
                  { label: "Confirm Password", value: confirmPw,  setter: setConfirmPw },
                ].map(({ label, value, setter }) => (
                  <div key={label} style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder={label}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 44px 12px 14px",
                        borderRadius: 10, border: "1px solid #f0f0f0",
                        background: "#f8f9fa", fontSize: 14, color: "#111",
                        outline: "none", fontFamily: "inherit",
                        boxSizing: "border-box"
                      }}
                    />
                    <button
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute", right: 12, top: "50%",
                        transform: "translateY(-50%)",
                        background: "none", border: "none",
                        cursor: "pointer", color: "#aaa"
                      }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 100,
                    border: "none", background: "#111", color: "#fff",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    marginTop: 4
                  }}
                >
                  {pwLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>

            {/* Account info */}
            <div style={{
              border: "1px solid #f0f0f0", borderRadius: 16, padding: 20
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 14 }}>
                Account Security
              </p>
              {[
                { label: "Email verified",       status: true  },
                { label: "Two-factor auth",      status: false },
                { label: "Login notifications",  status: true  },
              ].map(({ label, status }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 0",
                  borderBottom: "1px solid #f5f5f5"
                }}>
                  <p style={{ fontSize: 14, color: "#333" }}>{label}</p>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px",
                    borderRadius: 100,
                    color: status ? "#16a34a" : "#f59e0b",
                    background: status ? "#f0fdf4" : "#fffbeb"
                  }}>
                    {status ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div style={{
              border: "1px solid #fecaca", borderRadius: 16,
              padding: 20, background: "#fff"
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", marginBottom: 14 }}>
                Danger Zone
              </p>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", padding: "12px", borderRadius: 100,
                  border: "1px solid #fecaca", background: "#fff",
                  color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}
              >
                Sign Out of All Devices
              </button>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #bbb; }
      `}</style>
    </div>
  );
}