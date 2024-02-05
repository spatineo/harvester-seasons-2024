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
  const [selectedYValues, setSelectedYValues] = useState<any>([]);
  const [tooltipData, setTooltipData] = useState<
    Record<string, string | number>[] | null
  >(null);

  function initialLabels() {
    const obj: { [key: string]: string } = {};
    for (let i = 1; i <= 50; i++) {
      obj[`SH-${i}`] = "";
    }
    return obj;
  }

  const handleSetValuesProps = (data: [string | null, ...number[]]) => {
    setSelectedYValues(data);
  };

  const handleTooltip = (param) => {
    setTooltipData(param);
  };

  const handleGlobalMousOut = (param) => {
    window.console.log(param, "Global mouse out");
    setTooltipData(null);
  };
  useEffect(() => {
    if (!soilTemperatureData || !snowHeightData || !soilWetnessData) return;
    const soilWetness = createOptions(
      { title: "Soil Wetness (m³/m³)" },
      params.soilWetness,
      soilWetnessData,
      markLineDate,
      20,
      lang,
      handleTooltip
    );
    const soilTemperature = createOptions(
      { title: "Soil Temperature (°C)" },
      params.soilTemperature,
      soilTemperatureData,
      markLineDate,
      20,
      lang,
      handleTooltip
    );
    const snowHeight = createOptions(
      { title: "Snow Height (m)" },
      params.snowHeight,
      snowHeightData,
      markLineDate,
      20,
      lang,
      handleTooltip
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

  const graphLabels = () => {
    if (tooltipData && tooltipData.length > 0) {
      const date = tooltipData[0].value[0]
      return (
        <Box>
          {tooltipData.map((tooltip) => {
              window.console.log(tooltip.seriesName,date, tooltip.value[1]);
            return <Box key={tooltip.seriesName}>
              {}
            </Box>;
          })}
        </Box>
      );
    } else {
      const initialLabelValues = initialLabels();
      return (
        <span>
          {Object.keys(initialLabelValues).map((key: string, index: number) => (
            <Box
              component="span"
              key={index}
              sx={{
                fontFamily: "Helvetica, monospace",
                fontWeight: "200",
                fontSize: "0.8rem",
              }}
            >
              {`${key}: ${initialLabelValues[key]} `}
            </Box>
          ))}
        </span>
      );
    }
  };

  return (
    <Box>
      <Box sx={{ width: "80%", margin: "auto" }}>{graphLabels()}</Box>
      <Box>
        {soilWetnessData && soilWetnessData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilWetnessOption !== null && soilWetnessOption}
            height={300}
            handleOnmouseEnter={handleSetValuesProps}
            setMouseOver={handleTooltip}
            setMouseOut={handleGlobalMousOut}
          />
        )}
      </Box>
      <Box>
        {soilTemperatureData && soilTemperatureData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={soilTemperatureOption !== null && soilTemperatureOption}
            height={300}
            handleOnmouseEnter={handleSetValuesProps}
            setMouseOut={handleGlobalMousOut}
            setMouseOver={handleTooltip}
          />
        )}
      </Box>
      <Box>
        {snowHeightData && snowHeightData.length === 0 ? (
          <Box className="loading">Loading ....</Box>
        ) : (
          <HarvesterSeasons
            option={snowHeightOption !== null && snowHeightOption}
            height={300}
            handleOnmouseEnter={handleSetValuesProps}
            setMouseOver={handleTooltip}
            setMouseOut={handleGlobalMousOut}
          />
        )}
      </Box>
    </Box>
  );
};

export default Graphs;
