import React from "react";
import { Box } from "@mui/material";
import EchartsComponent from "../EchartsComponent/EchartsComponent";

interface HarvesterChartProps {
  option: {};
  height: number;
  handleOnmouseEnter: (data: [string | null, ...number[]]) => void;
  setMouseOver: (param: Record<string, string | number>[] | null) => void;
  setMouseOut: (param: [] | null) => void;
}
const HarvesterSeasons: React.FC<HarvesterChartProps> = ({
  option,
  height,
  handleOnmouseEnter,
  setMouseOver,
  setMouseOut,
}) => {
  return (
    <Box>
      {option ? (
        <EchartsComponent
          option={option}
          height={height}
          setValuesProps={handleOnmouseEnter}
          setMouseOut={setMouseOut}
          setMouseOver={setMouseOver}
        />
      ) : (
        <Box>No data</Box>
      )}
    </Box>
  );
};

export default HarvesterSeasons;
