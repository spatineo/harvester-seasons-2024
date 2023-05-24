export interface HarvesterChartProps {
	option: {};
	handleClick: (data: { value: [] }) => void;
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
	startEndTimeSpan: StartEndTimeSpan;
	trafficabilityData: [];
	soilWetnessData: [];
	soilTemperatureData: [];
	snowHeight: [];
	checked: boolean;
	parameters: {
		sixMonthParams: {
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
