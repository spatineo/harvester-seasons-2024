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
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  textAndLogo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  font: {
    fontSize: "calc(16px + (45 - 22) * ((100vw - 300px) / (1600 - 300)))",
    color: "darkred",
    fontWeight: 600,
    flex: 1,
  },
  clickInformation: {
    fontSize: "calc(14px + (16 - 12) * ((100vw - 300px) / (1600 - 300)))",
    marginLeft: "0rem",
  },
  link: {
    flex: 1
  },
  image: {
    width: "70%",
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "inline-block",
      width: "100%",
    },
  },
  mobileLogo: {
    [theme.breakpoints.up("xs")]: {
      width: "50%",
      height: "auto",
      float: "right"
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
    <Box className={classes.container}>
      <Box className={classes.textAndLogo}>
        <Box className={classes.link}>
          <Link to="/" style={linkStyle}>
            <Box className={classes.font}>Harvester Seasons</Box>
          </Link>
          <Box></Box>
        </Box>
        <Box className={classes.link}>
          <Link to="/">
            <Box component="img" src={logo} className={classes.image} />
            <Box component="img" src={smallScreen} className={classes.mobileLogo} />
          </Link>
        </Box>
      </Box>
      <Box className={classes.clickInformation}>
        <ListItemButton onClick={handleClick} sx={{ margin: "-0.6rem 0rem 0rem -0.6rem",  padding: "0rem"}}>
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
