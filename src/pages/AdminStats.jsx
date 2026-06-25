import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { TrendingUp, TrendingDown, Trophy } from "lucide-react";

export default function AdminStats() {
  const [stats, setStats]           = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ count: totalUsers }, { data: profiles }, { data: deposits }, { data: txns }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("id, full_name, email, buying_power"),
        supabase.from("deposit_requests").select("amount, status"),
        supabase.from("transactions").select("*, profiles(full_name, email)").order("created_at", { ascending: false }).limit(20),
      ]);
      const approved = deposits?.filter(d => d.status === "approved") || [];
      setStats({
        totalUsers: totalUsers || 0,
        totalVolume: approved.reduce((a, d) => a + (d.amount || 0), 0),
        totalDeposits: approved.length,
        totalPending: deposits?.filter(d => d.status === "pending").length || 0
      });
      setLeaderboard((profiles || []).sort((a, b) => (b.buying_power || 0) - (a.buying_power || 0)).slice(0, 10));
      setTransactions(txns || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {[
          { label: "Total Users",      value: stats.totalUsers,                           color: "#3b82f6" },
          { label: "Approved Volume",  value: `$${stats.totalVolume.toFixed(2)}`,         color: "#22c55e" },
          { label: "Total Deposits",   value: stats.totalDeposits,                        color: "#8b5cf6" },
          { label: "Pending Deposits", value: stats.totalPending,                         color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
            <Trophy size={18} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Top Traders</h3>
          </div>
          {leaderboard.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "14px" }}>No users yet</p>
          ) : leaderboard.map((u, i) => (
            <div key={u.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: 28, height: 28, borderRadius: "8px", background: i < 3 ? ["#fef3c7","#f1f5f9","#fff7ed"][i] : "#f8fafc", color: i < 3 ? ["#f59e0b","#64748b","#d97706"][i] : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "13px" }}>
                  {i + 1}
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{u.full_name || "—"}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{u.email}</p>
                </div>
              </div>
              <span style={{ fontWeight: "800", fontSize: "15px", color: "#22c55e" }}>${(u.buying_power || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Recent Transactions</h3>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {transactions.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "14px" }}>No transactions yet</p>
            ) : transactions.map((t) => (
              <div key={t.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "8px", background: t.type === "deposit" ? "#f0fdf4" : t.type === "withdrawal" ? "#fef2f2" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {t.type === "deposit" ? <TrendingUp size={14} color="#22c55e" /> : t.type === "withdrawal" ? <TrendingDown size={14} color="#ef4444" /> : <span style={{ fontSize: "12px" }}>💰</span>}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#0f172a", textTransform: "capitalize" }}>{t.type}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{t.profiles?.full_name || t.profiles?.email || "—"}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: t.type === "withdrawal" ? "#ef4444" : "#22c55e" }}>{t.type === "withdrawal" ? "-" : "+"}${t.amount?.toFixed(2)}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}