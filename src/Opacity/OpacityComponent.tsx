/* eslint-disable import/default */
import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useAppSelector, useRootDispatch } from '../store/hooks';
import { RootState } from '../store/store';
import { actions } from '../globalSlice';

const OpacityComponent: React.FC = () => {
	const dispatch = useRootDispatch();
	const opacityValue = useAppSelector((state: RootState) => state.global.opacityValue);
 
	return (
    <Box width={300} sx={{ display: 'flex', flexDirection: 'row', gap: '1em', position: 'relative', top: '2rem'}}>
      <Typography sx={{ fontFamily: "Lato" }}>Opacity: </Typography>
      <Slider
        value={opacityValue}
        aria-label="Opacity"
        onChange={(event: Event, newValue: number | number[]) => {
          if(typeof newValue === 'number'){
            dispatch(actions.setOpacity(newValue))
          }
        }}
      />
      <Typography>{opacityValue}%</Typography>
    </Box>
  );
};

export default OpacityComponent;