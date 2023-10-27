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

export interface GlobalStateProps {
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

export interface WMSLayers {
  layerName: string;
  visibility: boolean;
  opacity: number;
  WMSTimeStrategy: WMSLayerTimeStrategy
}

export interface Map {
  opacityValue: number;
  position: {
    lat: number | null;
    lon: number | null;
    resolution: number;
  };
  WMSLayerState: WMSLayers[]
}