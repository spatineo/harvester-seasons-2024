import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalStateProps, Configurations } from "./types";
import {
  getStartSearchDate,
  addMonths,
  lastDayOfPreviousYear,
  oneMonthBack,
  oneMonthForward,
  oneYearForward,
  tenYearsBack
} from "./utils/dateHelperFunctions";
import {
  soilTemperatureParams,
  trafficabilityApiParams,
  snowHeightApiParams,
  soilWetnesstApiParams,
  marklineStartDate
} from "./utils/helpers";

const endDate = addMonths(getStartSearchDate(), 12).toISOString();
const lastDayPreviousYear = lastDayOfPreviousYear();
const startDate = new Date(getStartSearchDate()).toISOString();
const soilTemperaturCodeArray = soilTemperatureParams([]);
const trafficabilityApiParameters = trafficabilityApiParams();
const snowHeightParams = snowHeightApiParams();
const soilWetnessParams = soilWetnesstApiParams();
const backDateOneMonth = oneMonthBack(new Date()).toISOString();
const oneMonthForwardDate = oneMonthForward(new Date()).toISOString();
const oneYearAhead = oneYearForward(new Date()).toISOString();
const marked = new Date(marklineStartDate(getStartSearchDate())).toISOString();

const initialState: GlobalStateProps = {
  searchParams: "Historical reanalysis",
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
  checked: false,
  params: {
    "Historical reanalysis": {
      parameters: {
        soilTemperature: [{ code: "TSOIL-C:CERRA-L" }],
        soilWetness: [{ code: "SWVL2-M3M3:CERRA-L-0.4" }],
        snowHeight: [{ code: "HSNOW-M:CERRA" }],
        windGust: [{ code: "FFG-MS:CERRA:5057:6:10:0" }],
        startEndTimeSpan: {
          start_time: tenYearsBack(new Date(lastDayPreviousYear)).toISOString(),
          end_time: lastDayPreviousYear.toISOString(),
          time_step: 1440
        }
      }
    },
    "Daily observations": {
      parameters: {
        soilTemperature: [{ code: "SKT-K:LSASAF" }],
        soilWetness: [{ code: "SWI2-0TO1:SWI" }],
        snowHeight: [{ code: "HSNOW-M:ERA5L" }],
        windGust: [{ code: "FFG-MS:ERA5" }],
        startEndTimeSpan: {
          start_time: backDateOneMonth,
          end_time: new Date().toISOString(),
          time_step: 1440
        }
      }
    },
    "Seasonal forecast daily ensembles": {
      parameters: {
        soilTemperature: [{ code: "TSOIL-C:ECBSF-TSOIL-C:ECXSF" }],
        soilWetness: [{ code: "SWI2-0TO1:ECXSF" }],
        snowHeight: [{ code: "HSNOW-M:ECBSF-HSNOW-M:ECXSF" }],
        windGust: [{ code: "FFG-MS:ECSF" }],
        startEndTimeSpan: {
          start_time: new Date().toISOString(),
          end_time: oneYearAhead,
          time_step: 1440
        }
      }
    },
    "Short prediction daily": {
      parameters: {
        soilTemperature: [{ code: "TSOIL-C:EDTE" }],
        soilWetness: [{ code: "SWI2-0TO1:EDTE" }],
        snowHeight: [{ code: "HSNOW-M:EDTE" }],
        windGust: [{ code: "FFG-MS:EDTE" }],
        startEndTimeSpan: {
          start_time: new Date().toISOString(),
          end_time: oneMonthForwardDate,
          time_step: 1440
        }
      }
    },
    "Climate projection": {
      parameters: {
        soilTemperature: [{ code: "TSOIL-C:CDTE" }],
        soilWetness: [{ code: "SWI2-0TO1:CDTE" }],
        snowHeight: [{ code: "HSNOW-M:CDTE" }],
        windGust: [{ code: "FFG-MS:CDTE" }],
        startEndTimeSpan: {
          start_time: tenYearsBack(new Date(lastDayPreviousYear)).toISOString(),
          end_time: lastDayPreviousYear.toISOString(),
          time_step: 1440
        }
      }
    }
  },
  parameters: {
    twelveMonthParams: {
      windSpeed: [],
      trafficability: [
        { code: "HARVIDX{55;SWI2:ECXSF:5062:1:0:0:0-50}" },
        { code: "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}" },
        { code: "HARVIDX{0.55;SWI2-0TO1:SWI}" },
        { code: "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}" },
        { code: "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}" }
      ],
      soilWetness: [
        ...soilWetnessParams,
        { code: "SWVL2-M3M3:SMARTMET:5015" },
        { code: "SWI2-0TO1:SWI:5059" }
      ],
      soilTemperature: [
        ...soilTemperaturCodeArray,
        { code: "K2C{TSOIL-K:ECBSF:::7:1:0}" }
      ],
      snowHeight: [
        { code: "HSNOW-M:SMARTMET:5027" },
        { code: "HSNOW-M:SMARTOBS:13:4" },
        ...snowHeightParams
      ]
    },
    tenYearParams: {
      windSpeed: [],
      trafficability: [
        { code: "TSOIL-K:ECBSF:::7:1:0" },
        ...trafficabilityApiParameters
      ],
      soilWetness: [...soilWetnessParams, { code: "SWVL2-M3M3:SMARTMET:5015" }],
      soilTemperature: [
        { code: "K2C{TSOIL-K:ECBSF:::7:1:0}" },
        ...soilTemperaturCodeArray
      ],
      snowHeight: [
        { code: "SD-M:ECBSF::1:0:1:0" },
        { code: "SD-M:ECBSF::1:0:3:1" },
        { code: "SD-M:ECBSF::1:0:3:2" },
        { code: "SD-M:ECBSF::1:0:3:3" },
        { code: "SD-M:ECBSF::1:0:3:4" },
        { code: "DIFF{SD-M:ECBSF::1:0:1:0;-0.0640000104904175}" },
        { code: "DIFF{SD-M:ECBSF::1:0:3:1;-0.0640000104904175}" },
        { code: "DIFF{SD-M:ECBSF::1:0:3:2;0.0141249895095825}" },
        { code: "DIFF{SD-M:ECBSF::1:0:3:3;-0.0640000104904175}" },
        { code: "DIFF{SD-M:ECBSF::1:0:3:4;-0.0171250104904175}" },
        { code: "HSNOW-M:SMARTOBS:13:4" }
      ]
    }
  }
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setCheckedButton: (state, action: PayloadAction<boolean>) => {
      state.checked = action.payload;
    },
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
    setSoilWetnessData: (state, action: PayloadAction<(string | number)[][]>) => {
      state.soilWetnessData = action.payload;
    },
    setSoilTemperatureData: (state, action: PayloadAction<(string | number)[][]>) => {
      state.soilTemperatureData = action.payload;
    },
    setWindSpeedData: (state, action: PayloadAction<(string | number)[][]>) => {
      state.windGustData = action.payload;
    },
    setSnowHeightData: (
      state,
      action: PayloadAction<(string | number)[][]>
    ) => {
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
    },
    setSearchParams: (state, action: PayloadAction<keyof Configurations>) => {
      state.searchParams = action.payload;
    }
  }
});

export const actions = { ...globalSlice.actions };
export default globalSlice.reducer;
export type ReduxActions =
  | ReturnType<typeof actions.setTimeEndStartSpan>
  | ReturnType<typeof actions.setWindSpeedData>
  | ReturnType<typeof actions.setTrafficabilityData>
  | ReturnType<typeof actions.setSoilWetnessData>
  | ReturnType<typeof actions.setSnowHeightData>
  | ReturnType<typeof actions.setSoilTemperatureData>
  | ReturnType<typeof actions.setCheckedButton>
  | ReturnType<typeof actions.setMarkLine>
  | ReturnType<typeof actions.changeHideNextArrowState>
  | ReturnType<typeof actions.changeYear>
  | ReturnType<typeof actions.setSearchParams>
  | ReturnType<typeof actions.changeDefaultColor>;
