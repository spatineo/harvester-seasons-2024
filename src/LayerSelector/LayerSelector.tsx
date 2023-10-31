import { FC } from "react";
import { Box, Radio } from "@mui/material";

interface LayerSelectionProps {
  value: string;
  handleChange: (value: string) => void;
  checked: boolean;
}

const LayerSeclectorComponent: FC<LayerSelectionProps> = ({
  value,
  handleChange,
  checked,
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
        sx={{ margin: "0.1rem", padding: "0rem", fontSize: "0.6rem" }}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
        value={value}
        checked={checked}
        inputProps={{ "aria-label": value }}
      />
      <span>{value}</span>
    </Box>
  );
};

export default LayerSeclectorComponent;
