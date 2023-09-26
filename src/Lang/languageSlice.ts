import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LanguageOptions {
  lang: string;
}

const initialState: LanguageOptions = {
  lang: "en"
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    }
  }
});

export const actions = { ...languageSlice.actions };
export default languageSlice.reducer;
export type ReduxActions = ReturnType<typeof actions.changeLanguage>;
