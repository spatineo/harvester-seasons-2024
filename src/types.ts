import WMSCapabilities from "ol/format/WMSCapabilities";

export interface GraphOptions {
  title: string;
}

export interface Smartmet {
  utctime: string;
  [key: string]: string | null | number;
}

export interface StartEndTimeSpan {
  start_time: string;
  end_time: string;
  time_step: number | string;
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

export interface ModeForLayers {
  layerName: string;
  opacity: number;
  layerInfo: WMSCapabilitiesLayerType | null;
  WMSTimeStrategy: WMSLayerTimeStrategy;
}

export interface Parameter {
  code: string;
  title?: string;
}

export interface ConfigMode<T extends Parameter[]> {
  parameters: {
    [key: string]: T;
  };
  startEndTimeSpan?: StartEndTimeSpan;
  layers: {
    [key: string]: ModeForLayers;
  };
}

export type SeasonDesignParams = {
  soilTemperature: Parameter[];
  soilWetness: Parameter[];
  snowHeight: Parameter[];
  windGust: Parameter[];
  startEndTimeSpan?: StartEndTimeSpan;
};

export type Configurations = {
  "Historical reanalysis": ConfigMode<Parameter[]>;
  "Daily observations": ConfigMode<Parameter[]>;
  "Seasonal forecast daily ensembles": ConfigMode<Parameter[]>;
  "Short prediction daily": ConfigMode<Parameter[]>;
  "Climate projection": ConfigMode<Parameter[]>;
};

export interface GlobalStateProps {
  searchParams: keyof Configurations;
  defaultColorSwitch: boolean;
  trafficabilityIndexColor: number | null;
  hideNext: boolean;
  changeYear: string;
  markLine: string;
  startEndTimeSpan: StartEndTimeSpan;
  windGustData: (string | number)[][];
  trafficabilityData: [];
  soilWetnessData: (string | number)[][];
  soilTemperatureData: (string | number)[][];
  snowHeightData: (string | number)[][];
  checked: boolean;
  params: Configurations;
  parameters: {
    twelveMonthParams: {
      windSpeed: Parameter[];
      trafficability: Parameter[];
      snowHeight: Parameter[];
      soilTemperature: Parameter[];
      soilWetness: Parameter[];
    };
    tenYearParams: {
      windSpeed: Parameter[];
      trafficability: Parameter[];
      snowHeight: Parameter[];
      soilTemperature: Parameter[];
      soilWetness: Parameter[];
    };
  };
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

export interface MapsStateProps {
  title: string;
  url: string;
  visible: boolean;
  attributions: string;
}

export interface Map {
  harvesterWMSCapabilities: WMSCapabilities | null;
  opacityValue: number;
  position: {
    lat: number | null;
    lon: number | null;
    resolution: number;
  };
  maps: MapsStateProps[];
  WMSLayerState: WMSLayers[];
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
  Name: string;
  Title?: string;
  Style: WMSCapabilitiesStyleType[];
  Dimension: WMSCapabilitiesDimensionType[];
}
