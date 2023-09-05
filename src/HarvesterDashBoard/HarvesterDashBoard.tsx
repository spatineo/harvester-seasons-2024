import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Outlet } from "react-router-dom";
import HeadingCompoment from "../HeadingCompnent/HeadingComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import { Box } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.up("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: "90%",
      margin: "auto"
    },
    [theme.breakpoints.up("lg")]: {
      width: "70%",
      margin: "auto"
    },
  },
}));

function HarvesterDashBoard() {
  const classes = useStyles()

  return (
    <Box className={classes.main}>
      <HeadingCompoment />
      <Outlet />
      <FooterComponent />
    </Box>
  );
}

export default HarvesterDashBoard;
