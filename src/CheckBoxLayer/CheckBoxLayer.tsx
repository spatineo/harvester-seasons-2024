import { FC } from "react";
import { Box, Checkbox } from "@mui/material";

interface CheckboxLayerComponentProps {
  name: string;
  value: string;
  handleChange: (value: string) => void;
}
const CheckboxLayerComponent: FC<CheckboxLayerComponentProps> = ({
  name,
  handleChange,
  value,
}) => {
  return (
    <Box sx={{ marginBottom: "-1rem", padding: "0rem" }}>
      <Checkbox
        sx={{ fontSize: "0.6rem" }}
        size="small"
        checked={value === name}
        value={value}
        onChange={(event) => {
          handleChange(event.target.name);
        }}
        name={name}
        inputProps={{ "aria-label": value }}
      />
      <Box component={"span"}>{name}</Box>
    </Box>
  );
};

export default CheckboxLayerComponent;
