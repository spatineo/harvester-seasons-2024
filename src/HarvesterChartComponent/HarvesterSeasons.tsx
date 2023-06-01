// eslint-disable-next-line import/default
import React, { FC, useState } from 'react';
import { Box } from '@mui/material';
import GraphComponent from '../GraphComponent/GraphComponent';
import EchartsComponent from '../EchartsComponent/EchartsComponent'
import { HarvesterChartProps } from '../types';

const HarvesterSeasons: FC<HarvesterChartProps> = ({
	option,
	showLegend,
	handleClick,
	handleOnmouseEnter,
	handleOnmouseLeave,
}) => {
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedYValues, setSelectedYValues] = useState<(string | number)[]>([]);

  const handleSetValuesProps = (date: string | null, yValues: (string | number)[]) => {
    setSelectedDate(date);
    setSelectedYValues(yValues);
  };


	console.log(selectedDate)
	return (
		<Box>
			<Box>
				Box
			</Box>
			{/* {option ? (
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
			)} */}
			{
				option ? (
					<EchartsComponent option={option} setValuesProps={handleSetValuesProps}  />
				) :
				(<Box>No data</Box>)
			}
		</Box>
	);
};

export default HarvesterSeasons;
