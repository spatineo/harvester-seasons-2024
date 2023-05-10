import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineProp {
	value: any;
}

const initialState: TimelineProp = {
	value: '',
};

const timelineSlice = createSlice({
	name: 'timeline',
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<any>) => {
			console.log(action.payload);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			state.value = action.payload;
		},
	},
});

export const timelineActions = { ...timelineSlice.actions };
export default timelineSlice.reducer;
export type ReduxActions = ReturnType<typeof timelineActions.setValue>;
