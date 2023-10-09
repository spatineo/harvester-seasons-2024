/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Box, Typography, Link as MUILink } from "@mui/material";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import { useAppSelector } from "../store/hooks";
import fmi from "../assets/fmi.png";
import helsinkiUniversity from "../assets/hy_logo2.png";
import metsaTeho from "../assets/metsateho.jpg";
import metsaGroup from "../assets/metsagroup.jpg";
import wekeo from "../assets/wekeo_logo.png";
import climate from "../assets/c3s-logo.png";
import eShape from "../assets/e-shape-name.png";

const styles = {
  font: {
    fontFamily: "Lato",
  },
  italicFont: {
    fontFamily: "Lato",
    fontStyle: "italic",
  },
  boldFont: {
    fontWeight: "900",
    fontFamily: "Lato",
  },
  producersStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: "1000px",
    flexWrap: "nowrap",
  },
};

const Description = () => {
  const information = useAppSelector((state) => state.language);
  const textWithAnchorDescriptions =
  languages.descriptionTextP2[information.lang as keyof LanguageOptions];
  const viewSheet = languages.viewSheet[information.lang as keyof LanguageOptions];
  const carbonEmissions = languages.carbonEmission[information.lang as keyof LanguageOptions];
  const forestFire = languages.forestFires[information.lang as keyof LanguageOptions]
  const treeCoverDensity = languages.treeCoverDensity[information.lang as keyof LanguageOptions]

  return (
    <Box
        sx={{
          position: "relative",
          top: "2rem",
          marginBottom: "4rem",
          fontFamily: "Lato",
        }}
      >
        <Box>
          <Typography sx={styles.font} variant="h6">
            {
              languages.descriptionHeader[
                information.lang as keyof LanguageOptions
              ]
            }
          </Typography>
        </Box>
        <Box>
          <br />
          <Typography sx={styles.font} component="p">
            {
              languages.descriptionTextP1[
                information.lang as keyof LanguageOptions
              ]
            }
          </Typography>
          <br />
          <Typography sx={styles.font} component="p">
            <div
              dangerouslySetInnerHTML={{
                __html: textWithAnchorDescriptions,
              }}
            />
          </Typography>
          <br />
          <Typography sx={styles.font} component="p">
            {
              languages.descriptionTextP3[
                information.lang as keyof LanguageOptions
              ]
            }
          </Typography>
          <br />
          <Typography sx={styles.font} component="p">
            {
              languages.descriptionTextP4[
                information.lang as keyof LanguageOptions
              ]
            }
          </Typography>
          <br />
          <Typography sx={styles.font} component="p">
            {
              languages.descriptionTextP5[
                information.lang as keyof LanguageOptions
              ]
            }
          </Typography>
        </Box>
        {information.lang === 'en' && <Box>
          <Typography sx={styles.font}>
          <div dangerouslySetInnerHTML={{ __html: viewSheet}}></div>
          </Typography>
          <br />
          <Typography sx={styles.font}>
           <div dangerouslySetInnerHTML={{ __html: carbonEmissions}} />
          </Typography>
          <br />
          <Typography sx={styles.font}>
           <div dangerouslySetInnerHTML={{ __html: forestFire}}/>
          </Typography>
          <Typography sx={styles.font}>
            <a href="https://land.copernicus.eu/pan-european/high-resolution-layers/forests/">
              {" "}
            </a>
          </Typography>
          <br />
          <Typography sx={styles.font}>
           <div dangerouslySetInnerHTML={{ __html: treeCoverDensity}}/>
          </Typography>
          <br />
          <Box>
          <Typography variant="h6" sx={styles.font}>
            Press releases, articles and events
          </Typography>
          <br />
          <Typography sx={styles.font}>
            <a
              href="https://climate.copernicus.eu/harvester-seasons"
              target="_blank"
              rel="noreferrer"
            >
              Harvester Season as Copernicus C3S service
            </a>
          </Typography>
          <br />
          <Typography sx={styles.font}>
            <a
              href="https://www.copernicus.eu/en/news/news/observer-data-action-inside-three-sectoral-services-built-using-c3s-data"
              target="_blank"
              rel="noreferrer"
            >
              Data in action at Copernicus Observer{" "}
            </a>
          </Typography>
          <br />
          <Typography sx={styles.font}>
            Harvester Seasons participated in the Copernicus Climate Change Gala
            at 15th of October 2021 among other successful service developments
            and applications within C3S.{" "}
            <a
              href="https://www.youtube.com/watch?v=h4EBjZeaYKQ&list=PLB7XYEK5Kkhp6SlBF87yinQBwgO4glo2a&index=5"
              target="_blank"
              rel="noreferrer"
            >
              (YouTube-video)
            </a>
          </Typography>
          <br />
          <Typography sx={styles.font}>
            <a
              href="https://www.ilmastokatsaus.fi/2022/05/11/harvester-seasons-a-forestry-service-supporting-climate-smart-operations/"
              target="_blank"
              rel="noreferrer"
            >
              Harvester Seasons - A forestry service supporting climate smart
              operations{" "}
            </a>
            (FMI&apos;s Climate Bulletin: Research Letters)
          </Typography>
          </Box>
          
        </Box>
        }
        <br />
        <Box>
          <Typography sx={styles.font} variant="h6">Kiitämme</Typography><br/>
          <Typography sx={styles.font}>Harvester Seasons on toteutettu hyödyntäen WEkEO-laskentapalveluita.</Typography><br/>
        </Box>
        <Box>
          <Typography sx={styles.font} variant="h6">
            {languages.partners[information.lang as keyof LanguageOptions]}
          </Typography>
          <br />
          <Box>
            <Box sx={styles.producersStyle}>
              <Box sx={{ flex: "1" }}>
                <Typography sx={styles.boldFont}>{languages.serviceProvider[information.lang as keyof LanguageOptions]}</Typography>
                <MUILink
                  href="https://www.ilmatieteenlaitos.fi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box component="img" src={fmi} sx={{ maxWidth: "50%" }}></Box>
                </MUILink>
              </Box>
              <Box sx={{ flex: "1" }}>
                <MUILink target="_blank" href="https://www." rel="noreferrer">
                  <br />
                  <Box
                    component="img"
                    src={helsinkiUniversity}
                    sx={{ maxWidth: "80%" }}
                  ></Box>
                </MUILink>
              </Box>
              <Box sx={{ flex: "1" }}>
                <Typography sx={styles.font}>{languages.contractor[information.lang as keyof LanguageOptions]}</Typography>
                <MUILink
                  href="https://www.metsateho.fi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    component="img"
                    src={metsaTeho}
                    sx={{ maxWidth: "70%" }}
                  ></Box>
                </MUILink>
              </Box>
              <Box sx={{ flex: "1" }}>
                <Typography sx={styles.font}>{languages.testUser[information.lang as keyof LanguageOptions]}</Typography>
                <MUILink href="https://www.metsagroup.com/fi/" target="_blank">
                  <Box
                    component="img"
                    src={metsaGroup}
                    sx={{ maxWidth: "100%" }}
                  ></Box>
                </MUILink>
              </Box>
            </Box>
            <br />
            <Box>
              <Box component="dl">
                <Box component="dt">{languages.service[information.lang as keyof LanguageOptions]}</Box>
                <Box component="dd">
                  - ECMWF as a use case on forestry within Destination Earth
                  (DestinE)
                </Box>
                <Box component="dd">
                  - ECMWF as a use case by the{" "}
                  <MUILink
                    href="https://www.copernicus.eu/en/use-cases"
                    target="_blank"
                  >
                    Copernicus Programme&lsquo;s Climate Change Service (C3S)
                  </MUILink>
                </Box>
                <Box component="dd">
                  -{" "}
                  <MUILink href="https://e-shape.eu/" target="_blank">
                    E-Shape EuroGEO Showcases project
                  </MUILink>
                </Box>
              </Box>
            </Box>
            <br />
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
              <Box>
                <MUILink
                  href="https://www.wekeo.eu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    component="img"
                    src={wekeo}
                    sx={{ maxWidth: "100%" }}
                  ></Box>
                </MUILink>
              </Box>
              <Box sx={{ }}>
                <MUILink
                  href="https://www.copernicus.eu/en/use-cases"
                  target="_blank"
                  rel="noreferrer"
                  
                >
                  <Box
                    component="img"
                    src={climate}
                    sx={{ maxWidth: "80%", marginLeft: "3rem" }}
                  ></Box>
                </MUILink>
              </Box>
              <Box>
                <MUILink
                  href="https://e-shape.eu/"
                  target="_blank"
                  rel="noreferrer"
                 
                >
                  <Box
                    component="img"
                    src={eShape}
                    sx={{ maxWidth: "25%" }}
                  ></Box>
                </MUILink>
              </Box>
            </Box>
            <br />
            <Box>
              <Typography sx={styles.italicFont}>
                {
                  languages.italicEnglishText1[
                    information.lang as keyof LanguageOptions
                  ]
                }
              </Typography>
              <Typography sx={styles.italicFont}>
                {
                  languages.italicEnglishText2[
                    information.lang as keyof LanguageOptions
                  ]
                }
              </Typography>
              <Typography sx={styles.italicFont}>
                {
                  languages.italicEnglishText3[
                    information.lang as keyof LanguageOptions
                  ]
                }
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
  )
}

export default Description;