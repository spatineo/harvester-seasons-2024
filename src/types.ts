export interface HarvesterChartProps {
  option: {};
}

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
  opacityValue: number
  markLine: string;
  startEndTimeSpan: StartEndTimeSpan;
  trafficabilityData: [];
  soilWetnessData: Smartmet[];
  soilTemperatureData: [];
  snowHeightData: Smartmet[];
  checked: boolean;
  parameters: {
    twelveMonthParams: {
      trafficability: Parameter[];
      snowHeight: Parameter[];
      soilTemperature: Parameter[];
      soilWetness: Parameter[];
    };
    tenYearParams: {
      trafficability: Parameter[];
      snowHeight: Parameter[];
      soilTemperature: Parameter[];
      soilWetness: Parameter[];
    };
  };
}

export interface Map {
  position: {
    lat: number;
    lon: number;
    resolution: number;
  };
}

export interface TimelineControlStyle {
  itemSize?: number;
  itemGap?: number;
  normal?: {
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    borderType?: string;
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
  };
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
