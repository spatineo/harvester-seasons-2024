/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { EChartOption } from "echarts";
import TraficabilityGraph from "../TrafficabilityGraph/Trafficability";
import GraphView from "../GraphView/GraphView";
import * as constants from "../store/constants";
import HarvesterMap from "../HarvesterMapComponent/HarvesterMap";
import OpacityComponent from "../Opacity/OpacityComponent";
import CarbonText from "../CarbonText/CarbonText";
import TimelineSlider from "../TimelineSlider/TimelineSlider";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { actions as action } from "../globalSlice";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import { RootState } from "../store/store";
import { createTrafficabilityGraphOptions } from "../utils/graphHelpers";
import {
  ensembleListSmartIdx,
  scalingFunction,
  ensover,
} from "../utils/helpers";

function MainViewComponent() {
  const [trafficabilityGraphOption, setTrafficabilityGraphOption] =
    useState<EChartOption | null>(null);

  const dispatch = useRootDispatch();
  const {
    soilWetnessData,
    soilTemperatureData,
    snowHeightData,
    trafficabilityData,
    windSpeedData,
  } = useAppSelector((state: RootState) => state.global);
  const information = useAppSelector((state) => state.language);

  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );
  const { markLine } = useAppSelector((state: RootState) => state.global);
  const { lang } = useAppSelector((state: RootState) => state.language);

  useEffect(() => {
    dispatch({ type: constants.TRAFFICABILITY_API });
    dispatch({ type: constants.SOILWETNESS_API });
    dispatch({ type: constants.SOILTEMPERATUE_API });
    dispatch({ type: constants.SNOWHEIGHT_API });
    dispatch({ type: constants.WINDGUST_API });
    dispatch({ type: constants.SETWMSLAYERINFORMATION})
  }, []);

  useEffect(() => {
    if (!soilWetnessData || !snowHeightData || !soilTemperatureData) {
      return;
    }

    const ensembleSnowHeight = ensembleListSmartIdx(
      snowHeightData,
      "HSNOW-M:SMARTOBS:13:4"
    );
   
    const dataSHscaled = scalingFunction(
      snowHeightData,
      ensembleSnowHeight.ensembleList,
      ensembleSnowHeight.smartId,
      50,
      "HSNOW-M:SMARTOBS:13:4",
      "HSNOW-M:SMARTMET:5027"
    );

    const winter1series = ensover(
      0.4,
      0.9,
      dataSHscaled,
      ensembleSnowHeight.ensembleList,
      50,
      "HSNOW-M:SMARTOBS:13:4"
    );
    const languageObject = {
      summerIndex: languages.summmerIndex[
        information.lang as keyof LanguageOptions
      ] as string,
      winterIndex: languages.winterIndex[
        information.lang as keyof LanguageOptions
      ] as string,
      windGust: languages.WindGust[
        information.lang as keyof LanguageOptions
      ] as string,
      winterTenDays: languages.summerTenDays[
        information.lang as keyof LanguageOptions
      ] as string,
      summerTenDays: languages.winterTenDays[
        information.lang as keyof LanguageOptions
      ] as string,
    };
    if (trafficabilityData || windSpeedData) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const trafficabilityOption = createTrafficabilityGraphOptions(
        graphParameters.twelveMonthParams.trafficability,
        trafficabilityData,
        windSpeedData,
        markLine,
        winter1series,
        languageObject,
        lang
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setTrafficabilityGraphOption(trafficabilityOption);
    }
  }, [
    trafficabilityData,
    soilWetnessData,
    snowHeightData,
    graphParameters.twelveMonthParams.trafficability,
    markLine,
    windSpeedData,
    information.lang,
  ]);

  return (
    <Container maxWidth="lg">
      <Box>
        {(trafficabilityData.length > 0 &&  soilWetnessData.length > 0 ) ? (
          <TraficabilityGraph
            markline={markLine}
            option={trafficabilityGraphOption}
            onGraphClick={function (xAxisData: string): void {
              dispatch(action.setMarkLine(xAxisData));
            }}
          />
        ) : (
          <Box className="loading"> Loading ....</Box>
        )}
      </Box>
      <Box sx={{position: "relative", bottom: "0rem"}}>
        <TimelineSlider />
      </Box>
      <Box sx={{ position: "relative", top: "0rem"}}>
        <HarvesterMap />
      </Box>
      <Box sx={{ position: "relative", top: "0rem"}}>
        <OpacityComponent />
      </Box>
      <Box sx={{ position: "relative", top: "1.4rem" }}>
        <CarbonText />
      </Box>
      <Box sx={{ top: "2rem", position: "relative" }}>
        <GraphView />
      </Box>
      <Box sx={{ marginTop: "2rem" }}></Box>
    </Container>
  );
}
export default MainViewComponent;
