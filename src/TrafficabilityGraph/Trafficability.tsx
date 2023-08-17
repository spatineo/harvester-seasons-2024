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

interface TraficabilityGraphComponentProp {
  option: EChartOption | null;
  onGraphClick: (xAxisData: string) => void;
}

const TraficabilityGraphComponent: React.FC<
  TraficabilityGraphComponentProp
> = ({ option, onGraphClick }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [arrowColor, setArrowColor] = useState<"primary" | "secondary">(
    "primary"
  );
  const hideNextArrow = useAppSelector(
    (state: RootState) => state.global.hideNext
  );
  const dispatch = useRootDispatch();

  const handleBackClick = () => {
    window.console.log("Back button clicked");
  };

  const handleDoubleClick = (direction: string) => {
    if (direction === "prev") {
      dispatch(actions.changeYear("previous"));
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
        height: "180",
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

    const handleMouseover = (params) => {
      if (params.data) {
        const seriesIndex = params.seriesIndex;
        const series = chart.getOption()?.series?.[seriesIndex];

        if (series && series.name && series.data) {
          const seriesName = series.name;
          const dataIndex = params.dataIndex;
          const dataValue = series.data[dataIndex];
          // console.log(`Hovered over ${seriesName}: ${dataValue}`);
          console.log(`${seriesName}`);
        }
      }
    };
    chart.on("mouseover", handleMouseover);
  }, [chart]);

  useEffect(() => {
    if (!chart) {
      return;
    }

    const handleMouseover = (params: any) => {
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

    chart.getZr().on("click", handleMouseover);

    return () => {
      chart.getZr().off("click", handleMouseover);
    };
  }, [chart, onGraphClick]);

  return (
    <Box
      sx={{ width: "96%", display: "flex", flex: "row", alignItems: "center" }}
    >
      <ArrowBackIos
        onClick={handleBackClick}
        onMouseOut={handleArrowMouseout}
        onMouseOver={handleArrowMouseover}
        onDoubleClick={() => handleDoubleClick("prev")}
        color={arrowColor}
        fontSize="large"
      />
      <Box
        ref={graphRef}
        style={{ width: "100%", margin: "auto", paddingRight: "0rem" }}
      ></Box>
      {hideNextArrow && (
        <ArrowForwardIos
          color={arrowColor}
          fontSize="large"
          onMouseOut={handleArrowMouseout}
          onMouseOver={handleArrowMouseover}
          onDoubleClick={() => handleDoubleClick("next")}
        />
      )}
    </Box>
  );
};

export default TraficabilityGraphComponent;
