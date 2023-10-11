/* eslint-disable import/default */
import React from "react";
import { Slider, Box, Typography, Grid, Button } from "@mui/material";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { mapActions } from "../MapComponent/MapComponentSlice";

const OpacityComponent: React.FC = () => {
  const dispatch = useRootDispatch();
  const {opacityValue, colorPaletteSetter} = useAppSelector(
    (state: RootState) => state.mapState
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1em",
        position: "relative",
        top: "2rem",
        width: "100%",
      }}
    >
      <Grid container>
        <Grid item sm={4}></Grid>
        <Grid item sm={6}>
          <Grid container spacing={2}>
            <Grid item sm={2}>
              <Typography sx={{ fontFamily: "Lato" }}>Opacity: </Typography>
            </Grid>
            <Grid item sm={6}>
              {" "}
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
            <Grid item sm={4}>
              {" "}
              <Typography>{opacityValue}%</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={2}>
          <Button
            color="inherit"
            sx={{
              fontFamily: "Lato",
              padding: "0.1rem 0.4rem",
              fontSize: "0.8rem",
              background: '#F5F5F5',
              border: '1px solid #A9A9A9'
            }}
           onClick={() => dispatch(mapActions.setColorPaletteSetter(!colorPaletteSetter))}
          >
            Default Colors
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OpacityComponent;
