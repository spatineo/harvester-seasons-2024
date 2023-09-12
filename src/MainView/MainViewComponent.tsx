/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { EChartOption } from "echarts";
import TraficabilityGraph from "../TrafficabilityGraph/Trafficability";
import GraphView from "../GraphView/GraphView";
import SwitchComponent from "../SwitchComponent/SwitchComponent";
import * as constants from "../store/constants";
import HarvesterMap from "../HarvesterMapComponent/HarvesterMap";
import OpacityComponent from "../Opacity/OpacityComponent";
import CarbonText from "../CarbonText/CarbonText";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { createTrafficabilityGraphOptions } from "../utils/graphHelpers";
import { actions } from "../globalSlice";
import {
  harvidx,
  ensembleListSmartIdx,
  scalingFunction,
  ensover,
} from "../utils/helpers";

interface YValues {
  seriesName: string | undefined;
  yValue: number;
}

/* const useStyles = makeStyles((theme) => ({

}) */
function MainViewComponent() {
  const [trafficabilityGraphOption, setTrafficabilityGraphOption] =
    useState<EChartOption | null>(null);
  const [summer, setSummer] = useState<string>("");
  const [winter, setWinter] = useState<string>("");
  const [windGust, setWindGust] = useState<number | null>(null);
  const [yAxisValues, setYAxisValues] = useState<YValues[] | null>(null);
  const dispatch = useRootDispatch();
  const {
    soilWetnessData,
    soilTemperatureData,
    snowHeightData,
    trafficabilityData,
    windSpeedData,
  } = useAppSelector((state: RootState) => state.global);

  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );
  const { markLine }= useAppSelector((state: RootState) => state.global);

  useEffect(() => {
    dispatch({ type: constants.TRAFFICABILITY_API });
    dispatch({ type: constants.SOILWETNESS_API });
    dispatch({ type: constants.SOILTEMPERATUE_API });
    dispatch({ type: constants.SNOWHEIGHT_API });
    dispatch({ type: constants.WINDGUST_API });
  }, []);

  useEffect(() => {
    if (!soilWetnessData || !snowHeightData || !soilTemperatureData) {
      return;
    }
    const ensembleSoilWetness = ensembleListSmartIdx(
      soilWetnessData,
      "SWVL2-M3M3:SMARTMET:5015"
    );
   
    const ensembleSnowHeight = ensembleListSmartIdx(
      snowHeightData,
      "HSNOW-M:SMARTOBS:13:4"
    );
    const dataSWscaled = scalingFunction(
      soilWetnessData,
      ensembleSoilWetness.ensembleList,
      ensembleSoilWetness.smartId,
      50,
      "SWVL2-M3M3:SMARTMET:5015"
    );
    
    const dataSHscaled = scalingFunction(
      snowHeightData,
      ensembleSnowHeight.ensembleList,
      ensembleSnowHeight.smartId,
      50,
      "HSNOW-M:SMARTOBS:13:4",
      "HSNOW-M:SMARTMET:5027"
    );

    const summer1series = harvidx(
      0.4,
      dataSWscaled,
      ensembleSoilWetness.ensembleList,
      50,
      "SWVL2-M3M3:SMARTMET:5015"
    );
    
    const winter1series = ensover(
      0.4,
      0.9,
      dataSHscaled,
      ensembleSnowHeight.ensembleList,
      50,
      "HSNOW-M:SMARTOBS:13:4"
    );   
    if (trafficabilityData || windSpeedData) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const trafficabilityOption = createTrafficabilityGraphOptions(
        graphParameters.twelveMonthParams.trafficability,
        trafficabilityData,
        windSpeedData,
        markLine,
        yAxisValues,
        summer1series,
        winter1series
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setTrafficabilityGraphOption(trafficabilityOption);
    }
  }, [
    trafficabilityData,
    soilWetnessData,
    graphParameters.twelveMonthParams.trafficability,
    markLine,
    windSpeedData,
    yAxisValues,
  ]);

  return (
    <Container maxWidth="lg">
      <Box>
        {trafficabilityData.length > 0 ? (
          <TraficabilityGraph
            option={trafficabilityGraphOption}
            onGraphClick={function (xAxisData: string): void {
              dispatch(actions.setMarkLine(xAxisData));
            }}
            onMouseOver={(newyAxisValues: YValues[]) => {
              setYAxisValues(newyAxisValues);
            }}
          />
        ) : (
          <Box className="loading"> Loading ....</Box>
        )}
      </Box>

      <SwitchComponent />
      <HarvesterMap />
      <Box
        sx={{
          width: "30%",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        <OpacityComponent />
      </Box>
      <Box sx={{ position: "relative", top: "4rem" }}>
        <CarbonText />
      </Box>
      <Box sx={{ top: "4rem", position: "relative" }}>
        <GraphView />
      </Box>
      <Box sx={{ marginTop: "2rem" }}></Box>
    </Container>
  );
}
export default MainViewComponent;
