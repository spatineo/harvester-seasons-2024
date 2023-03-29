import { configureStore } from "@reduxjs/toolkit";
import languageSlice from '../Lang/languageSlice'
import MapComponentSlice from "../MapComponent/MapComponentSlice";

export const store = configureStore({
  reducer: {
    language: languageSlice,
    mapState: MapComponentSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch