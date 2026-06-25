import { useState, useEffect } from "react";
import { fetchAllSparklines } from "../services/cryptoApi";
import { COINS } from "../Utils/constants";

export const useSparklines = () => {
  const [sparklines, setSparklines] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllSparklines(COINS);
      setSparklines(data);
    };
    load();
  }, []);

  return { sparklines };
};