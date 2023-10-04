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
}

const EchartsCompoent: React.FC<ChartProps> = ({ option, height }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!chartRef.current) {
      return;
    }
    const newChart = echarts.init(chartRef.current);
  

    newChart.setOption(option);
    window.addEventListener('resize', () => newChart.resize());
  
    return () => {
      if (newChart) {
        newChart.dispose();
      }
    };
  }, [chartRef.current, option]);

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

export default EchartsCompoent;
