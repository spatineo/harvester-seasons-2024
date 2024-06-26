import { FC } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface WMSLayersComponentProps {
  name: string;
  value: string;
  handleChange: () => void;
  disabled: boolean;
  checked: boolean;
}
const WMSLayersComponent: FC<WMSLayersComponentProps> = ({
  name,
  checked,
  handleChange,
  value,
  disabled
}) => {
  return (
    <FormControl size="small" >
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
        sx={{ marginLeft: "1.2rem"}}
      >
        <FormControlLabel
          value={value}
          control={
            <Radio
              checked={checked}
              disabled={disabled}
              sx={{ padding: "0rem"}}
              size="small"
            />
          }
          label={name}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default WMSLayersComponent;
