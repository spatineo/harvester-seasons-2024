import WMSCapabilities from "ol/format/WMSCapabilities";

export interface GraphOptions {
  title: string;
}

export interface Smartmet {
  utctime: string;
  code?: Record<string, string | null | number>;
}

export interface Parameter {
  code: string;
  title?: string;
  layerName?: string;
  Name?: string;
  Title?: string;
}

export interface StartEndTimeSpan {
  start_time: string;
  end_time: string;
  time_step: number | string;
}

export interface GlobalStateProps {
  defaultColorSwitch: boolean;
  hideArrowPrevious: boolean;
  trafficabilityIndexColor: number | null;
  hideNext: boolean;
  changeYear: string;
  markLine: string;
  startEndTimeSpan: StartEndTimeSpan;
  windGustData: Smartmet[];
  trafficabilityData: [];
  soilWetnessData: Smartmet[];
  soilTemperatureData: Smartmet[];
  snowHeightData: Smartmet[];
  params: {
    trafficability: Parameter[];
    snowHeight: Parameter[];
    soilTemperature: Parameter[];
    windGust: Parameter[];
    soilWetness: Parameter[];
  }
}

export interface TimelineControlStyle {
  itemSize?: number;
  itemGap?: number;
  emphasis?: {
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    borderType?: string;
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
  };
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface ColorPalette {
  palette_huono: Color[];
  palette_epavarma_kesa_keli: Color[];
  palette_epavarma_talvi_keli: Color[];
  palette_hyva_kesa_keli: Color[];
  palette_hyva_talvi_keli: Color[];
  palette_base_color: Color[];
}

export enum WMSLayerTimeStrategy {
  NoTimeDimesion,
  Latest,
  LatestBeforeNow,
  EarliestAfterNow,
  ForceSelectedDate
}

export interface Legend {
  enabled: boolean;
  width: number;
  height: number;
}

export interface LayerType {
  Name: string;
  Title: string;
  Dimension: DimensionType[];
  Style: [];
  message?: string;
}

export interface WMSLayers {
  id: number;
  visible: boolean;
  layerName: string;
  opacity: number;
  layerInfo: WMSCapabilitiesLayerType | null;
  WMSTimeStrategy: WMSLayerTimeStrategy;
  legend: Legend;
}

export interface MapsStateProps {
  title: string;
  url: string;
  visible: boolean;
  attributions: string;
}

export interface Map {
  harvesterWMSCapabilities: WMSCapabilities | null;
  opacityValue: number;
  indexNumber: number;
  position: {
    lat: number | null;
    lon: number | null;
    resolution: number;
  };
  maps: MapsStateProps[];
 showTrafficabilityLayer: boolean;
  capabilities: Record<string, string | {}>
  layerState: WMSCapabilitiesLayerType[]
}

export interface DimensionType {
  name: string;
  values: string;
}

export interface WMSCapabilitiesStyleType {
  LegendURL: {
    Format: string;
    OnlineResource: string;
    size: number[];
  };
}

export interface WMSCapabilitiesDimensionType {
  name: string;
  values: string;
}

export interface WMSCapabilitiesLayerType {
  disabled?: boolean;
  id?: number;
  layerName?: string;
  Name: string;
  Title?: string;
  Style: WMSCapabilitiesStyleType[];
  Dimension: WMSCapabilitiesDimensionType[];
}
