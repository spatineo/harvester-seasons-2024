import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineProp {
	value: string;
}

const initialState: TimelineProp = {
	value: '',
};

const timelineSlice = createSlice({
	name: 'timeline',
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<string>) => {
			console.log(action.payload);
			state.value = action.payload;
		},
	},
});

export const timelineActions = { ...timelineSlice.actions };
export default timelineSlice.reducer;
export type ReduxActions = ReturnType<typeof timelineActions.setValue>;
