import React from 'react';
import { Box } from '@mui/material';
import EchartsComponent from '../EchartsComponent/EchartsComponent'
import { HarvesterChartProps } from '../types';

const HarvesterSeasons: React.FC<HarvesterChartProps> = ({
	option,
}) => {
	
	return (
		<Box>
			{
				option ? (
					<EchartsComponent option={option} />
				) :
				(<Box>No data</Box>)
			}
		</Box>
	);
};

export default HarvesterSeasons;
