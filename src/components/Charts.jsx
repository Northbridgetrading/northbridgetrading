import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";

function Chart({ data = [] }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#0f172a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    const candleSeries = chart.addSeries(CandlestickSeries);
    candleSeries.setData(data.length > 0 ? data : [
      { time: "2024-01-01", open: 100, high: 110, low: 95, close: 105 },
      { time: "2024-01-02", open: 105, high: 120, low: 100, close: 115 },
      { time: "2024-01-03", open: 115, high: 118, low: 108, close: 112 },
      { time: "2024-01-04", open: 112, high: 130, low: 110, close: 128 },
    ]);

    chartRef.current = chart;
    return () => chart.remove();
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />;
}

export default Chart;  