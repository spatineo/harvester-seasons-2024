import React, { useState, CSSProperties } from "react";
import { Box, Collapse } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";
import "./CarbonText.css";

interface ButtonSectionProp {
  buttonIndex: number;
  selectedButton: number | null;
  onClick: (buttonIndex: number) => void;
  buttonText: string;
  getTextForButton: (buttonIndex: number) => string;
}

const styles = {
  button: {
    border: '1px solid #2196f3',
    color: '#1976d2',
    display: 'inline-flex',
    fontWeight: '500',
    fontSize: '0.875rem',
    lineHeight: '1.75',
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
    minWidth: '64px',
    padding: '6px 8px',
    borderRadius: '4px',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box', 
    outline: '0',
    margin: '0',
    alignItems: 'center',
    boxAlign: 'center',
    flexAlign: 'center',
    boxPack: 'center'
  }
}

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
        ] as string;
      case 2:
        return languages.forestManagement[
          text.lang as keyof LanguageOptions
        ] as string;
      case 3:
        return languages.petland[text.lang as keyof LanguageOptions] as string;
      case 4:
        return languages.literature[
          text.lang as keyof LanguageOptions
        ] as string;
      default:
        return "";
    }
  };

  const buttonData = [
    { index: 1, data: "Soil Carbon in General" },
    { index: 2, data: "Forest Management and Soil Carbon" },
    { index: 3, data: "Peatland vs. Mineral Soil" },
    { index: 4, data: "Carbon Literature" },
  ];
  
  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          margin: "auto",
        }}
      >
        {buttonData.map(({ index, data }) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
             style={styles.button as CSSProperties}
            className={selectedButton === index ? 'colouredBackgroundButton' : 'notColouredBackgroundButton'}
          >
            {data}
          </button>
        ))}
      </Box>

      {buttonData.map(({ index, data }) => (
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
