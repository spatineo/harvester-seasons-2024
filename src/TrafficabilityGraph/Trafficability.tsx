/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/namespace */
/* eslint-disable import/default */
import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
// eslint-disable-next-line import/named
import { EChartOption } from "echarts";
import { Box } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { actions } from "../globalSlice";
import { RootState } from "../store/store";

interface YValues {
  seriesName: string | undefined;
  yValue: number;
}

interface TraficabilityGraphComponentProp {
  option: EChartOption | null;
  onGraphClick: (xAxisData: string) => void;
  onMouseOver: (yAxisValues: YValues[]) => void;
}

const TraficabilityGraphComponent: React.FC<
  TraficabilityGraphComponentProp
> = ({ option, onGraphClick, onMouseOver }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [arrowColor, setArrowColor] = useState<"primary" | "secondary">(
    "primary"
  );
  const hideNextArrow = useAppSelector(
    (state: RootState) => state.global.hideNext
  );
  const dispatch = useRootDispatch();

  const handleDoubleClick = (direction: string) => {
    if (direction === "prev") {
      dispatch(actions.changeYear("previous"));
      //dispatch(actions.setMarkLine(newDateForMarkline));
      dispatch(actions.changeHideNextArrowState(true));
    } else if (direction === "next") {
      dispatch(actions.changeYear("next"));
    }
  };

  const handleArrowMouseover = () => {
    setArrowColor("secondary");
  };

  const handleArrowMouseout = () => {
    setArrowColor("primary");
  };

  useEffect(() => {
    if (graphRef.current) {
      const newChart = echarts.init(graphRef.current, undefined, {
        height: "200",
      });
      setChart(newChart);
    }

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chart && option) {
      chart.setOption(option);
    }
  }, [chart, option]);

  useEffect(() => {
    if (!chart) {
      return;
    }
    const mouseover = function (params) {
      if (params.data) {
        const xValue = params.data[0];
        const chartOption = chart.getOption();

        if (chartOption) {
          const yValues: YValues[] | null = [];

          chartOption.series?.forEach((series) => {
            let yValue: number | null = null;

            if (series.data) {
              for (const dataPoint of series.data) {
                if (dataPoint[0] === xValue) {
                  yValue = dataPoint[1];
                  break;
                }
              }
            }

            if (yValue !== null) {
              yValues.push({
                seriesName: series.name,
                yValue,
              });
            }
          });
          onMouseOver(yValues);
        }
      }
    }
   // chart.on("mouseover", mouseover );

    return () => {
      if(chart !== null){
        chart.off("mouseover", mouseover)
      }
    }
  }, [chart, onMouseOver]);

  useEffect(() => {
    if (!chart) {
      return;
    }

    const handleMouseClick = (params) => {
      const xAxisData = chart.convertFromPixel({ seriesIndex: 0 }, [
        params.offsetX,
        params.offsetY,
      ])[0];
      if (xAxisData) {
        const date = new Date(xAxisData);
        const formattedDate = date.toISOString();
        onGraphClick(formattedDate);
      }
    };

    return () => {
      if (chart) {
        chart.getZr().off('click', handleMouseClick);
      }
    };
  }, [chart, onGraphClick]);

  return (
    <Box
      sx={{ width: "96%", display: "flex", flex: "row", alignItems: "center" }}
    >
      <ArrowBackIos
        onMouseOut={handleArrowMouseout}
        onMouseOver={handleArrowMouseover}
        onClick={() => handleDoubleClick("prev")}
        color={arrowColor}
        fontSize="large"
      />
      <Box
        ref={graphRef}
        style={{ width: "100%", margin: "auto" }}
      ></Box>
      {hideNextArrow && (
        <ArrowForwardIos
          color={arrowColor}
          fontSize="large"
          onMouseOut={handleArrowMouseout}
          onMouseOver={handleArrowMouseover}
          onClick={() => handleDoubleClick("next")}
        />
      )}
    </Box>
  );
};

export default TraficabilityGraphComponent;
