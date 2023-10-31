import { FC } from "react";
import { Box, Radio } from "@mui/material";

interface WMSLayersComponentProps {
  name: string;
  value: string;
  handleChange: () => void;
  checked: boolean;
}
const WMSLayersComponent: FC<WMSLayersComponentProps> = ({
  name,
  checked,
  handleChange,
  value,
}) => {
  return (
    <Box sx={{ marginBottom: "-0.9rem", padding: "0rem" }}>
      <Radio
        sx={{ fontSize: "0.6rem" }}
        size="small"
        checked={checked}
        value={value}
        onChange={handleChange}
        inputProps={{ "aria-label": value }}
      />
      <Box component={"span"}>{name}</Box>
    </Box>
  );
};

export default WMSLayersComponent;
