/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Container, Box, ListItemButton, Collapse } from "@mui/material";
import { EChartOption } from "echarts";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import TraficabilityGraph from "../TrafficabilityGraph/Trafficability";
import GraphView from "../GraphView/GraphView";
import SwitchComponent from "../SwitchComponent/SwitchComponent";
import * as constants from "../store/constants";
import HarvesterMap from "../HarvesterMapComponent/HarvesterMap";
import OpacityComponent from "../Opacity/OpacityComponent";
import CarbonText from "../CarbonText/CarbonText";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import testimonial from "../assets/testimonial_metsateho1.png";
import { createTrafficabilityGraphOptions } from "../utils/graphHelpers";
import { actions } from "../globalSlice";
import { harvidx, dataScaled, scalingFunction } from "../utils/helpers";

interface YValues {
  seriesName: string | undefined;
  yValue: number;
}

function MainViewComponent() {
  const [trafficabilityGraphOption, setTrafficabilityGraphOption] =
    useState<EChartOption | null>(null);
  const [summer, setSummer] = useState<string>("");
  const [winter, setWinter] = useState<string>("");
  const [windGust, setWindGust] = useState<number | null>(null);
  const [yAxisValues, setYAxisValues] = useState<YValues[] | null>(null);
  const dispatch = useRootDispatch();
  const globalState = useAppSelector((state: RootState) => state.global);

  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );
  const mark = useAppSelector((state: RootState) => state.global.markLine);
  const [open, setOpen] = useState(false);
  const information = useAppSelector((state) => state.language);

  useEffect(() => {
    dispatch({ type: constants.TRAFFICABILITY_API });
    dispatch({ type: constants.SOILWETNESS_API });
    dispatch({ type: constants.SOILTEMPERATUE_API });
    dispatch({ type: constants.SNOWHEIGHT_API });
    dispatch({ type: constants.WINDGUST_API });
  }, []);

  useEffect(() => {
    if (globalState.trafficabilityData || globalState.windSpeedData ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const trafficabilityOption = createTrafficabilityGraphOptions(
        graphParameters.twelveMonthParams.trafficability,
        globalState.trafficabilityData,
        globalState.windSpeedData,
        mark,
        yAxisValues
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setTrafficabilityGraphOption(trafficabilityOption);
    }
  }, [
    globalState.trafficabilityData,
    graphParameters.twelveMonthParams.trafficability,
    mark,
    globalState.windSpeedData,
    yAxisValues
  ]);

  useEffect(() => {
    if (!globalState.soilWetnessData) {
      return;
    }
    /*  const scaledData = dataScaled(globalState.soilWetnessData, "SWVL2-M3M3:SMARTMET:5015")
    
    window.console.log('scaledData.dataSWscaled',scaledData.dataSWscaled)
    const dataSWscaled = scalingFunction(globalState.soilWetnessData, scaledData.ensembleList, scaledData.smartId, 50, "SWVL2-M3M3:SMARTMET:5015");
    const havardx = harvidx(0.4, globalState.soilWetnessData, scaledData.dataSWscaled, 50, "SWVL2-M3M3:SMARTMET:5015");
    window.console.log(havardx) */
    //console.log(scaledData)
  }, [globalState.soilWetnessData]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <ListItemButton
          onClick={handleClick}
          style={{ paddingLeft: "0px", width: "26%" }}
        >
          {open ? <ExpandLess /> : <ExpandMore />}{" "}
          {languages.info[information.en as keyof LanguageOptions]}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ width: "80%", margin: "2rem auto" }}>
            <Box component="img" src={testimonial} sx={{ width: "80%" }} />
          </Box>
          <Box>
            {languages.overviewBody[information.en as keyof LanguageOptions]}
          </Box>
        </Collapse>
      </Box>
      <Box>
        {globalState.trafficabilityData.length > 0 ? (
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
