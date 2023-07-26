import React, { useState } from "react";
import { Box, Collapse, Button } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";

const CarbonText: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const text = useAppSelector((state) => state.language);

  const handleButtonClick = (buttonIndex: number) => {
    if (typeof selectedButton === "number") {
      setSelectedButton(null);
    } else {
      setSelectedButton(buttonIndex);
    }
  };

  const getTextForButton = (buttonIndex: number) => {
    switch (buttonIndex) {
      case 1:
        return languages.soilCarbon[text.en as keyof LanguageOptions];
      case 2:
        return languages.forestManagement[text.en as keyof LanguageOptions];
      case 3:
        return languages.petland[text.en as keyof LanguageOptions];
      case 4:
        return languages.literature[text.en as keyof LanguageOptions];
      default:
        return "";
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          margin: "auto",
        }}
      >
        <Button
          onClick={() => handleButtonClick(1)}
          variant="outlined"
          sx={{ fontFamily: "Lato", fontSize: "0.8rem" }}
        >
          Soil Carbon
        </Button>
        <Button
          onClick={() => handleButtonClick(2)}
          variant="outlined"
          sx={{ fontFamily: "Lato", fontSize: "0.8rem" }}
        >
          Forest Management and Soil Carbon
        </Button>
        <Button
          onClick={() => handleButtonClick(3)}
          variant="outlined"
          sx={{ fontFamily: "Lato", fontSize: "0.8rem" }}
        >
          Peatland vs. Mineral Soil
        </Button>
        <Button
          onClick={() => handleButtonClick(4)}
          variant="outlined"
          sx={{ fontFamily: "Lato", fontSize: "0.8rem" }}
        >
          Carbon Literature
        </Button>
      </Box>
      <Collapse in={selectedButton === 1}>
        <Box
          sx={{
            position: "relative",
            top: "1rem",
            fontFamily: "Lato",
            fontSize: "0.9rem",
          }}
        >
          <Box component={"h2"}>Soil Carbon in General</Box>
          <br />
          <Box dangerouslySetInnerHTML={{__html: getTextForButton(1).replace(/\n/g, '<br/>')}}/>
        </Box>
        <br />
      </Collapse>
      <Collapse in={selectedButton === 2}>
        <Box
          sx={{
            position: "relative",
            top: "1rem",
            fontFamily: "Lato",
            fontSize: "0.9rem",
          }}
        >
          <Box component={"h2"}>Forest Management and Soil Carbon</Box>
          <br />
          <Box dangerouslySetInnerHTML={{__html: getTextForButton(2).replace(/\n/g, '<br/>')}}/>
        </Box>
        <br />
      </Collapse>
      <Collapse in={selectedButton === 3}>
        <Box
          sx={{
            position: "relative",
            top: "1rem",
            fontFamily: "Lato",
            fontSize: "0.9rem",
          }}
        >
            <Box component={"h2"}>Peatland vs. Mineral Soil</Box>
          <br />
          <Box dangerouslySetInnerHTML={{__html: getTextForButton(3).replace(/\n/g, '<br/>')}}/>
        </Box>
        <br/>
      </Collapse>
      <Collapse in={selectedButton === 4}>
        <Box
          sx={{
            position: "relative",
            top: "1rem",
            fontFamily: "Lato",
            fontSize: "0.9rem",
          }}
        >
          <Box component={"h2"}>Carbon Literature</Box>
          <br />
          <Box dangerouslySetInnerHTML={{ __html: getTextForButton(4).replace(/\n/g, '<br/>')}} />
        </Box>
        <br />
      </Collapse>
    </Box>
  );
};

export default CarbonText;
