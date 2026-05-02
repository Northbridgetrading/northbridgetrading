import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  LayoutDashboard, Users, ArrowDownCircle, Bell,
  BarChart2, LogOut, Shield, Menu, X
} from "lucide-react";

const NAV = [
  { label: "Overview",      icon: <LayoutDashboard size={18} />, path: "/admin" },
  { label: "Users",         icon: <Users size={18} />,           path: "/admin/users" },
  { label: "Deposits",      icon: <ArrowDownCircle size={18} />, path: "/admin/deposits" },
  { label: "Notifications", icon: <Bell size={18} />,            path: "/admin/notifications" },
  { label: "Stats",         icon: <BarChart2 size={18} />,       path: "/admin/stats" },
];

function AdminOverview({ stats, navigate }) {
  const cards = [
    { label: "Total Users",      value: stats.users,                   color: "#3b82f6", bg: "#eff6ff" },
    { label: "Pending Deposits", value: stats.pending,                 color: "#ef4444", bg: "#fef2f2" },
    { label: "Total Deposits",   value: stats.deposits,                color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Confirmed Volume", value: `$${(stats.volume||0).toFixed(2)}`, color: "#22c55e", bg: "#f0fdf4" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <div style={{ width: 44, height: 44, borderRadius: "12px", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "20px", fontWeight: "800", color: c.color }}>N</span>
            </div>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 6px" }}>{c.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{c.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {[
          { title: "👥 Manage Users",       desc: "View, edit balance, suspend or delete users",   path: "/admin/users" },
          { title: "💰 Review Deposits",    desc: "Confirm or reject pending deposit requests",    path: "/admin/deposits" },
          { title: "🔔 Send Notification",  desc: "Broadcast messages to users",                   path: "/admin/notifications" },
          { title: "📊 Platform Stats",     desc: "View trading volume and leaderboard",           path: "/admin/stats" },
        ].map((q) => (
          <div key={q.title} onClick={() => navigate(q.path)}
            style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>{q.title}</h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{q.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminLayout({ session }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState({ users: 0, deposits: 0, pending: 0, volume: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: users }, { count: deposits }, { data: pending }, { data: vol }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("deposits").select("*", { count: "exact", head: true }),
        supabase.from("deposits").select("id").eq("status", "pending"),
        supabase.from("deposits").select("amount").eq("status", "confirmed"),
      ]);
      const volume = vol?.reduce((a, d) => a + (d.amount || 0), 0) || 0;
      setStats({ users: users || 0, deposits: deposits || 0, pending: pending?.length || 0, volume });
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const isOverview = location.pathname === "/admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: open ? "220px" : "64px", background: "#0f172a", display: "flex",
        flexDirection: "column", transition: "width 0.25s", flexShrink: 0,
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 200, overflow: "hidden"
      }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={18} color="white" />
          </div>
          {open && <span style={{ color: "white", fontWeight: "700", fontSize: "15px", whiteSpace: "nowrap" }}>Admin Panel</span>}
        </div>

        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "10px 16px", display: "flex", justifyContent: open ? "flex-end" : "center" }}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav style={{ flex: 1, padding: "8px" }}>
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div key={item.path} onClick={() => navigate(item.path)} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px",
                borderRadius: "10px", cursor: "pointer", marginBottom: "4px",
                whiteSpace: "nowrap", overflow: "hidden",
                background: active ? "rgba(245,158,11,0.15)" : "transparent",
                color: active ? "#f59e0b" : "#94a3b8", transition: "all 0.2s",
              }}>
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {open && <span style={{ fontSize: "14px", fontWeight: active ? "600" : "400" }}>{item.label}</span>}
                {open && item.label === "Deposits" && stats.pending > 0 && (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "white", borderRadius: "999px", fontSize: "11px", fontWeight: "700", padding: "1px 7px" }}>
                    {stats.pending}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #1e293b" }}>
          {open && (
            <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session?.user?.email}
            </p>
          )}
          <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#ef4444", padding: "8px 0" }}>
            <LogOut size={18} />
            {open && <span style={{ fontSize: "14px" }}>Logout</span>}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: open ? "220px" : "64px", flex: 1, transition: "margin-left 0.25s", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
            {NAV.find(n => n.path === location.pathname)?.label || "Overview"}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} color="white" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Admin</span>
          </div>
        </div>

        <div style={{ flex: 1, padding: "28px" }}>
          {isOverview ? <AdminOverview stats={stats} navigate={navigate} /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}