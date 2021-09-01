import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface NewStoriesState {
  showFullNewStories?: boolean;
}

const initialState: NewStoriesState = {};

export const newStoriesSlice = createSlice({
  name: "newStories",
  initialState,
  reducers: {
    setShowFullNewStories: (state, { payload }) => {
      state.showFullNewStories = payload;
    },
  },
});

export const { setShowFullNewStories } = newStoriesSlice.actions;

export const selectShowFullNewStories = (state: RootState) =>
  state.newStories.showFullNewStories;

export default newStoriesSlice.reducer;
