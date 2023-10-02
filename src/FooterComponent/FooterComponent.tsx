/* eslint-disable import/default */
import React from "react";
import { Box, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from "react-router-dom";
import linkedin from "../assets/LI-In-Bug.png";

const footerStyle = {
  text: {
    fontFamily: "Lato",
  },
  main: {
    width: "100%",
    position: "relative",
    top: "4rem",
    color: "#1976d2",
    display: "inline-flex",
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "1.75",
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
    padding: "6px 8px",
    boxSizing: "border-box",
    outline: "0",
    boxPack: "center",
    borderTop: "1px solid grey",
    margin: "0",
    alignItems: "center",
    boxAlign: "center",
    flexAlign: "center",
  },
  items: {
    flex: "1",
    display: "flex",
    margin: "0.6rem 0rem 1rem 0rem",
    alignContent: "center",
    boxPack: "center",
  },
};

const FooterComponent: React.FC = () => {
  return (
    <Box sx={footerStyle.main}>
      <Box sx={footerStyle.items}>
        <Link
          to="https://harvesterseasons.com/"
          target="_blank"
          style={{ textDecoration: "none", color: "grey" }}
        >
          <Box>
            <Typography sx={footerStyle.text}>Harvester Seasons</Typography>
          </Box>
        </Link>
      </Box>
      <Box sx={footerStyle.items}>
        <Link
          to="https://www.linkedin.com/showcase/harvester-seasons"
          target="_blank"
          style={{ textDecoration: "none", color: "grey" }}
        >
          <Box>
            <Box component="img" src={linkedin} sx={{ maxWidth: "18px" }} />
            <Typography component={"span"} sx={footerStyle.text}>
              Follow us on LinkedIn
            </Typography>
          </Box>
        </Link>
      </Box>
      <Box sx={footerStyle.items}>
        <Link
          to="privacy-policy"
          style={{ textDecoration: "none", color: "grey" }}
        >
          <Box>
            <Typography sx={footerStyle.text}>
              Privacy Policy / Terms <span>of Use</span>
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default FooterComponent;
