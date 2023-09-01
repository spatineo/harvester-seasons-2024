/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/default
import React, { useState } from "react";
import { Box, ListItemButton, Collapse } from "@mui/material";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useAppSelector } from "../store/hooks";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import logo from "../assets/logos_long.png";
import smallScreen from "../assets/logos.png";
import testimonial from "../assets/testimonial_metsateho1.png";

const useStyles = makeStyles((theme) => ({
  main: {
    position: "relative",
    top: "1rem",
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
  },
  font: {
    fontSize: "calc(14px + (45 - 22) * ((100vw - 300px) / (1600 - 300)))",
    color: "darkred",
    paddingLeft: '1.2rem'
  },
  info: {
    fontSize: "calc(14px + (16 - 12) * ((100vw - 300px) / (1600 - 300)))",
  },
  link: {
    [theme.breakpoints.up("xs")]: {
      flex: 1,
    },
  },
  image: {
    [theme.breakpoints.up("xs")]: {
      display: "none",
      flex: 1,
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      width: "70%",
      float: "right",
      paddingRight: "1.6rem",
    },
  },
  mobile: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      width: "60%",
      height: "auto",
      float: "right",
      paddingRight: "0.2rem",
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const HeadingCompoment: React.FC = () => {
  const [open, setOpen] = useState(false);
  const information = useAppSelector((state) => state.language);

  const linkStyle = {
    textDecoration: "none",
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.main}>
        <Box className={classes.link}>
          <Link to="/" style={linkStyle}>
            <Box className={classes.font}>Harvester Seasons</Box>
          </Link>
          <Box>

          </Box>
        </Box>
        <Box className={classes.link}>
          <Link to="/">
            <Box component="img" src={logo} className={classes.image} />
            <Box component="img" src={smallScreen} className={classes.mobile} />
          </Link>
        </Box>
      </Box>
      <Box>
        <ListItemButton
          onClick={handleClick}
          style={{ marginLeft: "0px", paddingLeft: "0px", fontFamily: "Lato" }}
          className={classes.info}
        >
          {open ? <ArrowDropDown /> : <ArrowRight />}{" "}
          {languages.info[information.en as keyof LanguageOptions]}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ width: "80%", margin: "2rem auto" }}>
            <Box component="img" src={testimonial} sx={{ width: "80%" }} />
          </Box>
          <Box>
            {languages.overviewBody[information.en as keyof LanguageOptions]} hi
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default HeadingCompoment;
