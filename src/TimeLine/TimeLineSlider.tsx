/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Box } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';

export interface Time {
	utctime: string;
}
interface TimelineControlStyle {
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

const TimelineSlider = () => {
	const timelineRef = useRef<HTMLDivElement>(null);
	const snowHHeightData = useAppSelector((state: RootState) => state.global.snowHeight);
	const [data, setData] = useState<Time[]>([]);
	const [timelineGraph, setTimelineGraph] = useState<any>(null);

	const dateFunc = (arr: Time[]) => {
		const date: string[] = [];
		arr.forEach((elements: { utctime: string }) => {
			date.push(elements.utctime);
		});
		return date;
	};

	useEffect(() => {
		if (snowHHeightData.length > 0) {
			setData(snowHHeightData);
		}
	}, [snowHHeightData]);

	useEffect(() => {
		const date: any = dateFunc(data);
		const option: any = {
			timeline: {
				data: date,
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
						return new Date(value).toLocaleDateString(undefined, {
							month: 'long',
							year: 'numeric',
						});
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

			options: [
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
			],
		};

		if (timelineGraph) {
			timelineGraph.setOption(option as echarts.EChartOption<echarts.EChartOption.Series>, true);
		}

		if (timelineGraph) {
			timelineGraph.on('timelinechanged', function (params: any) {
				const value = params.currentIndex; // get the index of the current data point
				console.log('graph for time line');
				const timelineData = option?.timeline?.data;
				console.log(timelineData, 'timeline data check');
				if (timelineData) {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					window.console.log(`Value at index ${value}: ${timelineData[value]}`);
				}
			});
		}
	}, [timelineGraph, data]);

	useEffect(() => {
		if (!timelineRef.current) {
			throw Error('Echarts not available');
		}
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

	return <Box ref={timelineRef}></Box>;
};

export default TimelineSlider;
