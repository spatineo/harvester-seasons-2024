/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Box } from '@mui/material';
import { useAppSelector, useRootDispatch } from '../store/hooks';
import { RootState } from '../store/store';
import { timelineActions } from './TimelineSlice';
import { getDatesForDuration } from '../utils';

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
	const dispatch = useRootDispatch();

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
		const date: Array<string> = getDatesForDuration(new Date(), 6, true);
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
					show: false,
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
					// window.console.log(`Value at index ${value}: ${timelineData[value]}`);
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					dispatch(timelineActions.setValue(`${timelineData[value]}`));
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
