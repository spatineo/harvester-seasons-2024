/* eslint-disable import/default */
import React, { FC } from 'react';
import { Switch, Box, Typography } from '@mui/material';
import { useAppSelector, useRootDispatch } from '../store/hooks';
import { RootState } from '../store/store';
import { actions } from '../globalSlice';

const SwitchComponent: FC = () => {
	const dispatch = useRootDispatch();
	const checked = useAppSelector((state: RootState) => state.global.checked);
	return (
		<Box>
			<Box sx={{ margin: '1rem 0rem ' }}>
				<Switch
					checked={checked}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						dispatch(actions.setCheckedButton(event.target.checked));
					}}
					sx={{ margin: '0rem' }}
				/>
				<Typography sx={{ fontFamily: 'Lato' }} component={'span'}>
					Turn on to change timestep between 1 year and 10 years{' '}
				</Typography>
			</Box>
		</Box>
	);
};

export default SwitchComponent;
