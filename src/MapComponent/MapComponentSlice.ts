import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Map } from '../types';

export interface MapPosition {
	lat: number | null;
	lon: number | null;
	resolution: number;
}

const initialState: Map = {
	opacityValue: 70,
	position: {
		lat: null,
		lon: null,
		resolution: 3550,
	},
};

const mapComponentSlice = createSlice({
	name: 'map',
	initialState,
	reducers: {
		setPosition: (state, action: PayloadAction<{ lat: number; lon: number }>) => {
			state.position.lat = action.payload.lat;
			state.position.lon = action.payload.lon;
		},
		setOpacity: (state, action: PayloadAction<number>) => {
      state.opacityValue = action.payload;
    },
	},
});

export const mapActions = { ...mapComponentSlice.actions };
export default mapComponentSlice.reducer;
export type ReduxActions = ReturnType<typeof mapActions.setPosition>
| ReturnType<typeof mapActions.setOpacity>;
