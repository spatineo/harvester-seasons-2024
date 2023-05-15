import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapPosition {
	lat: number | null;
	lon: number | null;
	resolution: number;
}

export interface Map {
	position: MapPosition;
}

const initialState: Map = {
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
	},
});

export const mapActions = { ...mapComponentSlice.actions };
export default mapComponentSlice.reducer;
export type ReduxActions = ReturnType<typeof mapActions.setPosition>;
