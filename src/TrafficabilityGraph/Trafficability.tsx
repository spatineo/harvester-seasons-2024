/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
// eslint-disable-next-line import/named
import { EChartOption } from "echarts";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { actions } from "../globalSlice";
import { RootState } from "../store/store";

interface TraficabilityGraphComponentProp {
  option: EChartOption | null;
  onGraphClick: (xAxisData: string) => void;
  markline: string;
}

const TraficabilityGraphComponent: React.FC<
  TraficabilityGraphComponentProp
> = ({ option, onGraphClick, markline }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphChart, setGraphChart] = useState<echarts.ECharts | null>(null);
  const [arrowColor, setArrowColor] = useState<"primary" | "secondary">(
    "primary"
  );
  const { hideNext, hideArrowPrevious } = useAppSelector(
    (state: RootState) => state.global
  );
  const dispatch = useRootDispatch();

  const handleDoubleClick = (direction: string) => {
    if (direction === "prev") {
      dispatch(actions.changeYear("previous"));
      dispatch(actions.changeHideNextArrowState(false));
      dispatch(actions.setHideArrowPreviousState(true));
    } else if (direction === "next") {
      dispatch(actions.changeYear("next"));
      dispatch(actions.changeHideNextArrowState(true));
      dispatch(actions.setHideArrowPreviousState(false));
    }
  };

  const handleArrowMouseover = () => {
    setArrowColor("secondary");
  };

  const handleArrowMouseout = () => {
    setArrowColor("primary");
  };

  useEffect(() => {
    if (!graphRef.current || !option) return;
    const newChart = echarts.init(graphRef.current, undefined, {
      height: "200",
      useCoarsePointer: undefined,
    });
    if (!newChart.isDisposed()) {
      setGraphChart(newChart);
    }

    const handleResize = () => {
      if (newChart && !newChart.isDisposed()) {
        newChart.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      newChart.dispose();
    };
  }, []);

  useEffect(() => {
    if (!graphChart || option === null) return;
    graphChart.setOption(option, { notMerge: true, lazyUpdate: false });
  }, [option]);

  useEffect(() => {
    if (!graphChart || !markline) return;
    let val: number | undefined;
    const calculateDataIndex = (seriesData: [], xAxisValue) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      const formatDateWithoutTime = (dateString: Date) => {
        const dateWithTime = new Date(dateString);
        const dateWithoutTime = new Date(
          dateWithTime.getFullYear(),
          dateWithTime.getMonth(),
          dateWithTime.getDate()
        );
        return dateWithoutTime;
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call

      for (let i = 0; i < seriesData.length; i++) {
        const dataPoint = seriesData[i];
        const formattedDataPoint = formatDateWithoutTime(
          new Date(dataPoint[0])
        );
        const formattedXAxisValue = formatDateWithoutTime(new Date(xAxisValue));
        const timestampXAxisValue = formattedXAxisValue.getTime();
        const timestampDataPoint = formattedDataPoint.getTime();
        if (timestampDataPoint === timestampXAxisValue) {
          return i;
        }
      }
      return undefined;
    };
    if (graphChart !== null || option !== null || !markline) {
      const finals: number[] = [];

      if (graphChart.getOption() !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = graphChart.getOption() as any;
        options?.series?.forEach((series) => {
          if (series.data) {
            const date = new Date(markline);
            const formattedDate = date.toISOString();
            const dataIndex = calculateDataIndex(series.data, formattedDate);

            if (dataIndex !== undefined) {
              const yValue: unknown = series.data[dataIndex];

              if (Array.isArray(yValue)) {
                const numericValues = yValue
                  .filter((value) => typeof value === "number")
                  .map((value) => Number(value));
                if (numericValues.length === 0) {
                  finals.push(0);
                } else if (numericValues.length > 0) {
                  const uniqueNumericValues = Array.from(
                    new Set([...numericValues])
                  );
                  finals.push(...uniqueNumericValues);
                }
              }
            }
          }
        });
      }
      graphChart.getZr().on("click", (params) => {
        const pointInPixel = [params.offsetX, params.offsetY];

        if (graphChart.getOption() !== undefined) {
          graphChart.getOption().series?.forEach((series, seriesIndex) => {
            const xAxisData = graphChart.convertFromPixel(
              { seriesIndex },
              pointInPixel
            )[0] as number;

            if (xAxisData !== null) {
              const date = new Date(xAxisData);
              const formattedDate = date.toISOString();
              onGraphClick(formattedDate);
            }
          });
        }
      });
      const numbersOnly = finals.filter((value) => !isNaN(value));
      if (numbersOnly.length === 1) {
        const result = numbersOnly[0];
        val = result
      } else {
        const max = Math.max(...numbersOnly);
        val = max
      }
    }
    if (val !== undefined) {
      dispatch(actions.changeTrafficabilityIndexColor(val));
    }
  }, [markline, graphChart]);

  return (
    <Box
      sx={{ width: "100%", display: "flex", flex: "row", alignItems: "center" }}
    >
      <IconButton
        onMouseOut={handleArrowMouseout}
        onMouseOver={handleArrowMouseover}
        disabled={hideArrowPrevious}
        onClick={() => handleDoubleClick("prev")}
        color={arrowColor}
      >
        <ArrowBackIos fontSize="large" />
      </IconButton>
      <Box
        ref={graphRef}
        style={{ width: "100%", margin: "auto" }}
        component="div"
      ></Box>
      {
        <IconButton
          color={arrowColor}
          onMouseOut={handleArrowMouseout}
          onMouseOver={handleArrowMouseover}
          onClick={() => handleDoubleClick("next")}
          disabled={hideNext}
        >
          <ArrowForwardIos fontSize="large" />
        </IconButton>
      }
    </Box>
  );
};

export default TraficabilityGraphComponent;
