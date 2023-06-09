/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { Parameter, TimelineControlStyle } from "../types";
import HarvesterSeasons from "../HarvesterChartComponent/HarvesterChartComponent";
import { getDatesForDuration, setDateTwoDaysAhead } from "../utils";

interface GraphOptions {
  title: string;
}
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
  const snowHeightData = useAppSelector(
    (state: RootState) => state.global.snowHeight
  );
  const soilWetnessData = useAppSelector(
    (state: RootState) => state.global.soilWetnessData
  );
  const [soilWetnessOption, setSoilWetnessOption] = useState<any>(null);
  const [soilTemperatureOption, setSoilTemperatureOption] = useState<any>(null);
  const [snowHeightOption, setSnowHeightOption] = useState<any>(null);
  const [selectedYValues, setSelectedYValues] = useState<any>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineGraph, setTimelineGraph] = useState<any>(null);
  const start = setDateTwoDaysAhead();
  const [markLineValue, setMarkLineValue] = useState<string>(start);

  function initialLabels() {
    const obj: { [key: string]: string } = {};

    for (let i = 1; i <= 50; i++) {
      obj[`SH-${i}`] = "";
    }

    return obj;
  }

  const handleSetValuesProps = (data: [string | null, ...number[]]) => {
    setSelectedYValues(data);
  };

  const createOptions = useCallback(
    (opts: GraphOptions, parameters: Parameter[], values: [], mark: string, padding: [number, number, number, number]) => {
      const marked = new Date(mark).toISOString();
      return {
        animation: false,
        animationThreshold: 1,
        grid: {},
        tooltip: {
          trigger: "item",
        },
        yAxis: {
          name: opts.title,
          nameLocation: "middle",
          nameTextStyle: {
            padding,
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
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  xAxis: marked,
                  name: "",
                  type: "min",
                  label: { show: false },
                },
              ],
              symbol: "none",
              lineStyle: {
                type: "solid",
                width: 3,
                arrow: "none",
              },
            },
          },
          ...parameters.map((p: { code: string }, i: number) => {
            const codes = p.code;
            return {
              type: "line",
              name: `SH-${i}`,
              data: values.map(
                (d: { utctime: string; [key: string]: string }) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return [d.utctime, d[codes]];
                }
              ),
            };
          }),
        ],
      };
    },
    []
  );

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
          markLineValue,
          [0, 0, 16, 0]
        );
        const soilTemperature = createOptions(
          { title: "Soil Temperature" },
          graphParameters.sixMonthParams.soilTemperature,
          soilTemperatureData,
          markLineValue,
          [0, 0, 16, 0]
        );
        const snowHeight = createOptions(
          { title: "Snow Height" },
          graphParameters.sixMonthParams.snowHeight,
          snowHeightData,
          markLineValue,
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
          markLineValue,
          [0, 0, 16, 0]
        );
        const soilTemperature = createOptions(
          { title: "Soil Temperature" },
          graphParameters.tenYearParams.soilTemperature,
          soilTemperatureData,
          markLineValue,
          [0, 0, 16, 0]
        );
        const snowHeight = createOptions(
          { title: "Snow Height" },
          graphParameters.tenYearParams.snowHeight,
          snowHeightData,
          markLineValue,
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
    markLineValue,
  ]);

  const graphLabels = () => {
    if (selectedYValues.length > 0) {
      return (
        <Box
          sx={{ display: "-ms-flexbox", flexDirection: "row" }}
          component="span"
        >
          {selectedYValues.map(
            (value: number | string | null, index: number) => {
              return (
                <Box
                  component="span"
                  key={index}
                  sx={{
                    fontFamily: "Helvetica, monospace",
                    fontWeight: "200",
                    fontSize: "0.8rem",
                  }}
                >
                  {index !== 0
                    ? `SH-${index}: ${((value as number) % 1).toFixed(2)} `
                    : `${value}: `}
                </Box>
              );
            }
          )}
        </Box>
      );
    } else {
      const initialLabelValues = initialLabels();
      return (
        <span>
          {Object.keys(initialLabelValues).map((key: string, index: number) => (
            <Box
              component="span"
              key={index}
              sx={{
                fontFamily: "Helvetica, monospace",
                fontWeight: "200",
                fontSize: "0.8rem",
              }}
            >
              {`${key}: ${initialLabelValues[key]} `}
            </Box>
          ))}
        </span>
      );
    }
  };

  return (
    <Box>
      <Box>{markLineValue}</Box>
      <Box ref={timelineRef}></Box>
      <Box sx={{ width: "80%", margin: "4rem auto 0rem", minHeight: "110px" }}>
        {graphLabels()}
      </Box>
      <Box>
        {soilWetnessData && soilWetnessData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilWetnessOption}
            handleClick={(d) => {}}
            handleOnmouseEnter={handleSetValuesProps}
          />
        )}
      </Box>
      <Box>
        {soilTemperatureData && soilTemperatureData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilTemperatureOption}
            handleClick={() => {}}
            handleOnmouseEnter={handleSetValuesProps}
          />
        )}
      </Box>
      <Box>
        {snowHeightData && snowHeightData.length === 0 ? (
          <Box className="loading" >Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={snowHeightOption}
            handleClick={(d: any) => {}}
            handleOnmouseEnter={handleSetValuesProps}
          />
        )}
      </Box>
    </Box>
  );
};

export default Graphs;
