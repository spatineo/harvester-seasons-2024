/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import { EChartOption } from "echarts";
import { useRootDispatch } from "../store/hooks";
import HeadingComponent from "../HeadingCompnent/HeadingComponent";
import TraficabilityGraph from "../TrafficabilityGraph/Trafficability";
import GraphView from "../GraphView/GraphView";
import FooterComponent from "../FooterComponent/FooterComponent";
import SwitchComponent from "../SwitchComponent/SwitchComponent";
import * as constants from "../store/constants";
import HarvesterMap from "../HarvesterMapComponent/HarvesterMap";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { Parameter } from "../types";

function MainViewComponent() {
  const [trafficabilityGraphOtion, setTrafficabilityGraphOption] =
    useState<any>(null);
  const [summer, setSummer] = useState<string>("");
  const [winter, setWinter] = useState<string>("");
  const dispatch = useRootDispatch();
  const trafficability = useAppSelector(
    (state: RootState) => state.global.trafficabilityData
  );
  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );

  const createOptions = (parameters: Parameter[], values: []) => {
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
            ...values.map((t: { utctime: string; [key: string]: string }) => {
              return [
                new Date(t.utctime).toISOString(),
                ...parameters.map((p) => {
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
            }),
          ],
        },
        {
          type: "line",
          name: "summer",
          areaStyle: {
            color: "rgba(0, 128, 255, 0.3)",
          },
          data: [
            ...values.map((t: { utctime: string; [key: string]: string }) => {
              return [
                new Date(t.utctime).toISOString(),
                ...parameters.map((p) => {
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
            }),
          ],
        },
      ],
    };
    return trafficabilityOptionData;
  };

  useEffect(() => {
    dispatch({ type: constants.TRAFFICABILITY_API });
    dispatch({ type: constants.SOILWETNESS_API });
    dispatch({ type: constants.SOILTEMPERATUE_API });
    dispatch({ type: constants.SNOWHEIGHT_API });
  }, []);

  useEffect(() => {
    if (trafficability) {
      const trafficabilityOption = createOptions(
        graphParameters.sixMonthParams.trafficability,
        trafficability
      );
      setTrafficabilityGraphOption(trafficabilityOption);
    }
  }, [trafficability, graphParameters.sixMonthParams.trafficability]);

  return (
    <Box>
      <Container maxWidth="lg">
        <br />
        <HeadingComponent />
        <br />
        {trafficability.length > 0 ? (
          <TraficabilityGraph option={trafficabilityGraphOtion} />
        ) : (
          <Box className="loading"> Loading  ....</Box>
        )}
        <SwitchComponent />
        <HarvesterMap />
        <Box sx={{ marginTop: "2rem" }}>
          <GraphView />
        </Box>
        <Box sx={{ marginTop: "2rem" }}></Box>
        <br />
        <br />
        <FooterComponent />
      </Container>
    </Box>
  );
}
export default MainViewComponent;
