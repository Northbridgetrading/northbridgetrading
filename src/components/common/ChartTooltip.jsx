// pages/components/common/ChartTooltip.jsx
import React from "react";
import { fmtUSD } from "../../Utils/formatters";

export const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      padding: "6px 10px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      fontSize: 13,
      fontWeight: 600,
      color: "#111",
      border: "none"
    }}>
      {fmtUSD(payload[0].value)}
    </div>
  );
};