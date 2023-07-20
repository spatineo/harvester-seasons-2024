/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Container, Box, ListItemButton, Collapse } from "@mui/material";
import { EChartOption } from 'echarts';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import TraficabilityGraph from "../TrafficabilityGraph/Trafficability";
import GraphView from "../GraphView/GraphView";
import SwitchComponent from "../SwitchComponent/SwitchComponent";
import * as constants from "../store/constants";
import HarvesterMap from "../HarvesterMapComponent/HarvesterMap"
import OpacityComponent from "../Opacity/OpacityComponent"
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import testimonial from "../assets/testimonial_metsateho1.png";
import { createTrafficabilityGraphOptions } from "../utils";
import { actions } from "../globalSlice";

function MainViewComponent() {
  const [trafficabilityGraphOption, setTrafficabilityGraphOption] =
  useState<EChartOption | null>(null);
  const [summer, setSummer] = useState<string>("");
  const [winter, setWinter] = useState<string>("");
  const dispatch = useRootDispatch();
  const trafficability = useAppSelector(
    (state: RootState) => state.global.trafficabilityData
  );
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
  }, []);

  useEffect(() => {
    if (trafficability) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const trafficabilityOption = createTrafficabilityGraphOptions(
        graphParameters.sixMonthParams.trafficability,
        trafficability,
        mark
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setTrafficabilityGraphOption(trafficabilityOption);
    }
  }, [trafficability, graphParameters.sixMonthParams.trafficability, mark]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
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
        {trafficability.length > 0 ? (
          <TraficabilityGraph
            option={trafficabilityGraphOption}
            onGraphClick={function (xAxisData: string): void {
              dispatch(actions.setMarkLine(xAxisData))
            }}
          />
        ) : (
          <Box className="loading"> Loading ....</Box>
        )}
        <SwitchComponent />
        <HarvesterMap />
        <Box sx={{ width: '30%', marginLeft: 'auto', marginRight: 'auto'}}>
          <OpacityComponent />
        </Box>
        <Box sx={{ marginTop: "2rem" }}>
          <GraphView />
        </Box>
        <Box sx={{ marginTop: "2rem" }}></Box>
      </Container>
    </Box>
  );
}
export default MainViewComponent;
