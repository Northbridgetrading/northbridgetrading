// hooks/useChartData.js
import { useState, useEffect } from "react";
import { fetchChartData } from "../services/cryptoApi";

export const useChartData = (selectedCoin, activeTime) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadChart = async () => {
      setLoading(true);
      try {
        const data = await fetchChartData(selectedCoin.symbol, activeTime);
        setChartData(data);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChart();
  }, [selectedCoin, activeTime]);
  
  return { chartData, loading };
};