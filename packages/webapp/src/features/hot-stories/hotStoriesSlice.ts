import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface LastUpdatedState {
  showFullHotStories?: boolean;
}

const initialState: LastUpdatedState = {};

export const hotStoriesSlice = createSlice({
  name: "hotStories",
  initialState,
  reducers: {
    setShowFullHotStories: (state, { payload }) => {
      state.showFullHotStories = payload;
    },
  },
});

export const { setShowFullHotStories } = hotStoriesSlice.actions;

export const selectShowFullHotStories = (state: RootState) =>
  state.hotStories.showFullHotStories;

export default hotStoriesSlice.reducer;
