/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/default
import React, { useState } from "react";
import {
  Box,
  Grid,
  ListItemButton,
  Collapse,
  styled,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { LanguageOptions, actions } from "../Lang/languageSlice";
import EmbeddedYouTubeVideo from "./EmbeddedYouTubeVideo";
import FeedbackForm from "../FeedBackForm/FeedBack";
import { languages } from "../Lang/languages";
import logo from "../assets/logos_long.png";
import smallScreen from "../assets/logos.png";
import testimonial from "../assets/testimonial_metsateho1.png";
import ohje2 from "../assets/ohje2.png";
import ohje2a from "../assets/ohje2a.png";
import ohje4 from "../assets/ohje4.png";
import ohje5 from "../assets/ohje5b.png";
import korjuukelpoisuus from "../assets/korjuukelpoisuus.png"

const MobileLogo = styled("img")({
  "@media (max-width: 900px)": {
    display: "block",
    width: "60%",
    float: "right",
    clear: "both",
  },
  "@media (min-width: 901px)": {
    display: "none",
  },
});

const BiggerScreen = styled("img")({
  "@media (min-width: 901px)": {
    display: "block",
    width: "100%",
    float: "right",
  },
  "@media (max-width: 900px)": {
    display: "none",
  },
});

const styles = {
  font: {
    fontFamily: "Lato",
  },
};

const HeadingCompoment: React.FC = () => {
  const [open, setOpen] = useState(false);
  const information = useAppSelector((state) => state.language);
  const dispatch = useRootDispatch();

  const handleSelectChange = (event: SelectChangeEvent) => {
    dispatch(actions.changeLanguage(event.target.value));
  };
  const linkStyle = {
    textDecoration: "none",
  };
  const handleClick = () => {
    setOpen(!open);
  };

  const textWithAnchor =
    languages.overviewBody[information.lang as keyof LanguageOptions];

  return (
    <Grid
      container
      sx={{
        width: "100%",
        position: "relative",
        top: "0.8rem",
        marginBottom: "2rem",
      }}
    >
      <Grid container sx={{ width: "100%", padding: "0rem 1em" }}>
        <Grid item xs={6}>
          <Link to="/" style={linkStyle}>
            <Box sx={{ fontSize: "calc(0.1vw + 1vh + 2vmin)" }}>
              Harvester Seasons
            </Box>
          </Link>
          <Box></Box>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={3}>
              <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
                <InputLabel id="demo-select-small-label">Lang</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={information.lang}
                  label="Age"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="en">en</MenuItem>
                  <MenuItem value="fi">fi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <Link to="/">
                <BiggerScreen src={logo} />
                <MobileLogo src={smallScreen} />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ padding: "0rem 1rem" }}>
        <ListItemButton
          onClick={handleClick}
          sx={{ margin: "-0.6rem 0rem 0rem -0.6rem", padding: "0rem" }}
        >
          {open ? <ArrowDropDown /> : <ArrowRight />}{" "}
          {languages.info[information.lang as keyof LanguageOptions]}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ width: "80%", margin: "2rem auto" }}>
            <Box component="img" src={testimonial} sx={{ width: "80%" }} />
          </Box>
          <Box sx={{ margin: "2rem auto" }}>
            <Typography variant="h6" sx={styles.font}>
              {
                languages.overviewHeading[
                  information.lang as keyof LanguageOptions
                ]
              }
            </Typography>
            <Typography sx={styles.font}>
              <br />
              <div dangerouslySetInnerHTML={{ __html: textWithAnchor }} />
            </Typography>
          </Box>
          <EmbeddedYouTubeVideo />
          <Box sx={{ margin: "1rem auto" }}>
            <Typography variant="h6" sx={styles.font}>
              {languages.howTo[information.lang as keyof LanguageOptions]}
            </Typography>
            {information.lang === "fi" ? (
              <Box>
                <ol>
                  <li>
                    {
                      languages.instructions.one[
                        information.lang as keyof LanguageOptions
                      ]
                    }
                  </li>
                  <br />
                  <li>
                    {
                      languages.instructions.two[
                        information.lang as keyof LanguageOptions
                      ]
                    }
                    <Box
                      component="img"
                      src={ohje2}
                      sx={{ marginTop: "0.4rem" }}
                    ></Box>
                    <ol type="a" style={{ margin: "0.6rem 0rem" }}>
                      <li>
                        <Box>
                          <Box>
                            {
                              languages.mapTextOne[
                                information.lang as keyof LanguageOptions
                              ]
                            }
                          </Box>
                          <br />
                          <Box component="img" src={ohje2a}></Box>
                        </Box>{" "}
                        <br />
                      </li>
                      <li>
                        <Box>
                          {
                            languages.mapTextTwo[
                              information.lang as keyof LanguageOptions
                            ]
                          }
                        </Box>
                      </li>
                    </ol>
                  </li>
                  <li>
                    {
                      languages.instructions.three[
                        information.lang as keyof LanguageOptions
                      ]
                    }
                  </li>
                  <br />
                  <li>
                    {
                      languages.instructions.four[
                        information.lang as keyof LanguageOptions
                      ]
                    }
                    <Box component="img" src={ohje4}></Box>
                  </li>
                  <br />
                  <li>
                    {
                      languages.instructions.five[
                        information.lang as keyof LanguageOptions
                      ]
                    }
                     <ol type="a" style={{ margin: "0.6rem 0rem" }}>
                      <li>
                        <Box>
                          {
                            languages.mapTextInstructionFive1[
                              information.lang as keyof LanguageOptions
                            ]
                          }
                        </Box>
                        <br />
                      </li>
                      <li>
                        <Box>
                          {
                            languages.mapTextInstructionFive2[
                              information.lang as keyof LanguageOptions
                            ]
                          }
                        </Box>
                      </li>
                    </ol>
                  </li>
                </ol>
                <Box component="img" src={ohje5}></Box><br/><br/>
                <Box>Korjuukelpoisuusluokituksen muuttuminen säätiedon perusteella.</Box><br/>
                <Box component="img" src={korjuukelpoisuus}></Box>
                <FeedbackForm />
              </Box>
            ) : (
              <Box>
                {" "}
                <Typography sx={styles.font}>
                  <br />
                  {
                    languages.instructions.two[
                      information.lang as keyof LanguageOptions
                    ]
                  }
                </Typography>
                <FeedbackForm />
              </Box>
            )}
          </Box>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default HeadingCompoment;
