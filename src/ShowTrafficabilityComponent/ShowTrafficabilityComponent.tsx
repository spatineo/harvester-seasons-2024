import { FC } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export interface CheckboxLabelsProps {
  text: string;
  show: boolean;
  handleChange: () => void;
}

const CheckboxComponent: FC<CheckboxLabelsProps> = ({
  text,
  show,
  handleChange,
}) => {
  return (
    <FormGroup sx={{ marginLeft: "1.2rem" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={show}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ padding: "0rem"}}
            size="small"
          />
        }
        label={text}
      />
    </FormGroup>
  );
};

export default CheckboxComponent;
