import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Send, Bell, Trash2, Users, User } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers]   = useState([]);
  const [form, setForm]     = useState({ user_id: "", title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState("");

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = async () => {
    const { data } = await supabase.from("notifications").select("*, profiles(full_name, email)").order("created_at", { ascending: false });
    setNotifications(data || []);
  };

  useEffect(() => {
    load();
    supabase.from("profiles").select("id, full_name, email").then(({ data }) => setUsers(data || []));
  }, []);

  const send = async () => {
    if (!form.title || !form.message) return notify("❌ Title and message required");
    setLoading(true);
    await supabase.from("notifications").insert({ user_id: form.user_id || null, title: form.title, message: form.message });
    notify("✅ Notification sent!");
    setForm({ user_id: "", title: "", message: "" });
    load();
    setLoading(false);
  };

  const deleteNotif = async (id) => {
    await supabase.from("notifications").delete().eq("id", id);
    load();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "24px" }}>
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "#0f172a", color: "white", padding: "12px 20px", borderRadius: "12px", fontSize: "13px", zIndex: 999, fontWeight: "600" }}>
          {toast}
        </div>
      )}

      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", height: "fit-content" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={18} color="#f59e0b" /> Send Notification
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Recipient</label>
            <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" }}>
              <option value="">📢 Broadcast to ALL users</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Deposit Confirmed"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Message</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message here..." rows={4}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <button onClick={send} disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "#f59e0b", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "14px", opacity: loading ? 0.7 : 1 }}>
            <Send size={16} /> {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Sent Notifications</h3>
        </div>
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "14px" }}>No notifications sent yet</p>
          ) : notifications.map((n) => (
            <div key={n.id} style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", background: n.user_id ? "#eff6ff" : "#fef3c7", color: n.user_id ? "#3b82f6" : "#d97706", display: "flex", alignItems: "center", gap: "4px" }}>
                    {n.user_id ? <><User size={10} /> Personal</> : <><Users size={10} /> Broadcast</>}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{n.title}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{n.message}</p>
                {n.profiles && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>To: {n.profiles.full_name || n.profiles.email}</p>}
              </div>
              <button onClick={() => deleteNotif(n.id)} style={{ background: "#fef2f2", border: "none", borderRadius: "8px", padding: "6px 8px", cursor: "pointer", color: "#ef4444", marginLeft: "12px", flexShrink: 0 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}