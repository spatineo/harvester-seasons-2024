import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Map, WMSLayerTimeStrategy } from "../types";

const initialState: Map = {
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
      attributions:
        'Tausta <a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts" target="_blank">Maanmittauslaitoksen avoin data</a>',
      url: "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17"
    },
    {
      title: "Maastokartta",
      visible: false,
      url: "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17",
      attributions:
        '<a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts" target="_blank">Maanmittauslaitoksen avoin data</a>'
    },
    {
      title: "Thunderforest",
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attributions:
        '<a href="https://www.thunderforest.com/" target="_blank">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
      visible: false
    }
  ],
  WMSLayerState: [
    {
      id: 1,
      visible: false,
      layerName: "gui:isobands:CERRA_FFG-MS",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion,
      legend: {
        enabled: false,
        width: 20,
        height: 345
      }
    },
    {
      id: 2,
      visible: false,
      layerName: "gui:isobands:SWI_SWI2",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion,
      legend: {
        enabled: false,
        width: 65,
        height: 345
      }
    },
    {
      id: 3,
      visible: false,
      layerName: "gui:isobands:ERA5L_TSOIL-K",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion,
      legend: {
        enabled: false,
        width: 100,
        height: 400
      }
    },
    {
      id: 4,
      visible: true,
      layerName: "harvester:ecsf:HSNOW-M",
      opacity: 0.5,
      WMSTimeStrategy: WMSLayerTimeStrategy.NoTimeDimesion,
      legend: {
        enabled: true,
        width: 10,
        height: 345
      }
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
    setWMSLayer: (
      state,
      action: PayloadAction<number>
    ) => {
      const newState = state.WMSLayerState.map((item) => {
        if (item.id === action.payload) {
          return { ...item, visible: true, legend: {...item.legend,
            enabled: true
          } };
        } else {
          return { ...item, visible: false, legend: {...item.legend, enabled: false}};
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
  | ReturnType<typeof mapActions.setBaseLayers>
  | ReturnType<typeof mapActions.setWMSLayer>;
