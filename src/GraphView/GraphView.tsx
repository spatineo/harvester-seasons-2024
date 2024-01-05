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
  const { soilWetnessData, soilTemperatureData, snowHeightData, checked } =
    useAppSelector((state: RootState) => state.global);

  const { lang } = useAppSelector((state: RootState) => state.language);

  const graphParameters = useAppSelector(
    (state: RootState) => state.global.parameters
  );
  const markLineDate = useAppSelector(
    (state: RootState) => state.global.markLine
  );
  const [soilWetnessOption, setSoilWetnessOption] = useState<null | {}>(null);
  const [soilTemperatureOption, setSoilTemperatureOption] = useState<null | {}>(
    null
  );
  const [snowHeightOption, setSnowHeightOption] = useState<null | {}>(null);

  useEffect(() => {
    if (!soilWetnessData || !soilTemperatureData || !snowHeightData) return;

    /*   const snowHeightScaled: Smartmet[] = scaleEnsembleData(
      snowHeightData,
      "HSNOW-M:SMARTOBS:13:4"
    ); */
    if (!checked) {
      const soilWetness = createOptions(
        soilWetnessData,
        { title: "Soil Wetness (m³/m³)" },
        graphParameters.twelveMonthParams.soilWetness,
        soilWetnessData,
        markLineDate,
        [0, 0, 16, 0],
        lang,
        1,
        0
      );
      const soilTemperature = createOptions(
        soilTemperatureData,
        { title: "Soil Temperature (°C)" },
        graphParameters.twelveMonthParams.soilTemperature,
        soilTemperatureData,
        markLineDate,
        [0, 0, 16, 0],
        lang,
        30,
        -30
      );
      const snowHeight = createOptions(
        snowHeightData,
        { title: "Snow Height (m)" },
        graphParameters.twelveMonthParams.snowHeight,
        snowHeightData,
        markLineDate,
        [0, 0, 16, 0],
        lang,
        1.5,
        0
      );
      setSoilWetnessOption(soilWetness);
      setSnowHeightOption(snowHeight);
      setSoilTemperatureOption(soilTemperature);
    } else {
      const soilWetness = createOptions(
        soilWetnessData,
        { title: "Soil Wetness (m³/m³)" },
        graphParameters.tenYearParams.soilWetness,
        soilWetnessData,
        markLineDate,
        [0, 0, 16, 0],
        lang,
        1,
        0
      );
      const soilTemperature = createOptions(
        soilTemperatureData,
        { title: "Soil Temperature (°C)" },
        graphParameters.tenYearParams.soilTemperature,
        soilTemperatureData,
        markLineDate,
        [0, 0, 16, 0],
        lang,
        30,
        -30
      );
      const snowHeight = createOptions(
        snowHeightData,
        { title: "Snow Height (m)" },
        graphParameters.tenYearParams.snowHeight,
        snowHeightData,
        markLineDate,
        [0, 0, 16, 0],
        lang,
        1.5,
        0
      );
      setSnowHeightOption(snowHeight);
      setSoilTemperatureOption(soilTemperature);
      setSoilWetnessOption(soilWetness);
    }
  }, [
    soilWetnessData,
    snowHeightData,
    soilTemperatureData,
    graphParameters.twelveMonthParams.soilWetness,
    graphParameters.twelveMonthParams.soilTemperature,
    graphParameters.twelveMonthParams.snowHeight,
    graphParameters.tenYearParams.soilTemperature,
    graphParameters.tenYearParams.snowHeight,
    graphParameters.tenYearParams.soilWetness,
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
