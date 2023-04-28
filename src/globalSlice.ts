import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalStateProps } from "./types";
import *  as utils from './utils'

const intialEndDateSixMonths = utils.addSixMonths(new Date(), 6).toISOString()
const initialStartDate = new Date().toISOString()

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
    snowHeight: [
      {
        code: 'DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059}'
      },
      {
        code: ''}
    ]
  }
}
const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setCheckedButton: (state, action: PayloadAction<boolean>) => {
      state.checked = action.payload
    },
    setTimeEndStartSpan: (state, action: PayloadAction<{start_time: string, end_time: string, time_step: number}>) => {
      state.startEndTimeSpan = {
        ...state.startEndTimeSpan, 
        start_time: action.payload.start_time, 
        end_time: action.payload.end_time, 
        time_step: action.payload.time_step
      }
    },
    setTrafficabilityData: (state, action: PayloadAction<[]>) => {
      state.trafficabilityData = action.payload
    },
    setSoilWetnessData: (state, action: PayloadAction<[]>) => {
      state.soilWetnessData = action.payload
    },
    setSoilTemperatureData: (state, action: PayloadAction<[]>) => {
      state.soilTemperatureData = action.payload
    },
    setSnowHeightData: (state, action: PayloadAction<[]>) => {
      state.snowHeight = action.payload
    },
  }
})

export const actions = { ...globalSlice.actions }
export default globalSlice.reducer
export type ReduxActions =
  | ReturnType<typeof actions.setTimeEndStartSpan>
  | ReturnType<typeof actions.setTrafficabilityData>
  | ReturnType<typeof actions.setSoilWetnessData>
  | ReturnType<typeof actions.setSnowHeightData>
  | ReturnType<typeof actions.setSoilTemperatureData>
  | ReturnType<typeof actions.setCheckedButton>