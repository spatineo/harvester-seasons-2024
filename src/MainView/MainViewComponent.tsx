/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Container, Box, ListItemButton, Collapse } from "@mui/material";
import { EChartOption } from "echarts";
import { useRootDispatch } from "../store/hooks";
import TraficabilityGraph from "../TrafficabilityGraph/Trafficability";
import GraphView from "../GraphView/GraphView";
import SwitchComponent from "../SwitchComponent/SwitchComponent";
import * as constants from "../store/constants";
import HarvesterMap from "../HarvesterMapComponent/HarvesterMap";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { Parameter } from "../types";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import testimonial from '../assets/testimonial_metsateho1.png';

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
  const mark = useAppSelector((state: RootState) => state.global.markLine );
  const [open, setOpen] = useState(false);
	const information = useAppSelector((state) => state.language);

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
          label: {
            show: false,
          },
          type: "line",
          seriesLayoutBy: "row",
          markLine: {
            data: [
              {
                xAxis: mark,
                name: "",
                type: "min",
                label: { show: false },
              },
            ],
            symbol: 'none',
            lineStyle: {
            type: 'solid',
            width: 3,
            },
          },
        },
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
  }, [trafficability, graphParameters.sixMonthParams.trafficability, mark]);
  
  const handleClick = () => {
		setOpen(!open);
	};


  return (
    <Box>
      <Container maxWidth="lg">
        <Box>
					<ListItemButton onClick={handleClick} style={{ paddingLeft: '0px', width: '26%' }}>
						{open ? <ExpandLess /> : <ExpandMore />}{' '}
						{languages.info[information.en as keyof LanguageOptions]}
					</ListItemButton>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ width: '80%', margin: '2rem auto' }}>
							<Box component="img" src={testimonial} sx={{ width: '80%' }} />
						</Box>
						<Box>{languages.overviewBody[information.en as keyof LanguageOptions]}</Box>
					</Collapse>
				</Box>
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
      </Container>
    </Box>
  );
}
export default MainViewComponent;
