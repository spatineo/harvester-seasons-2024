/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import { EChartOption } from "echarts";

interface ChartProps {
  option: EChartOption;
  height: number;
  onEvents?: {
    [key: string]: (params: any, echartsInstance: echarts.ECharts) => void;
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
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const myChart = echarts.init(chartRef.current, undefined);
    window.addEventListener("resize", () => myChart.resize());
    setChart(myChart);
    
  }, [chartRef.current]);

  useEffect(() => {
    if(!chart) return;
    chart.on('globalout', mousedown);
    chart.setOption(option)
  }, [chart, option, onEvents])


  return (
    <Box
      style={{ width: "100%", height: `${height}px`, margin: "auto" }}
      ref={chartRef}
    ></Box>
  );
};

export default EchartsComponent;
