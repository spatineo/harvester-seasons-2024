/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/default
import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const HeadingCompoment: React.FC = () => {
  const linkStyle = {
    textDecoration: "none",
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        style={{
          marginTop: "1rem",
          fontFamily: "Lato",
          padding: "0.2rem 0.4rem",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontFamily: "Lato",
          }}
        >
          <Link to="/" style={linkStyle}>
            <Typography variant="h4">Harvester Seasons</Typography>
          </Link>
          <Link to="/">
            <Box component="img" src={logo} sx={{ width: "20rem" }} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default HeadingCompoment;
