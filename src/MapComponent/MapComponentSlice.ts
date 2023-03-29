import { createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Map {
  mapOptions: {
    center: [number, number];
    resolution: number;
    rotation: number;
  }
}

const initialState: Map = {
 mapOptions: {
    center: [0, 0],
    resolution: 3550,
    rotation: 0
  }
}

const mapComponentSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<[number, number]>) => {
      state.mapOptions.center = action.payload
    }
  }
})

export const { setLocation } = mapComponentSlice.actions
export default mapComponentSlice.reducer