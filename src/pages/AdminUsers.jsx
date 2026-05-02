import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Search, Edit2, Trash2, Ban, CheckCircle, X, Save } from "lucide-react";

function ActionBtn({ icon, color, title, onClick }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 32, height: 32, borderRadius: "8px", border: "none", background: `${color}18`, color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </button>
  );
}

export default function AdminUsers() {
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(null);
  const [editBalance, setEditBalance] = useState("");
  const [toast, setToast]           = useState("");

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateBalance = async (userId) => {
    const val = parseFloat(editBalance);
    if (isNaN(val) || val < 0) return notify("❌ Invalid balance");
    await supabase.from("profiles").update({ balance: val }).eq("id", userId);
    notify("✅ Balance updated");
    setEditing(null);
    load();
  };

  const toggleSuspend = async (user) => {
    await supabase.from("profiles").update({ is_suspended: !user.is_suspended }).eq("id", user.id);
    notify(user.is_suspended ? "✅ User unsuspended" : "⚠️ User suspended");
    load();
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    await supabase.from("profiles").delete().eq("id", userId);
    notify("🗑️ User deleted");
    load();
  };

  const filtered = users.filter(u =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.country || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "#0f172a", color: "white", padding: "12px 20px", borderRadius: "12px", fontSize: "13px", zIndex: 999, fontWeight: "600" }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            style={{ paddingLeft: "36px", padding: "10px 16px 10px 36px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", width: "280px", outline: "none", background: "white" }} />
        </div>
        <span style={{ fontSize: "13px", color: "#94a3b8" }}>{filtered.length} users</span>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["User", "Country", "Balance", "Status", "Joined", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No users found</td></tr>
            ) : filtered.map((user, i) => (
              <tr key={user.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #1e293b, #334155)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
                      {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{user.full_name || "—"}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{user.email || "—"}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#64748b" }}>{user.country || "—"}</td>
                <td style={{ padding: "14px 20px" }}>
                  {editing === user.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} autoFocus
                        style={{ width: "100px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none" }} />
                      <button onClick={() => updateBalance(user.id)} style={{ background: "#22c55e", border: "none", borderRadius: "6px", padding: "6px 8px", cursor: "pointer", color: "white", display: "flex" }}><Save size={14} /></button>
                      <button onClick={() => setEditing(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: "6px", padding: "6px 8px", cursor: "pointer", color: "#64748b", display: "flex" }}><X size={14} /></button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>
                      ${(user.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", background: user.is_suspended ? "#fef2f2" : "#f0fdf4", color: user.is_suspended ? "#ef4444" : "#22c55e" }}>
                    {user.is_suspended ? "Suspended" : "Active"}
                  </span>
                  {user.is_admin && <span style={{ marginLeft: "6px", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", background: "#fffbeb", color: "#f59e0b" }}>Admin</span>}
                </td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#64748b" }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <ActionBtn icon={<Edit2 size={14} />} color="#3b82f6" title="Edit Balance" onClick={() => { setEditing(user.id); setEditBalance(user.balance || 0); }} />
                    <ActionBtn icon={user.is_suspended ? <CheckCircle size={14} /> : <Ban size={14} />} color={user.is_suspended ? "#22c55e" : "#f59e0b"} title={user.is_suspended ? "Unsuspend" : "Suspend"} onClick={() => toggleSuspend(user)} />
                    <ActionBtn icon={<Trash2 size={14} />} color="#ef4444" title="Delete User" onClick={() => deleteUser(user.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}