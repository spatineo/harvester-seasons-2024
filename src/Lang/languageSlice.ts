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
		changeLanguage: (state, action) => {},
	},
});

export default languageSlice.reducer;
