// pages/components/sheets/SearchSheet.jsx
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { COINS, MOCK_NEWS } from "../../Utils/constants";
import { fmt, fmtUSD } from "../../Utils/formatters";

export const SearchSheet = ({ isOpen, onClose, positions, prices, setSelectedCoin, setShowCoinDetail }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ coins: [], positions: [], news: [] });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ coins: [], positions: [], news: [] });
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const matchedCoins = COINS.filter(coin =>
      coin.name.toLowerCase().includes(lowerQuery) ||
      coin.symbol.toLowerCase().includes(lowerQuery)
    );

    const matchedPositions = positions.filter(pos =>
      pos.symbol.toLowerCase().includes(lowerQuery) ||
      pos.name?.toLowerCase().includes(lowerQuery)
    ).map(pos => {
      const coin = COINS.find(c => c.symbol === pos.symbol);
      const price = prices[pos.symbol]?.price || 0;
      return { ...pos, coin, value: price * pos.quantity };
    });

    const matchedNews = MOCK_NEWS.filter(news =>
      news.title.toLowerCase().includes(lowerQuery) ||
      news.source.toLowerCase().includes(lowerQuery)
    );

    setSearchResults({
      coins: matchedCoins,
      positions: matchedPositions,
      news: matchedNews
    });
  }, [searchQuery, positions, prices]);

  if (!isOpen) return null;

  const totalResults = searchResults.coins.length + searchResults.positions.length + searchResults.news.length;

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    setShowCoinDetail(true);
    onClose();
    setSearchQuery("");
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 40,
          backdropFilter: "blur(2px)"
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: "0 0 20px 20px",
          padding: "20px 24px",
          zIndex: 50,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: "#666"
              }}
            >
              ←
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111" }}>Search</h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "12px 16px",
              border: "1px solid #e5e7eb"
            }}
          >
            <Search size={20} color="#aaa" />
            <input
              type="text"
              placeholder="Search coins, portfolio, news..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                fontSize: 16,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#aaa"
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {searchQuery && (
            <p style={{ fontSize: 12, color: "#aaa", marginTop: 12 }}>
              Found {totalResults} result{totalResults !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {searchQuery && totalResults === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Search size={48} color="#ddd" />
            <p style={{ fontSize: 14, color: "#aaa", marginTop: 16 }}>
              No results found for "{searchQuery}"
            </p>
          </div>
        )}

        {searchResults.coins.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 }}>
              Cryptocurrencies ({searchResults.coins.length})
            </h3>
            {searchResults.coins.map(coin => {
              const p = prices[coin.symbol];
              const up = (p?.change24h ?? 0) >= 0;
              return (
                <div
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    marginBottom: 4,
                    background: "#fff"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${coin.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      color: coin.color,
                      flexShrink: 0
                    }}
                  >
                    {coin.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{coin.name}</p>
                    <p style={{ fontSize: 12, color: "#aaa" }}>{coin.symbol}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                      {p ? fmtUSD(p.price) : "···"}
                    </p>
                    <p style={{ fontSize: 12, color: up ? "#22c55e" : "#ef4444" }}>
                      {p ? `${up ? "+" : ""}${fmt(p.change24h)}%` : "···"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchResults.positions.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 }}>
              Your Portfolio ({searchResults.positions.length})
            </h3>
            {searchResults.positions.map(pos => (
              <div
                key={pos.id}
                onClick={() => {
                  if (pos.coin) handleSelectCoin(pos.coin);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  marginBottom: 4,
                  background: "#fff"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${pos.coin?.color || "#111"}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: pos.coin?.color || "#111",
                    flexShrink: 0
                  }}
                >
                  {pos.coin?.icon || pos.symbol[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{pos.symbol}</p>
                  <p style={{ fontSize: 12, color: "#aaa" }}>{fmt(pos.quantity, 4)} shares</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{fmtUSD(pos.value)}</p>
                  <p style={{ fontSize: 12, color: "#22c55e" }}>
                    {fmt((pos.value / (pos.quantity * pos.avg_buy_price) - 1) * 100)}% return
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults.news.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 }}>
              News ({searchResults.news.length})
            </h3>
            {searchResults.news.map((news, idx) => (
              <div
                key={idx}
                style={{
                  padding: "14px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  marginBottom: 4,
                  background: "#fff"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#111" }}>{news.source}</span>
                  <span style={{ fontSize: 11, color: "#aaa" }}>{news.time}</span>
                </div>
                <p style={{ fontSize: 14, color: "#111", lineHeight: 1.4 }}>{news.title}</p>
              </div>
            ))}
          </div>
        )}

        {!searchQuery && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 }}>
              🔥 Trending
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["BTC", "ETH", "SOL", "DOGE", "XRP"].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 100,
                    border: "none",
                    background: "#f8f9fa",
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};