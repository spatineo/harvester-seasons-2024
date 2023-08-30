import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalStateProps, Smartmet } from "./types";
import * as utils from "./utils/helpers";

const endDate = utils.addMonths(utils.getStartSearchDate(), 12).toISOString();
const startDate = utils.getStartSearchDate().toISOString();
const soilTemperaturCodeArray = utils.soilTemperatureParams([]);
const trafficabilityApiParams = utils.trafficabilityApiParams();
const snowHeightParams = utils.snowHeightApiParams();
const soilWetnessParams = utils.soilWetnesstApiParams();
const marked = new Date(
  utils.marklineStartDate(utils.getStartSearchDate())
).toISOString();

const initialState: GlobalStateProps = {
  hideNext: false,
  changeYear: "",
  markLine: marked,
  startEndTimeSpan: {
    start_time: startDate,
    end_time: endDate,
    time_step: 1440
  },
  windSpeedData: [],
  trafficabilityData: [],
  soilWetnessData: [],
  soilTemperatureData: [],
  snowHeightData: [],
  checked: false,
  parameters: {
    twelveMonthParams: {
      windSpeed: [],
      trafficability: [
        { code: "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}" },
        { code: "HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}" },
        { code: "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}" },
        { code: "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}" }
      ],
      soilWetness: [
       /*  ...soilWetnessParams,
        { code: "SWVL2-M3M3:SMARTMET:5015" }, */
        { code: "SWI2:SWI:5029:1:0:1" }
      ],
      soilTemperature: [
       /*  ...soilTemperaturCodeArray,
        { code: "K2C{TSOIL-K:ECBSF:::7:1:0}" }, */
        { code: "TSOIL-K:ERA5L:5022:9:1820:1" }
      ],
      snowHeight: [
       /*  { code: "HSNOW-M:ECBSF::1:0:1:0" },
        { code: "HSNOW-M:SMARTOBS:13:4" }, */
       { code: "SD-M:CLMS:5051:1:0:1" },
       //...snowHeightParams
      ]
    },
    tenYearParams: {
      windSpeed: [],
      trafficability: [
        { code: "TSOIL-K:ECBSF:::7:1:0" },
        ...trafficabilityApiParams
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
    setSoilWetnessData: (state, action: PayloadAction<Smartmet[]>) => {
      state.soilWetnessData = action.payload;
    },
    setSoilTemperatureData: (state, action: PayloadAction<[]>) => {
      state.soilTemperatureData = action.payload;
    },
    setWindSpeedData: (state, action: PayloadAction<[]>) => {
      state.windSpeedData = action.payload;
    },
    setSnowHeightData: (state, action: PayloadAction<Smartmet[]>) => {
      state.snowHeightData = action.payload;
    },
    setMarkLine: (state, action: PayloadAction<string>) => {
      const modifyDate = new Date(action.payload).toISOString();
      state.markLine = modifyDate;
    },
    changeYear: (state, action: PayloadAction<string>) => {
      state.changeYear = action.payload;
    },
    changeHideNextArrowState: (state, action: PayloadAction<boolean>) => {
      state.hideNext = action.payload;
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
  | ReturnType<typeof actions.changeYear>;
