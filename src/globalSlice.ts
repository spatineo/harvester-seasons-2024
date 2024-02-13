/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalStateProps, Smartmet } from "./types";
import { addMonths, reduceMonths } from "./utils/dateHelperFunctions";

const endDate = addMonths(new Date(), 6).toISOString();
const startDate = reduceMonths(new Date(), 6).toISOString();
const mark = reduceMonths(new Date(), 6).setDate(
  reduceMonths(new Date(), 6).getDate() + 14
);
const newMarkLineDate = new Date(mark).toUTCString();

const initialState: GlobalStateProps = {
  defaultColorSwitch: true,
  trafficabilityIndexColor: null,
  hideNext: true,
  hideArrowPrevious: false,
  changeYear: "",
  markLine: new Date(newMarkLineDate).toISOString().split("T")[0],
  startEndTimeSpan: {
    start_time: startDate,
    end_time: endDate,
    time_step: 1440
  },
  windGustData: [],
  trafficabilityData: [],
  soilWetnessData: [],
  soilTemperatureData: [],
  snowHeightData: [],
  params: {
    trafficability: [
      { code: "HARVIDX{55;SWI2:ECXSF:5062:1:0:0:0-50}" },
      { code: "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}" },
      { code: "HARVIDX{0.55;SWI2-0TO1:SWI}" },
      { code: "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}" },
      { code: "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}" }
    ],
    snowHeight: [
      { code: "HSNOW-M:CERRA", layerName: "harvester:cerra5:HSNOW-M" },
      { code: "HSNOW-M:ERA5L", layerName: "harvester:era5l:HSNOW-M" },
      {
        code: "HSNOW-M:ECBSF::1:0:1:0",
        layerName: "harvester:ecbsf:HSNOW-M",
        ensemble: true
      },
      ...[...Array(50).keys()].map((n) => ({
        code: `HSNOW-M:ECBSF::1:0:3:${n + 1}`,
        layerName: "harvester:ecbsf:HSNOW-M",
        ensemble: true
      })),
      { code: "HSNOW-M:EDTE", layerName: "harvester:edte:HSNOW-M" },
      { code: "HSNOW-M:CDTE", layerName: "harvester:cdte" }
    ],
    soilTemperature: [
      { code: "TSOIL-C:CERRA-L", layerName: "harvester:cerra5:TSOIL-C" },
      { code: "SKT-C:LSASAF", layerName: "harvester:era5l:TSOIL-C" },
      { code: "TSOIL-C:EDTE", layerName: "harvester:edte:TSOIL-C" },
      {
        code: "TSOIL-C:ECBSF:::7:1:0",
        layerName: "harvester:ecbsf:TSOIL-C",
        ensemble: true
      },
      ...[...Array(50).keys()].map((n) => ({
        code: `TSOIL-C:ECBSF:::7:3:${n + 1}`,
        layerName: "harvester:ecbsf:TSOIL-C",
        ensemble: true
      })),
      { code: "TSOIL-C:CDTE", layerName: "harvester:cdte" }
    ],
    windGust: [
      { code: "FFG-MS:CERRA", layerName: "harvester:cerra:FFG-MS" },
      { code: "FFG-MS:ERA5", layerName: "harvester:era5:FFG-MS" },
      { code: "FFG-MS:EDTE", layerName: "harvester:edte:FFG-MS" },
      { code: "FFG-MS:ECSF", layerName: "harvester:ecsf:FFG-MS" },
      { code: "FFG-MS:CDTE", layerName: "harvester:cdte" }
    ],
    soilWetness: [
      {
        code: "SWVL2-M3M3:CERRA-L-0.4",
        layerName: "harvester:cerra5:SWVL2-M3M3"
      },
      { code: "SWI2-0TO1:SWI", layerName: "harvester:era5l:SWI2-0TO1" },
      { code: "SWI2-0TO1:EDTE", layerName: "harvester:edte:SWI2-0TO1" },
      ...[...Array(51).keys()].map((n) => ({
        code: `SWI2-0TO1:ECXSF:5062:1:0:0:${n}`,
        layerName: "harvester:ecxsf:SWI2-0TO1",
        ensemble: true
      })),
      { code: "SWI2-0TO1:CDTE", layerName: "harvester:cdte" }
    ]
  }
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setTimeEndStartSpan: (
      state,
      action: PayloadAction<{
        start_time: string;
        end_time: string;
        time_step: number;
      }>
    ) => {
      state.startEndTimeSpan = {
        ...state.startEndTimeSpan,
        start_time: action.payload.start_time,
        end_time: action.payload.end_time,
        time_step: action.payload.time_step
      };
    },
    setTrafficabilityData: (state, action: PayloadAction<[]>) => {
      state.trafficabilityData = action.payload;
    },
    setSoilWetnessData: (state, action: PayloadAction<Smartmet[]>) => {
      state.soilWetnessData = action.payload;
    },
    setSoilTemperatureData: (state, action: PayloadAction<Smartmet[]>) => {
      state.soilTemperatureData = action.payload;
    },
    setWindGustData: (state, action: PayloadAction<Smartmet[]>) => {
      state.windGustData = action.payload;
    },
    setSnowHeightData: (state, action: PayloadAction<Smartmet[]>) => {
      state.snowHeightData = action.payload;
    },
    setMarkLine: (state, action: PayloadAction<string | number>) => {
      const modifyDate = new Date(action.payload).toISOString().split("T")[0];
      state.markLine = modifyDate;
    },
    changeYear: (state, action: PayloadAction<string>) => {
      state.changeYear = action.payload;
    },
    changeHideNextArrowState: (state, action: PayloadAction<boolean>) => {
      state.hideNext = action.payload;
    },
    changeTrafficabilityIndexColor: (state, action: PayloadAction<number>) => {
      state.trafficabilityIndexColor = action.payload;
    },
    changeDefaultColor: (state, action: PayloadAction<boolean>) => {
      state.defaultColorSwitch = action.payload;
    },
    setHideArrowPreviousState: (state, action: PayloadAction<boolean>) => {
      state.hideArrowPrevious = action.payload;
    }
  }
});

