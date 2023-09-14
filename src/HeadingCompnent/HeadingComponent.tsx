/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/default
import React, { useState } from "react";
import { Box, Grid, ListItemButton, Collapse, styled } from "@mui/material";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import logo from "../assets/logos_long.png";
import smallScreen from "../assets/logos.png";
import testimonial from "../assets/testimonial_metsateho1.png";

const MobileLogo = styled('img')({
  '@media (max-width: 900px)': {
    display: 'block',
    width: '60%',
    float: 'right',
    clear: 'both'
  },
  '@media (min-width: 901px)': {
    display: 'none'
  }
})

const BiggerScreen = styled('img')({
  '@media (min-width: 901px)': {
    display: 'block',
    width: '70%',
    float: 'right',
  },
  '@media (max-width: 900px)': {
    display: 'none'
  }
})

const HeadingCompoment: React.FC = () => {
  const [open, setOpen] = useState(false);
  const information = useAppSelector((state) => state.language);

  const linkStyle = {
    textDecoration: "none",
  };
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid container sx={{ width: '100%', padding: '0rem 1em'}}>
        <Grid item xs={6} >
          <Link to="/" style={linkStyle}>
            <Box sx={{ fontSize: 'calc(0.1vw + 1vh + 2vmin)'}}>Harvester Seasons</Box>
          </Link>
          <Box></Box>
        </Grid>
        <Grid item xs={6}>
          <Link to="/">
            <BiggerScreen src={logo} />
            <MobileLogo src={smallScreen}/>
          </Link>
        </Grid>
      </Grid>
      <Grid container sx={{padding: '0rem 1rem'}}>
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
      </Grid>
    </Grid>
  );
};

export default HeadingCompoment;
