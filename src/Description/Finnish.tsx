import { Box } from "@mui/material";
import { languages } from "../Lang/languages";
import { LanguageOptions } from "../Lang/languageSlice";
import { useAppSelector } from "../store/hooks";
import FeedbackForm from "../FeedBackForm/FeedBack";
import Description from "./Description";
import ohje2 from "../assets/ohje2.png";
import ohje2a from "../assets/ohje2a.png";
import ohje4 from "../assets/ohje4.png";
import ohje5 from "../assets/ohje5b.png";
import korjuukelpoisuus from "../assets/korjuukelpoisuus.png";

const FinnishText = () => {
  const information = useAppSelector((state) => state.language);

  return (
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
          <Box component="img" src={ohje2} sx={{ marginTop: "0.4rem" }}></Box>
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
      <Box component="img" src={ohje5}></Box>
      <br />
      <br />
      <Box>Korjuukelpoisuusluokituksen muuttuminen säätiedon perusteella.</Box>
      <br />
      <Box component="img" src={korjuukelpoisuus}></Box>
      <FeedbackForm />
      <Box>
        <Description />
      </Box>
    </Box>
  );
};

export default FinnishText;
