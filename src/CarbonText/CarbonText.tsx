import React, { useState } from "react";
import { Box, Collapse, Button } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from "@mui/system";
import { useAppSelector } from "../store/hooks";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import { checkIfFinnishText } from '../utils/carbonTextComponentHelpers'

interface ButtonSectionProp {
  buttonIndex: number;
  selectedButton: number | null;
  onClick: (buttonIndex: number) => void;
  buttonText: string;
  getTextForButton: (buttonIndex: number) => string;
}

const ButtonWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: 4,
  margin: "auto",
  maxWidth: "1000px",
  flexDirection: "row",
  flexWrap: "wrap",
});

const ButtonStyled = styled(Button)({
  padding: "0.2rem 0.4rem",
  textAlign: "center",
  fontSize: "0.8rem",
});

const ButtonSection: React.FC<ButtonSectionProp> = ({
  buttonIndex,
  selectedButton,
  buttonText,
  getTextForButton,
}) => (
  <Collapse in={selectedButton === buttonIndex}>
    <Box
      sx={{
        position: "relative",
        top: "1rem",
        fontFamily: "Lato",
        fontSize: "0.9rem",
      }}
    >
      <Box component={"h2"}>{buttonText}</Box>
      <br />
      <Box
        dangerouslySetInnerHTML={{
          __html: getTextForButton(buttonIndex).replace(/\n/g, "<br/>"),
        }}
      />
    </Box>
    <br />
  </Collapse>
);

const CarbonText: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const text = useAppSelector((state) => state.language);

  const handleButtonClick = (buttonIndex: number) => {
    setSelectedButton((prevSelectedButton) => {
      if (prevSelectedButton === buttonIndex) {
        return null;
      } else {
        return buttonIndex;
      }
    });
  };

  const getTextForButton = (buttonIndex: number) => {
    switch (buttonIndex) {
      case 1:
        return languages.soilCarbon[
          text.lang as keyof LanguageOptions
        ] as string !== '' ? languages.soilCarbon[
          text.lang as keyof LanguageOptions
        ] as string : languages.soilCarbon[
          'en' as keyof LanguageOptions
        ] as string ;
      case 2:
        return languages.forestManagement[
          text.lang as keyof LanguageOptions
        ] as string !== '' ? languages.forestManagement[
          text.lang as keyof LanguageOptions
        ] as string: languages.forestManagement[
          'en' as keyof LanguageOptions
        ] as string;
      case 3:
        return languages.petland[text.lang as keyof LanguageOptions] as string !== '' ? 
        languages.petland[text.lang as keyof LanguageOptions] as string : 
        languages.petland['en' as keyof LanguageOptions] as string;
      case 4:
        return languages.literature[
          text.lang as keyof LanguageOptions
        ] as string !== '' ?  languages.literature[
          text.lang as keyof LanguageOptions
        ] as string :  languages.literature[
          'en' as keyof LanguageOptions
        ] as string;
      default:
        return "";
    }
  };

  const language = languages.carbonButtonData[text.lang] as Array<{
    index: number;
    data: string;
  }>;
  const buttonTextResult = checkIfFinnishText(language);

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto" }}>
      <ButtonWrapper>
        {buttonTextResult.map(({ index, data }) => (
          <ButtonStyled
            variant="outlined"
            key={index}
            onClick={() => handleButtonClick(index)}
            style={{backgroundColor: selectedButton === index ?
              "#D3D3D3" : "transparent"
        }}
          >
            {data}
          </ButtonStyled>
        ))}
      </ButtonWrapper>

      {buttonTextResult.map(({ index, data }) => (
        <ButtonSection
          key={index}
          buttonIndex={index}
          selectedButton={selectedButton}
          onClick={handleButtonClick}
          buttonText={data}
          getTextForButton={getTextForButton}
        />
      ))}
    </Box>
  );
};

export default CarbonText;
