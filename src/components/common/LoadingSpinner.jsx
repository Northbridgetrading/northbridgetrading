// pages/components/common/LoadingSpinner.jsx
import React from "react";

export const LoadingSpinner = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff"
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: "2.5px solid #f0f0f0",
        borderTopColor: "#111",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite"
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);