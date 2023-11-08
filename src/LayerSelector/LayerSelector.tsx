import { FC } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

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
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
        sx={{ marginLeft: "1.2rem"}}
      >
        <FormControlLabel
          value={value}
          control={
            <Radio
              checked={checked}
              sx={{ padding: "0rem"}}
              size="small"
            />
          }
          label={value}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default LayerSeclectorComponent;
