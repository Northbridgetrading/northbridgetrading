import { useState } from "react";
import { supabase } from "../supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f8fafc"
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "40px",
        width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1a1a2e" }}>
          N
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px" }}>
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
          {isLogin ? "Sign in to your trading account" : "Start with $10,000 virtual balance"}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "10px" }}>{error}</p>}
        {message && <p style={{ color: "#22c55e", fontSize: "13px", marginTop: "10px" }}>{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", marginTop: "16px", padding: "12px",
            background: "#6366f1", color: "#fff", border: "none",
            borderRadius: "10px", fontSize: "15px", fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "16px" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "#6366f1", cursor: "pointer", fontWeight: "600" }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1px solid #e2e8f0", fontSize: "14px", color: "#1a1a2e",
  background: "#f8fafc", outline: "none", boxSizing: "border-box"
};

export default Auth;