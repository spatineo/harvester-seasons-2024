/* eslint-disable import/default */
import React, { FC } from "react";
import { Switch, Box, Typography } from "@mui/material";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { actions } from "../globalSlice";

const SwitchComponent: FC = () => {
  const dispatch = useRootDispatch();
  const checked = useAppSelector((state: RootState) => state.global.checked);
  return (
    <Box sx={{ position: "relative", top: "-1rem" }}>
      <Switch
        checked={checked}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(actions.setCheckedButton(event.target.checked));
        }}
        sx={{ margin: "0rem" }}
      />
      <Typography
        sx={{
          fontFamily: "Lato",
          fontSize: "calc(12px + (18 - 14) * ((100vw - 300px) / (1600 - 300)))",
        }}
        component={"span"}
      >
        Turn on to change timestep between 1 year and 10 years{" "}
      </Typography>
    </Box>
  );
};

export default SwitchComponent;
