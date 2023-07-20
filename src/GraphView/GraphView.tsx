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
import {
  getDatesForDuration,
  setDateTwoDaysAhead,
  createOptions,
} from "../utils";
import { actions } from "../globalSlice";

export interface Time {
  utctime: string;
}

const Graphs = () => {
  const soilTemperatureData = useAppSelector(
    (state: RootState) => state.global.soilTemperatureData
  );
  const checked = useAppSelector((state: RootState) => state.global.checked);
  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );
  const soilWetnessData = useAppSelector(
    (state: RootState) => state.global.soilWetnessData
  );
  const snowHeightData = useAppSelector(
    (state: RootState) => state.global.snowHeightData
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
  const [timelineGraph, setTimelineGraph] = useState<any>(null);
  const start = setDateTwoDaysAhead();
  const [markLineValue, setMarkLineValue] = useState<string>(start);
  const dispatch = useRootDispatch();

  useEffect(() => {
    const result = new Date();
    result.setDate(result.getDate() + 2);
    const dateValue: Array<string | Date> = getDatesForDuration(
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
      timelineGraph.setOption(
        option as echarts.EChartOption<echarts.EChartOption.Series>,
        true
      );
    }

    if (timelineGraph) {
      timelineGraph.on("timelinechanged", function (params: any) {
        const value = params.currentIndex; // get the index of the current data point
        const timelineData = option?.timeline?.data;
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
    if (soilWetnessData || soilTemperatureData || snowHeightData) {
      if (!checked) {
        const soilWetness = createOptions(
          { title: "Soil Wetness" },
          graphParameters.sixMonthParams.soilWetness,
          soilWetnessData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const soilTemperature = createOptions(
          { title: "Soil Temperature" },
          graphParameters.sixMonthParams.soilTemperature,
          soilTemperatureData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const snowHeight = createOptions(
          { title: "Snow Height" },
          graphParameters.sixMonthParams.snowHeight,
          snowHeightData,
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
          soilWetnessData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const soilTemperature = createOptions(
          { title: "Soil Temperature" },
          graphParameters.tenYearParams.soilTemperature,
          soilTemperatureData,
          markLineDate,
          [0, 0, 16, 0]
        );
        const snowHeight = createOptions(
          { title: "Snow Height" },
          graphParameters.tenYearParams.snowHeight,
          snowHeightData,
          markLineDate,
          [0, 0, 22, 0]
        );
        setSnowHeightOption(snowHeight);
        setSoilTemperatureOption(soilTemperature);
        setSoilWetnessOption(soilWetness);
      }
    }
  }, [
    soilWetnessData,
    snowHeightData,
    soilTemperatureData,
    graphParameters.sixMonthParams.soilWetness,
    graphParameters.sixMonthParams.soilTemperature,
    graphParameters.sixMonthParams.snowHeight,
    graphParameters.tenYearParams.soilTemperature,
    graphParameters.tenYearParams.snowHeight,
    graphParameters.tenYearParams.soilWetness,
    markLineDate,
  ]);

  return (
    <Box sx={{ position: 'relative', top: '2rem'}}>
      <Box sx={{ fontFamily: "Lato" }}>
        {new Date(markLineValue).toLocaleDateString()}
      </Box>
      <Box ref={timelineRef}></Box>
      <Box>
        {soilWetnessData && soilWetnessData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilWetnessOption !== null ? soilWetnessOption : {}}
          />
        )}
      </Box>
      <Box>
        {soilTemperatureData && soilTemperatureData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilTemperatureOption !== null ? soilTemperatureOption : {}}
          />
        )}
      </Box>
      <Box>
        {snowHeightData && snowHeightData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={snowHeightOption !== null ? snowHeightOption : {}}
          />
        )}
      </Box>
    </Box>
  );
};

export default Graphs;
