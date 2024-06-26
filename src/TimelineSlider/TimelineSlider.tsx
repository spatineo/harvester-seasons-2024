/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { mapActions } from "../MapComponent/MapComponentSlice";
import { RootState } from "../store/store";
import { getDatesForTimelineDuration } from "../utils/helpers";
import { actions } from "../globalSlice";

export interface Time {
  utctime: string;
}

const TimelineSlider: React.FC = () => {
  const { position } = useAppSelector((state: RootState) => state.mapState);
  const { markLine, startEndTimeSpan } = useAppSelector(
    (state: RootState) => state.global
  );
  const [timelineChart, setTimelineChart] =
    useState<echarts.EChartsType | null>(null);
  const [location, setLocation] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });
  const timelineRef = useRef(null);
  const dispatch = useRootDispatch();

  useEffect(() => {
    if (!timelineRef.current) {
      return;
    }
    const chart: echarts.EChartsType = echarts.init(timelineRef.current);
    if (!chart.isDisposed()) {
      setTimelineChart(chart);
    }
    window.addEventListener("resize", () => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    });
    return () => {
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    if (!position) return;
    setLocation({ lat: position.lat, lon: position.lon });
  }, [position]);

  useEffect(() => {
    if (!timelineChart) {
      return;
    }
    const start = new Date(new Date(startEndTimeSpan.start_time));
    const end = new Date(new Date(startEndTimeSpan.end_time));
    const dateValue: Array<string | Date> = getDatesForTimelineDuration(
      start,
      end
    );

    const index = dateValue.findIndex((date) => {
      if (markLine !== "") {
        const dateInArray = new Date(date).toISOString().split("T")[0];
        const searchDate = new Date(markLine).toISOString().split("T")[0];
        return dateInArray === searchDate;
      }
    });

    const baseOption = {
      timeline: {
        animationDuration: 0,
        axisType: "time",
        autoPlay: false,
        playInterval: 1000,
        left: "center",
        bottom: 0,
        width: "100%",
        height: "50%",
        data: dateValue,
        symbolSize: 5,
        controlStyle: {
          showPrevBtn: true,
          showNextBtn: true,
          itemSize: 24,
          showPlayBtn: true,
          position: "left",
        },
        currentIndex: index,
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
    timelineChart.setOption(baseOption);
  }, [timelineChart, startEndTimeSpan.end_time, startEndTimeSpan.start_time]);

  useEffect(() => {
    if (!timelineChart) return;
    const result = new Date(new Date(startEndTimeSpan.start_time));
    result.setDate(result.getDate() + 2);
    const dateValue: Array<string | Date> = getDatesForTimelineDuration(
      result,
      startEndTimeSpan.end_time
    );
    timelineChart.on("timelinechanged", (params) => {
      const timelineCurrentValue = new Date(
        dateValue[params.currentIndex]
      ).toISOString();
      dispatch(actions.setMarkLine(timelineCurrentValue));
    });

    timelineChart.on("click", (params) => {
      const newMarkline = new Date(params.dataIndex as number).toISOString();
      const clickedDate = new Date(params.dataIndex as number)
        .toISOString()
        .split("T")[0];
      const index = dateValue.findIndex((date) => {
        const dateInArray = new Date(date).toISOString().split("T")[0];
        return dateInArray === clickedDate;
      });
      const option = timelineChart.getOption();
      timelineChart.setOption({
        ...option,
        timeline: {
          currentIndex: index,
        },
      });
      dispatch(actions.setMarkLine(newMarkline));
    });

    dispatch(mapActions.setIndexNumbers(0));
  }, [timelineChart, startEndTimeSpan.end_time, startEndTimeSpan.start_time]);

  useEffect(() => {
    if (!timelineChart) return;
    const result = new Date(new Date(startEndTimeSpan.start_time));
    result.setDate(result.getDate() + 2);
    const dateValue: Array<string | Date> = getDatesForTimelineDuration(
      result,
      startEndTimeSpan.end_time
    );

    const index = dateValue.findIndex((date) => {
      if (markLine !== "") {
        const dateInArray = new Date(date).toISOString().split("T")[0];
        const searchDate = new Date(markLine).toISOString().split("T")[0];
        return dateInArray === searchDate;
      }
    });
    const option = timelineChart.getOption();
    timelineChart.setOption({
      ...option,
      timeline: {
        currentIndex: index,
      },
    });
    dispatch(mapActions.setIndexNumbers(0));
  }, [markLine]);

  return (
    <Box>
      <Box sx={{ fontFamily: "Lato" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box sx={{ flex: 2 }}>
            {new Date(markLine).toISOString().split("T")[0]}
          </Box>
          <Box sx={{ flex: 2 }}>
            {location.lat !== null &&
              location.lon !== null &&
              `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
          </Box>
        </Box>
      </Box>
      <Box ref={timelineRef} sx={{ height: "70px" }}></Box>
    </Box>
  );
};

export default TimelineSlider;
