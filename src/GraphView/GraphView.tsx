/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import HarvesterSeasons from "../HarvesterChartComponent/HarvesterChartComponent";
import { createOptions } from "../utils/graphHelpers";

export interface Time {
  utctime: string;
}

const Graphs: React.FC = () => {
  const { soilWetnessData, soilTemperatureData, snowHeightData, params } =
    useAppSelector((state: RootState) => state.global);

  const { lang } = useAppSelector((state: RootState) => state.language);
  const markLineDate = useAppSelector(
    (state: RootState) => state.global.markLine
  );
  const [soilWetnessOption, setSoilWetnessOption] = useState<null | {}>(null);
  const [soilTemperatureOption, setSoilTemperatureOption] = useState<null | {}>(
    null
  );
  const [snowHeightOption, setSnowHeightOption] = useState<null | {}>(null);

  useEffect(() => {
    if (!soilTemperatureData) return;

    /*   const snowHeightScaled: Smartmet[] = scaleEnsembleData(
      snowHeightData,
      "HSNOW-M:SMARTOBS:13:4"
    ); */

    const soilWetness = createOptions(
      { title: "Soil Wetness (m³/m³)" },
      params.soilWetness,
      soilWetnessData,
      markLineDate,
      [0, 0, 16, 0],
      lang
    );
    const soilTemperature = createOptions(
      { title: "Soil Temperature (°C)" },
      params.soilTemperature,
      soilTemperatureData,
      markLineDate,
      [0, 0, 16, 0],
      lang
    );
    const snowHeight = createOptions(
      { title: "Snow Height (m)" },
      params.snowHeight,
      snowHeightData,
      markLineDate,
      [0, 0, 16, 0],
      lang
    );
    setSnowHeightOption(snowHeight);
    setSoilTemperatureOption(soilTemperature);
    setSoilWetnessOption(soilWetness);
  }, [
    soilWetnessData,
    snowHeightData,
    soilTemperatureData,
    markLineDate,
    lang,
  ]);
 
  return (
    <Box>
      <Box>
        {soilWetnessData && soilWetnessData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilWetnessOption !== null ? soilWetnessOption : {}}
            height={300}
          />
        )}
      </Box>
      <Box>
        {soilTemperatureData && soilTemperatureData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilTemperatureOption !== null ? soilTemperatureOption : {}}
            height={300}
          />
        )}
      </Box>
      <Box>
        {snowHeightData && snowHeightData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={snowHeightOption !== null ? snowHeightOption : {}}
            height={300}
          />
        )}
      </Box>
      
    </Box>
  );
};

export default Graphs;
