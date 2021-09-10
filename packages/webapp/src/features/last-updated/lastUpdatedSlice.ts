import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface LastUpdatedState {
  showFullLastUpdatedStories?: boolean;
}

const initialState: LastUpdatedState = {};

export const lastUpdatedSlice = createSlice({
  name: "lastUpdated",
  initialState,
  reducers: {
    setShowFullLastUpdatedStories: (state, { payload }) => {
      state.showFullLastUpdatedStories = payload;
    },
  },
});

export const { setShowFullLastUpdatedStories } = lastUpdatedSlice.actions;

export const selectShowLastUpdatedStories = (state: RootState) =>
  state.lastUpdated.showFullLastUpdatedStories;

export default lastUpdatedSlice.reducer;
