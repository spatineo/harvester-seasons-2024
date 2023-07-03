import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Outlet } from "react-router-dom";
import HeadingCompoment from "../HeadingCompnent/HeadingComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import { Box } from "@mui/material";

function HarvesterDashBoard() {
  return (
    <Box>
      <HeadingCompoment />
      <Outlet />
      <FooterComponent />
    </Box>
  );
}

export default HarvesterDashBoard;
