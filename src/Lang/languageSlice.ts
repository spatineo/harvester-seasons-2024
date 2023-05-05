import { createSlice } from '@reduxjs/toolkit';

export interface LanguageOptions {
	en: string;
}

const initialState: LanguageOptions = {
	en: 'en',
};

const languageSlice = createSlice({
	name: 'language',
	initialState,
	reducers: {
		changeLanguage: (state, action) => {
			console.log(state, action.payload);
		},
	},
});

export default languageSlice.reducer;
