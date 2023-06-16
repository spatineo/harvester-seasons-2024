import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalStateProps } from "./types";
import * as utils from "./utils";

const intialEndDateSixMonths = utils.addSixMonths(new Date(), 6).toISOString();
const initialStartDate = new Date().toISOString();
const soilTemperaturCodeArray = utils.soilTemperatureCode([]);
const trafficabilityApiParams = utils.trafficabilityApiParams();
const soilHeightParams = utils.snowHeightApiParams();
const soilWetnessParams = utils.soilWetnesstApiParams();

const initialState: GlobalStateProps = {
  startEndTimeSpan: {
    start_time: initialStartDate,
    end_time: intialEndDateSixMonths,
    time_step: 1440
  },
  trafficabilityData: [],
  soilWetnessData: [],
  soilTemperatureData: [],
  snowHeight: [],
  checked: false,
  parameters: {
    sixMonthParams: {
      trafficability: [
        { code: "TSOIL-K:ECBSF:::7:1:0" },
        ...trafficabilityApiParams
      ],
      soilWetness: [...soilWetnessParams, { code: "SWVL2-M3M3:SMARTMET:5015" }],
      soilTemperature: [
        ...soilTemperaturCodeArray,
        { code: "K2C{TSOIL-K:ECBSF:::7:1:0}" }
      ],
      snowHeight: [{ code: "HSNOW-M:ECBSF::1:0:1:0" }, ...soilHeightParams]
    },
    tenYearParams: {
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
    setSoilWetnessData: (state, action: PayloadAction<[]>) => {
      state.soilWetnessData = action.payload;
    },
    setSoilTemperatureData: (state, action: PayloadAction<[]>) => {
      state.soilTemperatureData = action.payload;
    },
    setSnowHeightData: (state, action: PayloadAction<[]>) => {
      state.snowHeight = action.payload;
    }
  }
});

export const actions = { ...globalSlice.actions };
export default globalSlice.reducer;
export type ReduxActions =
  | ReturnType<typeof actions.setTimeEndStartSpan>
  | ReturnType<typeof actions.setTrafficabilityData>
  | ReturnType<typeof actions.setSoilWetnessData>
  | ReturnType<typeof actions.setSnowHeightData>
  | ReturnType<typeof actions.setSoilTemperatureData>
  | ReturnType<typeof actions.setCheckedButton>;
