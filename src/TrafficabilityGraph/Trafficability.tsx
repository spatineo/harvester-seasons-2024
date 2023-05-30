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
  const trafficability = useAppSelector(
    (state: RootState) => state.global.trafficabilityData
  );
  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );

  useEffect(() => {
    if (!graphRef.current) {
      throw Error("No graph ref available");
    }
    const graph = echarts.init(graphRef.current!, undefined, {
      height: "180",
    });

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
					name: 'winter',
					areaStyle: {
						color: 'rgba(0, 12, 0, 0.3)',
					},
          data: [
            ...trafficability.map(
              (t: { utctime: string; [key: string]: string }) => {
                return [
                  new Date(t.utctime).toISOString(),
                  ...graphParameters.sixMonthParams.trafficability.map((p) => {
                    if (t[p.code] !== null && Number(t[p.code]) === 0) {
                      return 0;
                    } else if(Number(t[p.code]) > 0.0000 && Number(t[p.code]) <= 0.099999){
											return 1
										} else {
											return 2
										}
                  }),
                ];
              }
            ),
          ],
        },
        {
          type: "line",
					name: 'summer',
					areaStyle: {
						color: 'rgba(0, 128, 255, 0.3)',
					},
          data: [
            ...trafficability.map(
              (t: { utctime: string; [key: string]: string }) => {
                return [new Date(t.utctime).toISOString(), 0, 1, 2];
              }
            ),
          ],
        },
      ],
    };

    graph.setOption(trafficabilityOptionData);

    graph.getZr().on("click", function (params) {
      const pointInPixel = [params.offsetX, params.offsetY];
      const pointInGrid = graph.convertFromPixel(
        { gridIndex: 0 },
        pointInPixel
      );
      const xAxis = graph.getOption().xAxis;
      const xAxisData = (Array.isArray(xAxis) ? xAxis[0] : xAxis)?.data;
      const xValue = xAxisData !== undefined && xAxisData[pointInGrid[0]];
    });

    return () => {
      if (graph) {
        graph.dispose();
      }
    };
  }, [graphRef, trafficability]);

  const trafficabilityDate = () => {
    return trafficability.map((traffic: { [key: string]: string | number }) => {
      /*  const date = new Date(traffic.utctime).toUTCString()
        return date.substring(7, 17) */
      const modifiedDate = new Date(traffic.utctime).toDateString();
      return modifiedDate.substring(3);
    });
  };

  const trafficabilityGraph = () => {
    return (
      <Box>
        <Box ref={graphRef}></Box>
      </Box>
    );
  };

  return <Box>{trafficabilityGraph()}</Box>;
};

export default TraficabilityGraphComponent;
