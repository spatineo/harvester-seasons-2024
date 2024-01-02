import { Box, Button } from "@mui/material";
import { useRootDispatch } from "../store/hooks";
import { actions } from "../globalSlice";
import { Configurations } from "../types";

const styles = {
  main: {
    display: "flex",
    gap: 1,
    margin: "auto",
    maxWidth: "1000px",
    flexDirection: "row",
    flexWrap: "wrap",
  },
};
const buttonTexts = [
  "Historical reanalysis",
  "Daily observations",
  "Short prediction daily",
  "Seasonal forecast daily ensembles",
  "Climate projection",
];
const HarvestParamterSwitch = () => {
  const dispatch = useRootDispatch();
  return (
    <Box sx={styles.main}>
      {buttonTexts.map((txt) => (
        <Box key={txt}>
          <Button
            variant="outlined"
            onClick={() => {
              dispatch(actions.setSearchParams(txt as keyof Configurations));
              dispatch({ type: "CONFIG_SEARCH" });
            }}
            sx={{
              padding: "0.2rem 0.4rem",
              textAlign: "center",
              fontSize: "0.8rem",
            }}
          >
            {txt}
          </Button>
        </Box>
      ))}
    </Box>
  );
};
export default HarvestParamterSwitch;
