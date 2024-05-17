import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const trackSlice = createSlice({
  name: "trackControl",
  initialState: {cars: []},
  reducers: {

  }
});

const store = configureStore({
  reducer: {Track: trackSlice.reducer}
})

export const trackActions = trackSlice.actions;
export default store;