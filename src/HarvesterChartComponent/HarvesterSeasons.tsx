// eslint-disable-next-line import/default
import React, { FC } from 'react';
import { Box } from '@mui/material';
import GraphComponent from '../GraphComponent/GraphComponent';
import { HarvesterChartProps } from '../types';

const HarvesterSeasons: FC<HarvesterChartProps> = ({
	option,
	handleClick,
	handleOnmouseEnter,
	handleOnmouseLeave,
}) => {
	return (
		<Box>
			{option ? (
				<GraphComponent
					onEvents={{
						click: handleClick,
						mouseover: handleOnmouseEnter,
						globalout: handleOnmouseLeave,
					}}
					option={option}
				/>
			) : (
				<span>No data available</span>
			)}
		</Box>
	);
};

export default HarvesterSeasons;
