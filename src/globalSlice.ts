import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalStateProps, Smartmet } from "./types";
import {
  getFirstDayOfTheYear,
  addMonths,
  reduceMonths
} from "./utils/dateHelperFunctions";
import { marklineStartDate } from "./utils/helpers";

const endDate = addMonths(new Date(), 6).toISOString();
const startDate = reduceMonths(new Date(), 6).toISOString();
const marked = new Date(
  marklineStartDate(new Date(getFirstDayOfTheYear()))
).toISOString();

const initialState: GlobalStateProps = {
  defaultColorSwitch: true,
  trafficabilityIndexColor: null,
  hideNext: false,
  changeYear: "",
  markLine: marked,
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
      { code: "HSNOW-M:EDTE", layerName: "harvester:edte:HSNOW-M"},
      { code: "HSNOW-M:ECBSF", layerName: "harvester:ecbsf:HSNOW-M" },
      { code: "HSNOW-M:CDTE" }
    ],
    soilTemperature: [
      { code: "TSOIL-C:CERRA-L", layerName: "harvester:cerra5:TSOIL-C" },
      { code: "SKT-C:LSASAF", layerName: "harvester:era5l:TSOIL-C" },
      { code: "TSOIL-C:EDTE", layerName: "harvester:edte:TSOIL-C" },
      { code: "TSOIL-C:ECBSF" , layerName: "harvester:ecbsf:TSOIL-C"},
      { code: "TSOIL-C:CDTE" }
    ],
    windGust: [
      { code: "FFG-MS:CERRA", layerName: "harvester:cerra:FFG-MS" },
      { code: "FFG-MS:ERA5", layerName: "harvester:era5:FFG-MS" },
      { code: "FFG-MS:EDTE", layerName: "harvester:edte:FFG-MS" },
      { code: "FFG-MS:ECSF", layerName: "harvester:ecsf:FFG-MS" },
      { code: "FFG-MS:CDTE" }
    ],
    soilWetness: [
      { code: "SWVL2-M3M3:CERRA-L-0.4", layerName: "harvester:cerra5:SWVL2-M3M3" },
      { code: "SWI2-0TO1:SWI", layerName: "harvester:era5l:SWI2-0TO1" },
      { code: "SWI2-0TO1:EDTE", layerName: "harvester:edte:SWI2-0TO1"},
      { code: "SWI2-0TO1:ECXSF", layerName: "harvester:ecxsf:SWI2-0TO1" },
      { code: "SWI2-0TO1:CDTE" }
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
      window.console.log(action.payload);
      state.startEndTimeSpan = {
        ...state.startEndTimeSpan,
        start_time: action.payload.start_time,
        end_time: action.payload.end_time,
        time_step: action.payload.time_step
      };
    },
    setTrafficabilityData: (state, action: PayloadAction<[]>) => {
      window.console.log(action.payload, "trafficability");
      state.trafficabilityData = action.payload;
    },
    setSoilWetnessData: (state, action: PayloadAction<Smartmet[]>) => {
      window.console.log(action.payload, "wetness");
      state.soilWetnessData = action.payload;
    },
    setSoilTemperatureData: (state, action: PayloadAction<Smartmet[]>) => {
      window.console.log(action.payload, "temp");
      state.soilTemperatureData = action.payload;
    },
    setWindGustData: (state, action: PayloadAction<Smartmet[]>) => {
      window.console.log(action.payload, "windGust");
      state.windGustData = action.payload;
    },
    setSnowHeightData: (state, action: PayloadAction<Smartmet[]>) => {
      window.console.log(action.payload, "height");
      state.snowHeightData = action.payload;
    },
    setMarkLine: (state, action: PayloadAction<string | number>) => {
      const modifyDate = new Date(action.payload).toISOString();
      state.markLine = modifyDate;
    },
    changeYear: (state, action: PayloadAction<string>) => {
      state.changeYear = action.payload;
    },
    changeHideNextArrowState: (state, action: PayloadAction<boolean>) => {
      state.hideNext = action.payload;
    },
    changeTrafficabilityIndexColor: (state, action: PayloadAction<number>) => {
      if (typeof action.payload !== "number" || isNaN(action.payload)) {
        state.trafficabilityIndexColor = null;
      } else {
        state.trafficabilityIndexColor = action.payload;
      }
    },
    changeDefaultColor: (state, action: PayloadAction<boolean>) => {
      state.defaultColorSwitch = action.payload;
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
  | ReturnType<typeof actions.changeDefaultColor>;
