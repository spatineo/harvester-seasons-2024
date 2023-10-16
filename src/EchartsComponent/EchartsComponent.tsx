/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import { EChartOption } from "echarts";

interface ChartProps {
  option: EChartOption;
  height: number;
}

const EchartsComponent: React.FC<ChartProps> = ({ option, height }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

  
   const myChart = echarts.init(chartRef.current, undefined, );
   window.addEventListener('resize', () => myChart.resize());
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    }
  }, [option, chartRef.current]);

  return (
    <Box
      ref={chartRef}
      sx={{
        width: "96%",
        display: "flex",
        flex: "row",
        alignItems: "center",
        height: `${height}px`,
      }}
    ></Box>
  );
};

export default EchartsComponent