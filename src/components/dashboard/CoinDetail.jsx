// src/pages/components/dashboard/CoinDetail.jsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { TIME_FILTERS } from "../../Utils/constants";
import { fmt, fmtUSD } from "../../Utils/formatters";
import { ChartTooltip } from "../common/ChartTooltip";

export const CoinDetail = ({
  isMobile,
  selectedCoin,
  displayPrice,
  coinPrice,
  coinChange,
  isUp,
  chartData,
  activeTime,
  setActiveTime,
  hoveredVal,
  setHoveredVal,
  ownedPosition,
  setTradeMode,
  setShowTradeSheet
}) => (
  <div style={{ padding: isMobile ? "0 0 80px" : "28px 32px" }}>
    {isMobile && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid #f5f5f5"
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "#111"
          }}
        >
          ←
        </button>
        <p style={{ fontSize: 16, fontWeight: 600 }}>{selectedCoin.name}</p>
      </div>
    )}

    <div style={{ padding: isMobile ? "20px" : "0" }}>
      <div style={{ marginBottom: 4 }}>
        <p
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#111",
            letterSpacing: "-0.5px"
          }}
        >
          {displayPrice ? fmtUSD(displayPrice) : "Loading..."}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          {isUp ? (
            <ArrowUpRight size={14} color="#22c55e" />
          ) : (
            <ArrowDownRight size={14} color="#ef4444" />
          )}
          <span
            style={{
              fontSize: 13,
              color: isUp ? "#22c55e" : "#ef4444",
              fontWeight: 500
            }}
          >
            {coinChange !== undefined
              ? `${isUp ? "+" : ""}${fmt(coinChange)}%`
              : "···"}{" "}
            Today
          </span>
        </div>
      </div>

      <div style={{ margin: "16px -8px" }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={chartData}
            onMouseMove={e => {
              if (e.activePayload) setHoveredVal(e.activePayload[0].value);
            }}
            onMouseLeave={() => setHoveredVal(null)}
          >
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isUp ? "#22c55e" : "#ef4444"}
                  stopOpacity={0.1}
                />
                <stop
                  offset="100%"
                  stopColor={isUp ? "#22c55e" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isUp ? "#22c55e" : "#ef4444"}
              strokeWidth={1.5}
              fill="url(#cg)"
              dot={false}
              activeDot={{
                r: 3,
                fill: isUp ? "#22c55e" : "#ef4444",
                strokeWidth: 0
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        {TIME_FILTERS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTime(t)}
            style={{
              padding: "5px 10px",
              borderRadius: 100,
              border: "none",
              background: activeTime === t ? "#111" : "transparent",
              color: activeTime === t ? "#fff" : "#aaa",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 24
        }}
      >
        {[
          { label: "Price", value: coinPrice ? fmtUSD(coinPrice) : "···" },
          {
            label: "24h Change",
            value:
              coinChange !== undefined
                ? `${isUp ? "+" : ""}${fmt(coinChange)}%`
                : "···"
          },
          {
            label: "You own",
            value: ownedPosition ? `${fmt(ownedPosition.quantity, 6)}` : "—"
          },
          {
            label: "Total value",
            value: ownedPosition
              ? fmtUSD(ownedPosition.quantity * (coinPrice || 0))
              : "—"
          }
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#f8f9fa",
              borderRadius: 12,
              padding: "12px 14px"
            }}
          >
            <p style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => {
            setTradeMode("buy");
            setShowTradeSheet(true);
          }}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 100,
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Buy
        </button>
        <button
          onClick={() => {
            setTradeMode("sell");
            setShowTradeSheet(true);
          }}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 100,
            border: "none",
            background: "#f5f5f5",
            color: "#111",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Sell
        </button>
      </div>
    </div>
  </div>
);