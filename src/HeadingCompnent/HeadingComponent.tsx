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
  constainer: {
    position: "relative",
    top: "0rem",
    alignItems: "center",
    margin: "auto",
    justifyContent: "space-between",
    width: "100%",
    [theme.breakpoints.up("xl")]: {
     width: "80%",
     margin: "auto",
    },
  },
  main: {
    position: "relative",
    top: "0.2rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "auto",
    justifyContent: "space-between",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "auto",
      width: "90%",
    },
  },
  font: {
    fontSize: "calc(16px + (45 - 22) * ((100vw - 300px) / (1600 - 300)))",
    color: "darkred",
    marginLeft: "-0.4rem",
    position: "relative",
    top: "-0.2rem",
    [theme.breakpoints.up("sm")]: {
      paddingLeft: "1.2rem",
    },
    [theme.breakpoints.up("md")]: {
      marginLeft: "-2.8rem"
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: "-7rem"
    },
  },
  info: {
    fontSize: "calc(14px + (16 - 12) * ((100vw - 300px) / (1600 - 300)))",
    fontFamily: "Lato",
    position: "relative",
    top: "0rem",
    left: "0rem",
    marginLeft: "-1.4rem",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "-0.8rem",
    },
    [theme.breakpoints.up("md")]: {
      marginLeft: "0rem",
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: "-4rem"
    },
  },
  link: {
    [theme.breakpoints.up("xs")]: {
      flex: 1,
    },
  },
  image: {
    display: "flex",
    width: "70%",
    float: "right",
    flex: 1,
    marginRight: "0.8rem",
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      width: "70%",
      float: "right",
      paddingRight: "0rem",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      width: "70%",
      float: "right",
      marginRight: "-2rem",
    },
    [theme.breakpoints.up("lg")]: {
      display: "flex",
      width: "70%",
      float: "right",
      marginRight: "-2.4rem",
    },
    [theme.breakpoints.up("xl")]: {
      display: "flex",
      width: "70%",
      float: "right",
      marginRight: "-6rem",
    },
  },
  mobile: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      width: "60%",
      height: "auto",
      float: "right",
      paddingRight: "0.6rem",
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
    <Box className={classes.constainer}>
      <Box className={classes.main}>
        <Box className={classes.link}>
          <Link to="/" style={linkStyle}>
            <Box className={classes.font}>Harvester Seasons</Box>
          </Link>
          <Box></Box>
        </Box>
        <Box className={classes.link}>
          <Link to="/">
            <Box component="img" src={logo} className={classes.image} />
            <Box component="img" src={smallScreen} className={classes.mobile} />
          </Link>
        </Box>
      </Box>
      <Box className={classes.info}>
        <ListItemButton onClick={handleClick}>
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
