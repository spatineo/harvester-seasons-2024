/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/namespace */
/* eslint-disable import/default */
import React, { useState, FC, useEffect, useRef } from "react";
import * as echarts from "echarts";
// eslint-disable-next-line import/named
import { EChartOption } from "echarts";
import { Box } from "@mui/material";

interface TraficabilityGraphComponentProp {
  option: EChartOption;
}

const TraficabilityGraphComponent: FC<TraficabilityGraphComponentProp> = ({ option }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  useEffect(() => {
    if (graphRef.current) {
      const newChart = echarts.init(graphRef.current, undefined, {
        height: "180",
      });

      setChart(newChart);
    }

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chart) {
      chart.setOption(option);
    }
  }, [chart, option]);

  useEffect(() => {
    if (!chart) {
      return;
    }
  
    const handleMouseover = (params) => {
      if (params.data) {
        const seriesIndex = params.seriesIndex;
        const series = chart.getOption()?.series?.[seriesIndex];

        if (series && series.name && series.data) {
          const seriesName = series.name;
          const dataIndex = params.dataIndex;
          const dataValue = series.data[dataIndex];
          // console.log(`Hovered over ${seriesName}: ${dataValue}`);
          console.log(`${seriesName}`);
        }
      }
    };



    chart.on('mouseover', handleMouseover);
  }, [chart]);

  return <Box ref={graphRef}></Box>;
};

export default TraficabilityGraphComponent;
