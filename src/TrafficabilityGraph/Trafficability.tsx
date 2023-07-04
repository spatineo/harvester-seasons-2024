/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/namespace */
/* eslint-disable import/default */
import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
// eslint-disable-next-line import/named
import { EChartOption } from "echarts";
import { Box } from "@mui/material";

interface TraficabilityGraphComponentProp {
  option: EChartOption | null;
  onGraphClick: (xAxisData: string) => void;
}

const TraficabilityGraphComponent: React.FC<TraficabilityGraphComponentProp> = ({ option, onGraphClick }) => {
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
    if (chart && option) {
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

  useEffect(() => {
    if (!chart) {
      return;
    }
  
    const handleMouseover = (params: any) => {
      const xAxisData = chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
      if (xAxisData) {
        const date = new Date(xAxisData);
        const formattedDate = date.toISOString();
        onGraphClick(formattedDate);
      }
    };

    chart.getZr().on("click", handleMouseover);

    return () => {
      chart.getZr().off("click", handleMouseover);
    };
  }, [chart, onGraphClick]);
  return <Box ref={graphRef}></Box>;
};

export default TraficabilityGraphComponent;
