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
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

const TraficabilityGraphComponent: FC = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [summer, setSummer] = useState<string>("");
  const [winter, setWinter] = useState<string>("");
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  const trafficability = useAppSelector(
    (state: RootState) => state.global.trafficabilityData
  );
  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );

  const trafficabilityOptionData: EChartOption = {
    legend: {},
    grid: {
      height: "80px",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      name: "Traficability",
      nameLocation: "middle",
      nameTextStyle: {
        padding: 18,
      },
    },
    xAxis: {
      type: "time",
    },
    series: [
      {
        type: "line",
        name: "winter",
        areaStyle: {
          color: "rgba(0, 12, 0, 0.3)",
        },
        data: [
          ...trafficability.map(
            (t: { utctime: string; [key: string]: string }) => {
              return [
                new Date(t.utctime).toISOString(),
                ...graphParameters.sixMonthParams.trafficability.map((p) => {
                  if (t[p.code] !== null && Number(t[p.code]) === 0) {
                    return 0;
                  } else if (
                    Number(t[p.code]) > 0.0 &&
                    Number(t[p.code]) <= 0.099999
                  ) {
                    return 1;
                  } else {
                    return 2;
                  }
                }),
              ];
            }
          ),
        ],
      },
      {
        type: "line",
        name: "summer",
        areaStyle: {
          color: "rgba(0, 128, 255, 0.3)",
        },
        data: [
          ...trafficability.map(
            (t: { utctime: string; [key: string]: string }) => {
              return [
                new Date(t.utctime).toISOString(),
                ...graphParameters.sixMonthParams.trafficability.map((p) => {
                  if (t[p.code] !== null && Number(t[p.code]) === 0) {
                    return 0.5;
                  } else if (
                    Number(t[p.code]) > 0.0 &&
                    Number(t[p.code]) <= 0.099999
                  ) {
                    return 1.5;
                  } else {
                    return 2;
                  }
                }),
              ];
            }
          ),
        ],
      },
    ],
  };

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
    if (chart && trafficability) {
      chart.setOption(trafficabilityOptionData);
    }
  }, [chart, trafficability]);


  useEffect(() => {
    if (!chart) {
      return;
    }
    chart.on("mouseover", function () {
      const option = chart.getOption();
      const legendData: string[] | undefined =
        option.legend && option.legend[0] && option.legend[0].data;
    });
  }, [chart]);

  return (
    <Box >

        <div>
          {trafficability.length === 0 ? (
            <div>No data available</div>
          ) : (
            <div ref={graphRef}></div>
          )}
        </div>

    </Box>
  );
};

export default TraficabilityGraphComponent;
