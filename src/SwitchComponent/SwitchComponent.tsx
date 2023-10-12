/* eslint-disable import/default */
import React from "react";
import { Switch, Box, Typography } from "@mui/material";

interface SwitchProps {
  switchButtonState: boolean;
  onChange: () => void;
}

const SwitchComponent: React.FC<SwitchProps> = ({
  switchButtonState,
  onChange,
}) => {
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'flex-start'}}>
      <Box>
        <Typography
          component={"span"}
          sx={{
            fontFamily: "Lato",
            fontSize: 'calc(32px + 16 * ((100vw - 568px) / (768 - 568))' 
          }}
        >
          Default colors Off
        </Typography>
      </Box>
      <Box>
        <Switch checked={switchButtonState} onChange={onChange} sx={{ position: 'relative', top: '-4px'}}/>
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: 'calc(32px + 16 * ((100vw - 568px) / (768 - 568))' 
          }}
          component={"span"}
        >
          On
        </Typography>
      </Box>
    </Box>
  );
};

export default SwitchComponent;
