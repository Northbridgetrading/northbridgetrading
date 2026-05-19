// hooks/usePrices.js
import { useState, useEffect } from "react";
import { fetchCryptoPrices } from "../services/cryptoApi";
import { COINS } from "../Utils/constants";

export const usePrices = () => {
  const [prices, setPrices] = useState({});
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await fetchCryptoPrices(COINS);
        setPrices(data);
      } catch (error) {
        console.error("Price fetch failed:", error);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return prices;
};