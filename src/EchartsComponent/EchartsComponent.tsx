import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import { EChartOption } from "echarts";

interface ChartProps {
  option: EChartOption;
  height: number;
  onEvents?: {
    [key: string]: (
      params: Record<string, string>,
      echartsInstance: echarts.ECharts
    ) => void;
  };
  mousedown: () => void;
}

const EchartsComponent: React.FC<ChartProps> = ({
  option,
  height,
  onEvents,
  mousedown,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [graphChart, setGraphChart] = useState<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current);

    if (!chart.isDisposed()) {
      setGraphChart(chart);
    }

    const handleResize = () => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!graphChart) return;
    graphChart.setOption(option);
  }, [option, graphChart]);

  useEffect(() => {
    if (!graphChart) return;
    graphChart.on("globalout", mousedown);
  }, [graphChart, onEvents]);

  return (
    <Box
      style={{ width: "100%", height: `${height}px`, margin: "auto" }}
      ref={chartRef}
    ></Box>
  );
};

export default EchartsComponent;
