import React from "react";
import { Box } from "@mui/material";
import EchartsComponent from "../EchartsComponent/EchartsComponent";
import { Smartmet } from "../types";

interface HarvesterChartProps {
  option: {};
  data: Smartmet[];
  height: number;
  mousedown: () => void;
}
const HarvesterSeasons: React.FC<HarvesterChartProps> = ({
  option,
  height,
  data,
  mousedown,
}) => {
  return (
    <Box>
      {(data && data.length === 0) ||
      (option && Object.keys(option).length === 0) ? (
        <Box className="loading">Loading ....</Box>
      ) : (
        <EchartsComponent
          option={option}
          height={height}
          mousedown={mousedown}
        />
      )}
    </Box>
  );
};

export default HarvesterSeasons;
