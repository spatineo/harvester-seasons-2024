/* eslint-disable import/default */
import React from "react";
import { Box, Typography, Button } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from "react-router-dom";
import linkedin from "../assets/LI-In-Bug.png";

const footerStyle = {
  container: {
    width: "100%",
    fontFamily: "Lato",
    borderTop: "1px solid grey",
    position: 'relative',
    top: '4rem',
    marginBottom: "6rem"
  },
  text: {
    fontFamily: "Lato",
  },
};

const FooterComponent: React.FC = () => {
  return (
    <Box sx={footerStyle.container}>
      <Box
        sx={{
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "1rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: '26.66%', marginRight: 'auto'}}>
          <Link to="https://harvesterseasons.com/" target="_blank">
            <Button>
              <Typography sx={footerStyle.text}>Harvester Seasons</Typography>
            </Button>
          </Link>
        </Box>
        <Box sx={{ width: '26.66%', marginRight: 'auto'}}>
          <Link
            to="https://www.linkedin.com/showcase/harvester-seasons"
            target="_blank"
          >
            <Button>
              <Box component="img" src={linkedin} sx={{ width: "5%" }} />
              <Typography component={"span"} sx={footerStyle.text}>
                Follow us on LinkedIn
              </Typography>
            </Button>
          </Link>
        </Box>
        <Box sx={{ width: '26.66%', marginLeft: 'auto'}}>
          <Link to="privacy-policy">
            <Button>
              <Typography sx={footerStyle.text}>
                Privacy Policy / Terms <span>of Use</span>
              </Typography>
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterComponent;
