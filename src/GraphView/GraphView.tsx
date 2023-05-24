/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import * as echarts from 'echarts';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import { Parameter, TimelineControlStyle } from '../types';
import HarvesterSeasons from '../HarvesterChartComponent/HarvesterSeasons';
import { getDatesForDuration } from '../utils';

interface GraphOptions {
	title: string;
}
export interface Time {
	utctime: string;
}

const Graphs = () => {
	const soilTemperatureData = useAppSelector(
		(state: RootState) => state.global.soilTemperatureData
	);
	const checked = useAppSelector((state: RootState) => state.global.checked);
	const graphParameters = useAppSelector((state: RootState) => state.global.parameters);
	const snowHeightData = useAppSelector((state: RootState) => state.global.snowHeight);
	const soilWetnessData = useAppSelector((state: RootState) => state.global.soilWetnessData);
	const [soilWetnessOption, setSoilWetnessOption] = useState<any>(null);
	const [soilTemperatureOption, setSoilTemperatureOption] = useState<any>(null);
	const [snowHeightOption, setSnowHeightOption] = useState<any>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const [timelineGraph, setTimelineGraph] = useState<any>(null);
	const [data, setData] = useState<Time[]>([]);
	const start = new Date();
	start.setDate(start.getUTCDate() + 10);

	const createOptions = useCallback(
		(opts: GraphOptions, parameters: Parameter[], values: [], mark: string) => {
			const marked = new Date(mark).toISOString();
			return {
				animationThreshold: 1,
				/* dataset: {
					source: source(),
					dimension: ['timestamp'],
				}, */
				legend: null,
				grid: {},
				tooltip: {
					show: false,
					trigger: 'axis',
				},
				yAxis: {
					name: opts.title,
					nameLocation: 'middle',
					nameTextStyle: {
						padding: 14,
					},
				},
				xAxis: {
					type: 'time',
				},
				series: [
					{
						label: {
							show: false,
						},
						type: 'line',
						seriesLayoutBy: 'row',
						markLine: {
							data: [
								{
									// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
									xAxis: marked,
									name: '',
									type: 'min',
									label: { show: false },
								},
							],
							symbol: 'none',
							lineStyle: {
								type: 'solid',
								width: 3,
								arrow: 'none',
							},
						},
					},
					...parameters.map((p: { code: string }) => {
						const codes = p.code;
						return {
							type: 'line',
							seriesLayoutBy: 'row',
							data: values.map((d: { utctime: string; [key: string]: string }) => {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-return
								return [d.utctime, d[codes]];
							}),
						};
					}),
				],
			};
		},
		[]
	);

	useEffect(() => {
		const result = new Date();
		result.setDate(result.getDate() + 2);
		const dateValue: Array<string> = getDatesForDuration(result, 6, true);
		const option: any = {
			timeline: {
				data: dateValue,
				autoPlay: false,
				playInterval: 1000,
				left: 'center',
				bottom: 0,
				width: '100%',
				height: '50%',
				label: {
					position: 'bottom',
					show: false,
					interval: 2,
					rotate: 0,
					color: '#333',
					fontWeight: 'normal',
					fontSize: 12,
					align: 'center',
				},
				controlStyle: {
					position: 'left',
					showPlayBtn: true,
					showPrevBtn: true,
					showNextBtn: true,
					itemSize: 18,
					itemGap: 8,
					normal: {
						color: '#333',
					},
					emphasis: {
						color: '#1e90ff',
					},
				} as TimelineControlStyle,
			},
		};

		if (timelineGraph) {
			timelineGraph.setOption(option as echarts.EChartOption<echarts.EChartOption.Series>, true);
		}

		if (timelineGraph) {
			timelineGraph.on('timelinechanged', function (params: any) {
				const value = params.currentIndex; // get the index of the current data point
				const timelineData = option?.timeline?.data;
				if (timelineData[value]) {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					setMarkLineValue(`${timelineData[value]}`);
				}
			});
		}
	}, [timelineGraph, data]);

	useEffect(() => {
		if (!timelineRef.current) {
			throw Error('Echarts not available');
		}
		// eslint-disable-next-line import/namespace
		const timeline: any = echarts.init(timelineRef.current, undefined, {
			height: '70',
		});
		setTimelineGraph(timeline);

		return () => {
			if (timeline) {
				timeline.dispose();
			}
		};
	}, [timelineRef]);

	useEffect(() => {
		if (snowHeightData) {
			setData(snowHeightData);
		}
	}, [snowHeightData]);

	useEffect(() => {
		if (soilWetnessData || soilTemperatureData || snowHeightData) {
			if (!checked) {
				const soilWetness = createOptions(
					{ title: 'Soil Wetness' },
					graphParameters.sixMonthParams.soilWetness,
					soilWetnessData,
					markLineValue
				);
				const soilTemperature = createOptions(
					{ title: 'Soil Temperature' },
					graphParameters.sixMonthParams.soilTemperature,
					soilTemperatureData,
					markLineValue
				);
				const snowHeight = createOptions(
					{ title: 'Snow Height' },
					graphParameters.sixMonthParams.snowHeight,
					snowHeightData,
					markLineValue
				);
				setSoilWetnessOption(soilWetness);
				setSnowHeightOption(snowHeight);
				setSoilTemperatureOption(soilTemperature);
			} else {
				const soilWetness = createOptions(
					{ title: 'Soil Wetness' },
					graphParameters.tenYearParams.soilWetness,
					soilWetnessData,
					markLineValue
				);
				const soilTemperature = createOptions(
					{ title: 'Soil Temperature' },
					graphParameters.tenYearParams.soilTemperature,
					soilTemperatureData,
					markLineValue
				);
				const snowHeight = createOptions(
					{ title: 'Snow Height' },
					graphParameters.tenYearParams.snowHeight,
					snowHeightData,
					markLineValue
				);
				setSnowHeightOption(snowHeight);
				setSoilTemperatureOption(soilTemperature);
				setSoilWetnessOption(soilWetness);
			}
		}
	}, [
		soilWetnessData,
		snowHeightData,
		soilTemperatureData,
		graphParameters.sixMonthParams.soilWetness,
		graphParameters.sixMonthParams.soilTemperature,
		graphParameters.sixMonthParams.snowHeight,
		graphParameters.tenYearParams.soilTemperature,
		graphParameters.tenYearParams.snowHeight,
		graphParameters.tenYearParams.soilWetness,
		markLineValue,
	]);

	return (
		<Box>
			<Box>{markLineValue}</Box>
			<Box ref={timelineRef}></Box>
			<HarvesterSeasons
				option={soilWetnessOption}
				handleClick={(d) => window.console.log('click', d)}
			/>
			<HarvesterSeasons
				option={soilTemperatureOption}
				handleClick={() => window.console.log('click')}
			/>
			<HarvesterSeasons
				option={snowHeightOption}
				handleClick={(d: any) => window.console.log('click', d)}
			/>
		</Box>
	);
};

export default Graphs;
