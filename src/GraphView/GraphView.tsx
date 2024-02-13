/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, useDeferredValue } from "react";
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
  const [selectedYValues, setSelectedYValues] = useState<
    null | Record<string, number | string>[]
  >(null);

  const deferredSelectedYValues = useDeferredValue(selectedYValues);

  function initialLabels() {
    const obj: { [key: string]: string } = {};
    for (let i = 1; i <= 50; i++) {
      obj[`SH-${i}`] = "";
    }
    return obj;
  }

  const handleTooltip = (param) => {
      const date = param[0].value[0];
      const n = param.map((p) => ({ name: p.seriesName, value: p.data[1] }));
      setSelectedYValues([date, ...n]);
  }

  const emptyToolTip = () => {
    setSelectedYValues(null);
  }

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

  const g = () => {
    if (deferredSelectedYValues === null) {
      const initialLabelValues = initialLabels();
      return (
        <Box component="span">
          {Object.keys(initialLabelValues).map((key: string, index: number) => (
            <Box component="span" key={index}>
              {`${key}: ${initialLabelValues[key]} `}
            </Box>
          ))}
        </Box>
      );
    } else {
      return (
        <Box>
          {deferredSelectedYValues.map((value, index) => {
            return (
              <Box component="span" key={index}>
                {typeof value === "string" &&
                  `${(value as string).split("T")[0]}`}
                {value.value !== "nan" &&
                  value.value !== undefined &&
                  ` ${value.name} ${Number(value.value).toFixed(2)} `}
              </Box>
            );
          })}
        </Box>
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          height: "180px",
          display: "flex",
          alignItems: "center",
          fontFamily: "Helvetica, monospace",
          fontWeight: "300",
          fontSize: "0.7rem",
        }}
      >
        {g()}
      </Box>
      <Box>
        {soilTemperatureOption !== null && (
          <HarvesterSeasons
            option={soilWetnessOption !== null && soilWetnessOption}
            height={300}
            data={soilWetnessData}
            mousedown={emptyToolTip}
          />
        )}
      </Box>
      <Box>
        <HarvesterSeasons
          option={soilTemperatureOption !== null && soilTemperatureOption}
          height={300}
          data={soilTemperatureData}
          mousedown={emptyToolTip}
        />
      </Box>
      <Box>
        <HarvesterSeasons
          option={snowHeightOption !== null && snowHeightOption}
          height={300}
          data={snowHeightData}
          mousedown={emptyToolTip}
        />
      </Box>
    </Box>
  );
};

export default Graphs;
