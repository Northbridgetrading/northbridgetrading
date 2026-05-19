// hooks/useSparklines.js
import { useState, useEffect } from "react";
import { fetchSparkline } from "../services/cryptoApi";
import { COINS } from "../Utils/constants";

export const useSparklines = () => {
  const [sparklines, setSparklines] = useState({});
  
  useEffect(() => {
    const fetchAllSparklines = async () => {
      const results = {};
      await Promise.all(
        COINS.map(async (coin) => {
          const data = await fetchSparkline(coin.symbol);
          results[coin.symbol] = data;
        })
      );
      setSparklines(results);
    };
    
    fetchAllSparklines();
  }, []);
  
  return sparklines;
};