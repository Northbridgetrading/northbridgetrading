// pages/components/common/Sparkline.jsx
import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export const Sparkline = ({ data, up }) => (
  <ResponsiveContainer width={64} height={32}>
    <LineChart data={data}>
      <Line
        type="monotone"
        dataKey="value"
        stroke={up ? "#22c55e" : "#ef4444"}
        strokeWidth={1.5}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
);