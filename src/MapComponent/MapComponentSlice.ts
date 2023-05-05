import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Map {
	position: {
		lat: number;
		lon: number;
		resolution: number;
	};
}

const initialState: Map = {
	position: {
		lat: 0,
		lon: 0,
		resolution: 3550,
	},
};

const mapComponentSlice = createSlice({
	name: 'map',
	initialState,
	reducers: {
		setPosition: (
			state,
			action: PayloadAction<{ lat: number; lon: number }>
		) => {
			state.position.lat = action.payload.lat;
			state.position.lon = action.payload.lon;
		},
	},
});

export const { setPosition } = mapComponentSlice.actions;
export default mapComponentSlice.reducer;
