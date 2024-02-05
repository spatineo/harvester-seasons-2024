/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import { EChartOption } from "echarts";

type EventParams = {
  componentType: string;
  seriesType: string;
  seriesIndex: number;
  seriesName: string;
  name: string;
  dataIndex: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: Object;
  dataType: string;
  value: number | Array<any> | any;
  color: string;
};

interface ChartProps {
  option: EChartOption;
  height: number;
  setValuesProps: (data: [string | null, ...number[]]) => void;
  setMouseOver : (param: Record<string, string | number>[] | null) => void;
  setMouseOut: (param: [] | null) => void;
}

const EchartsComponent: React.FC<ChartProps> = ({
  option,
  height,
  setValuesProps,
  setMouseOver,
  setMouseOut
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const myChart = echarts.init(chartRef.current, undefined);
    window.addEventListener("resize", () => myChart.resize());
    myChart.on("mouseover", setMouseOver)/* function (params: EventParams) {
      const date: any = params.value[0];
      const yValues: number[] = [];

      option.series?.forEach((series) => {
        if (Array.isArray(series.data)) {
          series.data.forEach((dataItem: any) => {
            if (dataItem[0] === date) {
              yValues.push(dataItem[1]);
            }
          });
        }
      });
      setValuesProps([date, ...yValues]);
    }) */;
    myChart.on('globalout', setMouseOut)
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [option, chartRef.current, setValuesProps, setMouseOver, setMouseOut]);

  return (
    <Box
      style={{ width: "100%", height: `${height}px`, margin: "auto" }}
      ref={chartRef}
    ></Box>
  );
};

export default EchartsComponent;
