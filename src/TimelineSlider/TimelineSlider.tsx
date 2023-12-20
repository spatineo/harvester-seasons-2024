/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getDatesForTimelineDuration } from "../utils/helpers";
import { actions } from "../globalSlice";

export interface Time {
  utctime: string;
}

const TimelineSlider: React.FC = () => {
  const [timelineData, setTimelineData] = useState<Array<string | Date>>([]);
  const { startEndTimeSpan } = useAppSelector(
    (state: RootState) => state.global
  );
  const { markLine } = useAppSelector((state: RootState) => state.global);

  const [timelineCurrentIndex, setTimelineCurrentIndex] = useState<
    number | null
  >(null);
  const [timelineChart, setTimelineChart] = useState<any | null>(null);
  //const localMarkline: string | Date = markLine
  const timelineRef = useRef(null);
  const dispatch = useRootDispatch();

  useEffect(() => {
    const result = new Date(new Date(startEndTimeSpan.start_time));
    result.setDate(result.getDate() + 2);
    const dateValue: Array<string | Date> = getDatesForTimelineDuration(
      result,
      11,
      true
    );
    setTimelineData(dateValue);
  }, []);

  useEffect(() => {
    if (markLine) {
      const result = new Date(new Date(startEndTimeSpan.start_time));
      result.setDate(result.getDate() + 2);
      const dateValue: Array<string | Date> = getDatesForTimelineDuration(
        result,
        11,
        true
      );

      const index = dateValue.findIndex((date) => {
        if (markLine !== "") {
          const dateInArray = new Date(date).toISOString().split("T")[0];
          const searchDate = new Date(markLine).toISOString().split("T")[0];
          return dateInArray === searchDate;
        }
      });
      setTimelineCurrentIndex(index);
    }
  }, [markLine]);

  useEffect(() => {
    if (!timelineRef.current) {
      return;
    }

    const chart = echarts.init(timelineRef.current);
    setTimelineChart(chart);
    const baseOption = {
      timeline: {
        autoPlay: false,
        playInterval: 1000,
        left: "center",
        bottom: 0,
        width: "100%",
        height: "50%",
        data: timelineData,
        replaceMerge: "series",
        controlStyle: {
          showPrevBtn: false,
          showNextBtn: true,
          itemSize: 20,
          showPlayBtn: true,
          position: "left",
        },
        currentIndex: 5,
        realtime: true,
        lineStyle: {
          type: "solid",
        },
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
      },
    };
    chart.setOption(baseOption);
    return () => {
      chart.dispose();
    };
  }, [timelineRef.current]);

  useEffect(() => {
    if (!timelineChart) return;
    const updateOptions = {
      timeline: {
        currentIndex: timelineCurrentIndex && timelineCurrentIndex,
      },
    };
    timelineChart.setOption(updateOptions);
  }, [timelineCurrentIndex]);

  useEffect(() => {
    if (!timelineChart) return;
    timelineChart.on("timelinechanged", (params) => {
      const value = params.currentIndex;
      const chartOptions = timelineChart.getOption();
      const selectedTimelineValue =
        (chartOptions?.timeline?.[0]?.data as string[]) || [];
      if (selectedTimelineValue[value]) {
        dispatch(actions.setMarkLine(`${selectedTimelineValue[value]}`));
      }
    });
    timelineChart.on("click", function (params) {
      const index = params.dataIndex;
      dispatch(actions.setMarkLine(index));
    });
  }, [timelineChart]);

  return (
    <Box>
      <Box sx={{ fontFamily: "Lato" }}>
        {new Date(markLine).toISOString().split("T")[0]}
      </Box>
      <Box ref={timelineRef} sx={{ height: "70px" }}></Box>
    </Box>
  );
};

export default TimelineSlider;
