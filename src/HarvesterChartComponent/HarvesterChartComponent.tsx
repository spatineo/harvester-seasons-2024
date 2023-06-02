// eslint-disable-next-line import/default
import React, { FC, useState } from 'react';
import { Box } from '@mui/material';
import EchartsComponent from '../EchartsComponent/EchartsComponent'
import { HarvesterChartProps } from '../types';

const HarvesterSeasons: FC<HarvesterChartProps> = ({
	option,
	handleClick,
	handleOnmouseEnter,
}) => {
	
	return (
		<Box>
			{
				option ? (
					<EchartsComponent option={option} setValuesProps={handleOnmouseEnter} />
				) :
				(<Box>No data</Box>)
			}
		</Box>
	);
};

export default HarvesterSeasons;
