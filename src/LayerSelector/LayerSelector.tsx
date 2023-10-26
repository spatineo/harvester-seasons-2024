import { FC } from "react";
import { Box, Radio } from "@mui/material";

interface LayerSelectionProps {
  value: string;
  handleStateChange: (value: string) => void;
  name: string;
}

const LayerSeclectorComponent: FC<LayerSelectionProps> = ({
  value,
  handleStateChange,
  name,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "0.4rem",
      }}
    >
      <Radio
        size="small"
        sx={{ margin: "0rem", padding: "0rem", fontSize: "0.6rem" }}
        checked={value === name}
        onChange={(event) => {
          handleStateChange(event.target.name);
        }}
        value={value}
        name={name}
        inputProps={{ "aria-label": value }}
      />
      <span>{name}</span>
    </Box>
  );
};

export default LayerSeclectorComponent;
