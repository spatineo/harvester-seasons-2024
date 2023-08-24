/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { TimelineControlStyle } from "../types";
import HarvesterSeasons from "../HarvesterChartComponent/HarvesterChartComponent";
import { createOptions } from "../utils/graphHelpers";
import {
  getDatesForTimelineDuration,
  marklineStartDate,
  getStartSearchDate,
} from "../utils/helpers";
import { actions } from "../globalSlice";

export interface Time {
  utctime: string;
}

/* function getState(
  state: RootState,
  data: string,
  selectorFn: (state: RootState) => any
) {
  return selectorFn(state.global[data]);
} */

const Graphs: React.FC = () => {
  //Created a function to call state data using strings  'soilTemperatureData' - option one
 /*  const selectedSoilTemperature = getState(
    useAppSelector((state: RootState) => state),
    "soilTemperatureData",
    (state: RootState) => state
  ); */

  //console.log(selectedSoilTemperature)

  //option two - calling the object state.gloabl once
  const globalStateObject = useAppSelector((state: RootState) => state.global);

  const checked = useAppSelector((state: RootState) => state.global.checked);
  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );
  const markLineDate = useAppSelector(
    (state: RootState) => state.global.markLine
  );
  const [soilWetnessOption, setSoilWetnessOption] = useState<null | {}>(null);
  const [soilTemperatureOption, setSoilTemperatureOption] = useState<null | {}>(
    null
  );
  const [snowHeightOption, setSnowHeightOption] = useState<null | {}>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineGraph, setTimelineGraph] = useState<null | echarts.ECharts>(
    null
  );
  const [markLineValue, setMarkLineValue] = useState<string>(
    marklineStartDate(getStartSearchDate())
  );
  const dispatch = useRootDispatch();
  useEffect(() => {
    const result = new Date(marklineStartDate(getStartSearchDate()));
    result.setDate(result.getDate() + 2);
    const dateValue: Array<string | Date> = getDatesForTimelineDuration(
      result,
      6,
      true
    );
    const option: any = {
      timeline: {
        data: dateValue,
        autoPlay: false,
        playInterval: 1000,
        left: "center",
        bottom: 0,
        width: "100%",
        height: "50%",
        label: {
          position: "bottom",
          show: false,
          interval: 2,
          rotate: 0,
          color: "#333",
          fontWeight: "normal",
          fontSize: 12,
          align: "center",
        },
        controlStyle: {
          position: "left",
          showPlayBtn: true,
          showPrevBtn: true,
          showNextBtn: true,
          itemSize: 18,
          itemGap: 8,
          normal: {
            color: "#333",
          },
          emphasis: {
            color: "#1e90ff",
          },
        } as TimelineControlStyle,
      },
    };

    if (timelineGraph) {
      timelineGraph.setOption(option);
    }

    if (timelineGraph) {
      timelineGraph.on("timelinechanged", function (params: any) {
        const value = params.currentIndex; // get the index of the current data point
        const timelineData = (option?.timeline?.data as string[]) || [];
        if (timelineData[value]) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          dispatch(actions.setMarkLine(`${timelineData[value]}`));
          setMarkLineValue(`${timelineData[value]}`);
        }
      });
    }
  }, [timelineGraph]);

  useEffect(() => {
    if (!timelineRef.current) {
      throw Error("Echarts not available");
    }
    // eslint-disable-next-line import/namespace
    const timeline: any = echarts.init(timelineRef.current, undefined, {
      height: "70",
    });
    setTimelineGraph(timeline);
    return () => {
      if (timeline) {
        timeline.dispose();
      }
    };
  }, [timelineRef]);

  useEffect(() => {
    if (
      globalStateObject.soilWetnessData ||
      globalStateObject.soilTemperatureData ||
      globalStateObject.snowHeightData
    ) {
      if (!checked) {
        const soilWetness = createOptions(
          { title: "Soil Wetness" },
          graphParameters.twelveMonthParams.soilWetness,
          globalStateObject.soilWetnessData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const soilTemperature = createOptions(
          { title: "Soil Temperature" },
          graphParameters.twelveMonthParams.soilTemperature,
          globalStateObject.soilTemperatureData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const snowHeight = createOptions(
          { title: "Snow Height" },
          graphParameters.twelveMonthParams.snowHeight,
          globalStateObject.snowHeightData,
          markLineDate,
          [0, 0, 22, 0]
        );
        setSoilWetnessOption(soilWetness);
        setSnowHeightOption(snowHeight);
        setSoilTemperatureOption(soilTemperature);
      } else {
        const soilWetness = createOptions(
          { title: "Soil Wetness" },
          graphParameters.tenYearParams.soilWetness,
          globalStateObject.soilWetnessData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const soilTemperature = createOptions(
          { title: "Soil Temperature" },
          graphParameters.tenYearParams.soilTemperature,
          globalStateObject.soilTemperatureData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const snowHeight = createOptions(
          { title: "Snow Height" },
          graphParameters.tenYearParams.snowHeight,
          globalStateObject.snowHeightData,
          markLineDate,
          [0, 0, 22, 0]
        );
        setSnowHeightOption(snowHeight);
        setSoilTemperatureOption(soilTemperature);
        setSoilWetnessOption(soilWetness);
      }
    }
  }, [
    globalStateObject.soilWetnessData,
    globalStateObject.snowHeightData,
    globalStateObject.soilTemperatureData,
    graphParameters.twelveMonthParams.soilWetness,
    graphParameters.twelveMonthParams.soilTemperature,
    graphParameters.twelveMonthParams.snowHeight,
    graphParameters.tenYearParams.soilTemperature,
    graphParameters.tenYearParams.snowHeight,
    graphParameters.tenYearParams.soilWetness,
    markLineDate,
  ]);

  return (
    <Box sx={{ position: "relative", top: "2rem" }}>
      <Box sx={{ fontFamily: "Lato" }}>
        {new Date(markLineValue).toLocaleDateString()}
      </Box>
      <Box ref={timelineRef}></Box>
      <Box>
        {globalStateObject.soilWetnessData &&
        globalStateObject.soilWetnessData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilWetnessOption !== null ? soilWetnessOption : {}}
            height={300}
          />
        )}
      </Box>
      <Box>
        {globalStateObject.soilTemperatureData &&
        globalStateObject.soilTemperatureData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilTemperatureOption !== null ? soilTemperatureOption : {}}
            height={300}
          />
        )}
      </Box>
      <Box>
        {globalStateObject.snowHeightData &&
        globalStateObject.snowHeightData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={snowHeightOption !== null ? snowHeightOption : {}}
            height={300}
          />
        )}
      </Box>
    </Box>
  );
};

export default Graphs;
