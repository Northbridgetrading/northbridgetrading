// hooks/useWatchlist.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export const useWatchlist = (userId) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const { data } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", userId);
        setWatchlist(data || []);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) loadWatchlist();
  }, [userId]);
  
  const toggleWatchlist = useCallback(async (coin) => {
    const existing = watchlist.find(w => w.symbol === coin.symbol);
    
    if (existing) {
      await supabase.from("watchlist").delete().eq("id", existing.id);
      setWatchlist(prev => prev.filter(w => w.symbol !== coin.symbol));
    } else {
      const { data } = await supabase.from("watchlist").insert({
        user_id: userId,
        symbol: coin.symbol,
        name: coin.name,
        asset_type: "crypto"
      }).select().single();
      if (data) setWatchlist(prev => [...prev, data]);
    }
  }, [watchlist, userId]);
  
  const isWatched = useCallback((symbol) => {
    return watchlist.some(w => w.symbol === symbol);
  }, [watchlist]);
  
  return { watchlist, loading, toggleWatchlist, isWatched };
};