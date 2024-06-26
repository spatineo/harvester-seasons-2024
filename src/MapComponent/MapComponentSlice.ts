import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Map, WMSCapabilitiesLayerType } from "../types";
import WMSCapabilities from "ol/format/WMSCapabilities";

const initialState: Map = {
  harvesterWMSCapabilities: null,
  opacityValue: 70,
  position: {
    lat: null,
    lon: null,
    resolution: 3550
  },
  maps: [
    {
      title: "Taustakartta",
      visible: true,
      attributions: 'Tausta <a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts" target="_blank">Maanmittauslaitoksen avoin data</a>',
      url: "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17"
    },
    {
      title: "Maastokartta",
      visible: false,
      url: "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17",
      attributions: '<a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts" target="_blank">Maanmittauslaitoksen avoin data</a>'
    },
    {
      title: "Thunderforest",
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attributions: '<a href="https://www.thunderforest.com/" target="_blank">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
      visible: false
    }
  ],
  indexNumber: 0,
  layerState: [],
  capabilities: {},
  showTrafficabilityLayer: true
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
    setBaseLayers: (state, action: PayloadAction<string>) => {
      const newState = state.maps.map((item) => {
        if (item.title === action.payload) {
          return { ...item, visible: true };
        } else {
          return { ...item, visible: false };
        }
      });
      return { ...state, maps: newState };
    },
    setIndexNumbers: (state, action: PayloadAction<number>) => {
      state.indexNumber = action.payload;
    },
    setHarvesterWMSCapabilities: (
      state,
      action: PayloadAction<null | WMSCapabilities>
    ) => {
      state.harvesterWMSCapabilities = action.payload;
    },
    setCapabilities: (
      state,
      action: PayloadAction<Record<string, string | {}>>
    ) => {
      state.capabilities = action.payload;
    },
    setLayerState: (state, action: PayloadAction<WMSCapabilitiesLayerType>) => {
      const payload = action.payload;
      const isDuplicate = state.layerState.some(
        (layer) => layer.Name === payload.Name
      );
      if (!isDuplicate) {
        state.layerState.push(payload);
      }
    },
    setShowTrafficabilityLayer: (state, action: PayloadAction<boolean>) => {
      state.showTrafficabilityLayer = action.payload
    }
  }
});

export const mapActions = { ...mapComponentSlice.actions };
export default mapComponentSlice.reducer;
export type ReduxActions =
  | ReturnType<typeof mapActions.setPosition>
  | ReturnType<typeof mapActions.setOpacity>
  | ReturnType<typeof mapActions.setBaseLayers>
  | ReturnType<typeof mapActions.setHarvesterWMSCapabilities>
  | ReturnType<typeof mapActions.setIndexNumbers>
  | ReturnType<typeof mapActions.setCapabilities>
  | ReturnType<typeof mapActions.setLayerState>
  | ReturnType<typeof mapActions.setShowTrafficabilityLayer>;