export const actions = { ...globalSlice.actions };
export default globalSlice.reducer;
export type ReduxActions =
  | ReturnType<typeof actions.setTimeEndStartSpan>
  | ReturnType<typeof actions.setWindGustData>
  | ReturnType<typeof actions.setTrafficabilityData>
  | ReturnType<typeof actions.setSoilWetnessData>
  | ReturnType<typeof actions.setSnowHeightData>
  | ReturnType<typeof actions.setSoilTemperatureData>
  | ReturnType<typeof actions.setMarkLine>
  | ReturnType<typeof actions.changeHideNextArrowState>
  | ReturnType<typeof actions.changeYear>
  | ReturnType<typeof actions.setHideArrowPreviousState>
  | ReturnType<typeof actions.changeDefaultColor>;

export const getKeyFromFoundMatch = (foundMatch: Smartmet | string) => {
  const allKeys = Object.keys(foundMatch) as (keyof Smartmet)[];
  if (typeof foundMatch === "object") {
    const keyWithValueNotNull = allKeys.find((key) => {
      return key !== "utctime" && foundMatch[key] !== null;
    });
    if (keyWithValueNotNull !== undefined) {
      const result = {
        utctime: foundMatch.utctime
      };
      result[keyWithValueNotNull] = foundMatch[keyWithValueNotNull];
      return result;
    }
    const keyWithNullValue = allKeys.find(
      (key) => key !== "utctime" && foundMatch[key] === null
    );
    if (keyWithNullValue !== undefined) {
      const result = {
        utctime: foundMatch.utctime
      };
      result[keyWithNullValue] = null;
      return result;
    }
  } else {
    return foundMatch;
  }
  return null;
};
