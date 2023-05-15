import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineProp {
	value: string;
}

const initialState: TimelineProp = {
	value: '2023-05-15T00:00:00',
};

const timelineSlice = createSlice({
	name: 'timeline',
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const timelineActions = { ...timelineSlice.actions };
export default timelineSlice.reducer;
export type ReduxActions = ReturnType<typeof timelineActions.setValue>;
