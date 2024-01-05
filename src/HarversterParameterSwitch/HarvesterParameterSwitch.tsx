import { useState } from "react";
import { Box, Button } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from "@mui/system";
import { useRootDispatch } from "../store/hooks";
import { actions } from "../globalSlice";
import { Configurations } from "../types";
import * as constant from "../store/constants";

const buttonTexts = [
  "Historical reanalysis",
  "Daily observations",
  "Short prediction daily",
  "Seasonal forecast daily ensembles",
  "Climate projection",
];

const ButtonWrapper = styled(Box)({
  display: "flex",
  gap:4,
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

const HarvestParamterSwitch = () => {
  const [selectedParameter, setSelectedParameter] = useState<string | null>(
    "Historical reanalysis"
  );
  const dispatch = useRootDispatch();

  const handleButtonClick = (parameter: string) => {
    setSelectedParameter(parameter);

    dispatch(actions.setSearchParams(parameter as keyof Configurations));
    dispatch({ type: constant.FETCH_DATA });
  };

  return (
    <ButtonWrapper>
      {buttonTexts.map((txt) => (
        <ButtonStyled
          style={{
            backgroundColor: selectedParameter === txt ? "#D3D3D3" : "transparent",
          }}
          key={txt}
          variant="outlined"
          onClick={() => handleButtonClick(txt)}
        >
          {txt}
        </ButtonStyled>
      ))}
    </ButtonWrapper>
  );
};
export default HarvestParamterSwitch;
