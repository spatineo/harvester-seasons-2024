/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import * as echarts from 'echarts';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import { Parameter, TimelineControlStyle } from '../types';
import HarvesterSeasons from '../HarvesterChartComponent/HarvesterSeasons';

interface GraphOptions {
	title: string;
}
export interface Time {
	utctime: string;
}

const Graphs = () => {
	const [date, setDate] = useState<string[]>([]);
	const soilTemperatureData = useAppSelector(
		(state: RootState) => state.global.soilTemperatureData
	);
	const snowHeightData = useAppSelector((state: RootState) => state.global.snowHeight);
	const soilWetnessData = useAppSelector((state: RootState) => state.global.soilWetnessData);
	const graphParameters = useAppSelector((state: RootState) => state.global.parameters);
	const [soilWetnessOption, setSoilWetnessOption] = useState<any>(null);
	const [soilTemperatureOption, setSoilTemperatureOption] = useState<any>(null);
	const [snowHeightOption, setSnowHeightOption] = useState<any>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const [timelineGraph, setTimelineGraph] = useState<any>(null);
	const [data, setData] = useState<Time[]>([]);
	const dateMarker = new Date('2023-05-31').toDateString().substring(3);
	const [markLineValue, setMarkLineValue] = useState<string>(dateMarker);

	const dateFunc = (arr: Time[]) => {
		const d: string[] = [];
		arr.forEach((elements: { utctime: string }) => {
			const formattedDate = new Date(elements.utctime).toDateString().substring(3);
			d.push(formattedDate);
		});
		return d;
	};

	function createOptions(opts: GraphOptions, parameters: Parameter[], values: [], mark: string) {
		const source = () => {
			return [
				[
					...values.map((value: { utctime: string }) => {
						const modifiedDate = new Date(value.utctime).toDateString();
						return modifiedDate.substring(3);
					}),
				],
				...parameters.map((p) => {
					return values.map((value) => value[p.code]);
				}),
			];
		};

		return {
			dataset: {
				source: source(),
			},
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
				type: 'category',
				axisTick: {
					show: false,
				},
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
								xAxis: mark,
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
				...parameters.map((p) => {
					return {
						type: 'line',
						seriesLayoutBy: 'row',
					};
				}),
			],
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument

	useEffect(() => {
		const dateValue: any = dateFunc(data);
		console.log(dateValue, 'date value');
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
					show: true,
					interval: 2,
					rotate: 0,
					color: '#333',
					fontWeight: 'normal',
					fontSize: 12,
					align: 'center',
					formatter(value: string | number) {
						return new Date(value).toDateString().substring(3);
					},
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

			/* options: [
				{
					title: {
						text: '2023-04-02',
					},
				},
				{
					title: {
						text: '2023-04-03',
					},
				},
				{
					title: {
						text: '2023-05',
					},
				},
				{
					title: {
						text: '2023-06',
					},
				},
				{
					title: {
						text: '2023-07',
					},
				},
			], */
		};

		if (timelineGraph) {
			timelineGraph.setOption(option as echarts.EChartOption<echarts.EChartOption.Series>, true);
		}

		if (timelineGraph) {
			timelineGraph.on('timelinechanged', function (params: any) {
				const value = params.currentIndex; // get the index of the current data point
				const timelineData = option?.timeline?.data;
				if (timelineData) {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					window.console.log(`Value at index ${value}: ${timelineData[value]}`);
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
		if (soilTemperatureData && !markLineValue !== undefined) {
			const tmp = createOptions(
				{ title: 'Soil Temperature' },
				graphParameters.soilTemperature,
				soilTemperatureData,
				markLineValue
			);
			setSoilTemperatureOption(tmp);
		}
	}, [soilTemperatureData, graphParameters.soilTemperature, markLineValue]);

	useEffect(() => {
		if (soilWetnessData) {
			const tmp = createOptions(
				{ title: 'Soil Wetness' },
				graphParameters.soilWetness,
				soilWetnessData,
				markLineValue
			);
			setSoilWetnessOption(tmp);
		}
	}, [soilWetnessData, graphParameters.soilWetness, markLineValue]);

	useEffect(() => {
		if (snowHeightData) {
			const tmp = createOptions(
				{ title: 'Snow Height' },
				graphParameters.snowHeight,
				snowHeightData,
				markLineValue
			);
			setSnowHeightOption(tmp);
			setData(snowHeightData);
		}
	}, [snowHeightData, graphParameters.snowHeight, markLineValue]);

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
