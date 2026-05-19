// hooks/usePortfolio.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { STARTING_BALANCE } from "../Utils/constants";

export const usePortfolio = (userId) => {
  const [buyingPower, setBuyingPower] = useState(STARTING_BALANCE);
  const [totalDeposited, setTotalDeposited] = useState(STARTING_BALANCE);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!userId) return;
      
      try {
        const [
          { data: profile },
          { data: pos },
          { data: tr }
        ] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).single(),
          supabase.from("positions").select("*").eq("user_id", userId),
          supabase.from("trades").select("*").eq("user_id", userId)
            .order("created_at", { ascending: false }).limit(20),
        ]);
        
        if (profile) {
          setBuyingPower(profile.buying_power ?? STARTING_BALANCE);
          setTotalDeposited(profile.total_deposited ?? STARTING_BALANCE);
        }
        setPositions(pos || []);
        setTrades(tr || []);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPortfolio();
  }, [userId]);
  
  const updateBuyingPower = useCallback(async (newBuyingPower) => {
    setBuyingPower(newBuyingPower);
    await supabase
      .from("profiles")
      .update({ buying_power: newBuyingPower })
      .eq("id", userId);
  }, [userId]);
  
  const addTrade = useCallback(async (trade) => {
    const { data } = await supabase
      .from("trades")
      .insert(trade)
      .select()
      .single();
    if (data) setTrades(prev => [data, ...prev]);
    return data;
  }, []);
  
  const updatePosition = useCallback(async (position) => {
    const { data } = await supabase
      .from("positions")
      .upsert(position, { onConflict: "user_id,symbol" })
      .select()
      .single();
    if (data) {
      setPositions(prev => {
        const filtered = prev.filter(p => p.symbol !== position.symbol);
        return [...filtered, data];
      });
    }
    return data;
  }, []);
  
  const deletePosition = useCallback(async (positionId) => {
    await supabase.from("positions").delete().eq("id", positionId);
    setPositions(prev => prev.filter(p => p.id !== positionId));
  }, []);
  
  return {
    buyingPower,
    totalDeposited,
    positions,
    trades,
    loading,
    updateBuyingPower,
    addTrade,
    updatePosition,
    deletePosition
  };
};