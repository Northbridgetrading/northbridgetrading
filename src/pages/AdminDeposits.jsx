import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CheckCircle, XCircle, Clock, Plus, Search } from "lucide-react";

export default function AdminDeposits() {
  const [deposits, setDeposits]     = useState([]);
  const [filter, setFilter]         = useState("pending");
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [users, setUsers]           = useState([]);
  const [manual, setManual]         = useState({ user_id: "", amount: "", note: "" });

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("deposit_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setDeposits(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
   supabase.from("profiles").select("id, full_name").then(({ data }) => setUsers(data || []));
  }, []);

  // Helper to get user info from users array
  const getUserInfo = (user_id) => {
  const u = users.find(u => u.id === user_id);
  return {
    name: u?.full_name || "User",
    email: user_id?.slice(0, 20) + "..."
  };
};

  const confirm = async (deposit) => {
    await supabase
      .from("deposit_requests")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", deposit.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("buying_power, total_deposited")
      .eq("id", deposit.user_id)
      .single();

    const newBP = (profile?.buying_power || 0) + deposit.amount;
    const newTD = (profile?.total_deposited || 0) + deposit.amount;

    await supabase
      .from("profiles")
      .update({
        buying_power: newBP,
        total_deposited: newTD,
        updated_at: new Date().toISOString()
      })
      .eq("id", deposit.user_id);

    await supabase.from("transactions").insert({
      user_id: deposit.user_id,
      type: "deposit",
      amount: deposit.amount,
      status: "completed",
      created_at: new Date().toISOString()
    });

    notify("✅ Deposit approved & balance updated");
    load();
  };

  const reject = async (id) => {
    await supabase
      .from("deposit_requests")
      .update({ status: "rejected", approved_at: new Date().toISOString() })
      .eq("id", id);
    notify("❌ Deposit rejected");
    load();
  };

  const addManual = async () => {
    const amt = parseFloat(manual.amount);
    if (!manual.user_id || isNaN(amt) || amt <= 0) return notify("❌ Fill all fields correctly");

    await supabase.from("deposit_requests").insert({
      user_id: manual.user_id,
      amount: amt,
      wallet_address: "MANUAL",
      status: "approved",
      created_at: new Date().toISOString(),
      approved_at: new Date().toISOString()
    });

    const { data: profile } = await supabase
      .from("profiles")
      .select("buying_power, total_deposited")
      .eq("id", manual.user_id)
      .single();

    await supabase.from("profiles").update({
      buying_power: (profile?.buying_power || 0) + amt,
      total_deposited: (profile?.total_deposited || 0) + amt,
      updated_at: new Date().toISOString()
    }).eq("id", manual.user_id);

    await supabase.from("transactions").insert({
      user_id: manual.user_id,
      type: "deposit",
      amount: amt,
      status: "completed",
      created_at: new Date().toISOString()
    });

    notify("✅ Balance manually added");
    setManual({ user_id: "", amount: "", note: "" });
    setManualOpen(false);
    load();
  };

  const filtered = deposits.filter(d => {
    const matchStatus = filter === "all" || d.status === filter;
    const { name, email } = getUserInfo(d.user_id);
    return matchStatus && (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusColor = { pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444" };
  const statusBg    = { pending: "#fffbeb", approved: "#f0fdf4", rejected: "#fef2f2" };

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "#0f172a", color: "white", padding: "12px 20px", borderRadius: "12px", fontSize: "13px", zIndex: 999, fontWeight: "600" }}>
          {toast}
        </div>
      )}

      {manualOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", width: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Manually Add Balance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Select User</label>
                <select value={manual.user_id} onChange={e => setManual({ ...manual, user_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" }}>
                  <option value="">Choose user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || u.username || u.email || u.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Amount (USD)</label>
                <input type="number" value={manual.amount} onChange={e => setManual({ ...manual, amount: e.target.value })} placeholder="e.g. 500"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Note (optional)</label>
                <input value={manual.note} onChange={e => setManual({ ...manual, note: e.target.value })} placeholder="e.g. BTC deposit confirmed"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button onClick={addManual} style={{ flex: 1, padding: "12px", background: "#22c55e", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>Add Balance</button>
                <button onClick={() => setManualOpen(false)} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {["pending", "approved", "rejected", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 16px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: filter === s ? "#0f172a" : "#f1f5f9", color: filter === s ? "white" : "#64748b" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user..."
              style={{ paddingLeft: "30px", padding: "8px 14px 8px 30px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none", background: "white" }} />
          </div>
          <button onClick={() => setManualOpen(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
            <Plus size={14} /> Manual Add
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["User", "Amount", "Wallet Address", "Status", "Date", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No Pending deposits found</td></tr>
            ) : filtered.map((d, i) => {
              const { name, email } = getUserInfo(d.user_id);
              return (
                <tr key={d.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{email}</p>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>${d.amount?.toLocaleString()}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontFamily: "monospace", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.wallet_address || "—"}
                    </p>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", background: statusBg[d.status] || "#f1f5f9", color: statusColor[d.status] || "#64748b", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {d.status === "pending" && <Clock size={11} />}
                      {d.status === "approved" && <CheckCircle size={11} />}
                      {d.status === "rejected" && <XCircle size={11} />}
                      {d.status?.charAt(0).toUpperCase() + d.status?.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#64748b" }}>{new Date(d.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 20px" }}>
                    {d.status === "pending" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => confirm(d)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#f0fdf4", color: "#22c55e", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px" }}>
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => reject(d.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px" }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}