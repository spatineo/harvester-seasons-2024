import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Map, WMSLayerTimeStrategy } from "../types";

const initialState: Map = {
  opacityValue: 70,
  position: {
    lat: null,
    lon: null,
    resolution: 3550
  },

  WMSLayerState: [
    {
      visible: false,
      layerName: "gui:isobands:CERRA_FFG-MS",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion
    },
    {
      visible: false,
      layerName: "gui:isobands:SWI_SWI2",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion
    },
    {
      visible: false,
      layerName: "gui:isobands:ERA5L_TSOIL-K",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion
    },
    {
      visible: true,
      layerName: "harvester:ecsf:HSNOW-M",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion
    }
  ]
};

const mapComponentSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setPosition: (
      state,
      action: PayloadAction<{ lat: number; lon: number }>
    ) => {
      state.position.lat = action.payload.lat;
      state.position.lon = action.payload.lon;
    },
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacityValue = action.payload;
    },
    setWMSLayer: (state, action: PayloadAction<{visible: boolean, index: number}>) => {
    
      const newState = state.WMSLayerState.map((item, i) => {
        if (i === action.payload.index) {
          return { ...item, visible: action.payload.visible };
        } else {
          return { ...item, visible: false };
        }
      });
      return { ...state, WMSLayerState: newState };
    }
  }
});

export const mapActions = { ...mapComponentSlice.actions };
export default mapComponentSlice.reducer;
export type ReduxActions =
  | ReturnType<typeof mapActions.setPosition>
  | ReturnType<typeof mapActions.setOpacity>
  | ReturnType<typeof mapActions.setWMSLayer>;
