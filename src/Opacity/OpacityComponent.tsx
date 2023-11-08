/* eslint-disable import/default */
import React from "react";
import { Slider, Box, Typography, Grid } from "@mui/material";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { mapActions } from "../MapComponent/MapComponentSlice";
import { actions } from "../globalSlice";
import SwitchComponent from "../SwitchComponent/SwitchComponent";

const OpacityComponent: React.FC = () => {
  const dispatch = useRootDispatch();
  const opacityValue: number  = useAppSelector((state: RootState) => state.mapState.opacityValue);

  const { defaultColorSwitch } = useAppSelector(
    (state: RootState) => state.global
  );
  return (
    <Box
    >
      <Grid container>
        <Grid item  xs={0} sm={3} md={6}></Grid>
        <Grid item sm={9} xs={12} md={6}>
          <Grid container>
            <Grid item sm={6} xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item sm={3} xs={2}>
                  <Typography sx={{ fontFamily: "Lato",  fontSize: 'calc(32px + 16 * ((100vw - 568px) / (768 - 568))' }}>Opacity: </Typography>
                </Grid>
                <Grid item sm={6} xs={6}>
                  <Slider
                    value={opacityValue}
                    aria-label="Opacity"
                    onChange={(event: Event, newValue: number | number[]) => {
                      if (typeof newValue === "number") {
                        dispatch(mapActions.setOpacity(newValue));
                      }
                    }}
                  />
                </Grid>
                <Grid item sm={3} xs={4}>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: 'calc(32px + 16 * ((100vw - 568px) / (768 - 568))' 
                    }}
                  >
                    {opacityValue} %
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={6} xs={12}>
              <SwitchComponent
                switchButtonState={defaultColorSwitch}
                onChange={() =>
                  dispatch(actions.changeDefaultColor(!defaultColorSwitch))
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OpacityComponent;
