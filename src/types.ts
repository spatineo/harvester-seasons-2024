import WMSCapabilities from "ol/format/WMSCapabilities";

export interface GraphOptions {
  title: string;
}

export interface Smartmet {
  utctime: string;
  [key: string]: string | null | number;
}

export interface Parameter {
  code: string;
  title?: string;
}

export interface StartEndTimeSpan {
  start_time: string;
  end_time: string;
  time_step: number;
}

export type HistoricalReanalysisParams = {
  soilTemperature: Parameter[];
  soilWetness: Parameter[];
  snowHeight: Parameter[];
  windGust: Parameter[];
  startEndTimeSpan: StartEndTimeSpan;
};

export type DailyObservationsParams = {
  soilTemperature: Parameter[];
  soilWetness: Parameter[];
  snowHeight: Parameter[];
  windGust: Parameter[];
  startEndTimeSpan: StartEndTimeSpan;
};

export type SeasonalForecastDailyDnsembles = {
  soilTemperature: Parameter[];
  soilWetness: Parameter[];
  snowHeight: Parameter[];
  windGust: Parameter[];
  startEndTimeSpan: StartEndTimeSpan;
};

export type ShortPredictionDailyParams = {
  soilTemperature: Parameter[];
  soilWetness: Parameter[];
  snowHeight: Parameter[];
  windGust: Parameter[];
  startEndTimeSpan: StartEndTimeSpan;
};

export type ClimateProjection = {
  soilTemperature: Parameter[];
  soilWetness: Parameter[];
  snowHeight: Parameter[];
  windGust: Parameter[];
};

export type Configurations = {
  "Historical reanalysis": {
    parameters: HistoricalReanalysisParams;
  };
  "Daily observations": {
    parameters: DailyObservationsParams;
  };
  "Seasonal forecast daily ensembles": {
    parameters: SeasonalForecastDailyDnsembles;
  };
  "Short prediction daily": {
    parameters: ShortPredictionDailyParams;
  };
  "Climate projection": {
    parameters: SeasonalForecastDailyDnsembles;
  };
};

export interface GlobalStateProps {
  searchParams: keyof Configurations;
  defaultColorSwitch: boolean;
  trafficabilityIndexColor: number | null;
  hideNext: boolean;
  changeYear: string;
  markLine: string;
  startEndTimeSpan: StartEndTimeSpan;
  windSpeedData: [];
  trafficabilityData: [];
  soilWetnessData: Smartmet[];
  soilTemperatureData: [];
  snowHeightData: Smartmet[];
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

export interface RecordObject {
  [key: string]: number | null | string;
  utctime: string;
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
