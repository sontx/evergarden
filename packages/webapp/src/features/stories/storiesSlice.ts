import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { GetStoryDto, StoryCategory } from "@evergarden/shared";

interface LastUpdatedStoriesState {
  stories: GetStoryDto[];
  totalItems: number;
  category: StoryCategory;
}

const initialState: LastUpdatedStoriesState = {
  stories: [],
  totalItems: 0,
  category: "updated",
};

export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setStories: (state, { payload }) => {
      state.stories = payload || [];
    },
    setCategory: (state, { payload }) => {
      state.category = payload || "updated";
      state.stories = [];
    },
    setTotalItems: (state, { payload }) => {
      state.totalItems = payload || 0;
    },
  },
  extraReducers: {},
});

export const { setCategory, setTotalItems, setStories } = storiesSlice.actions;

export const selectStories = (state: RootState) => state.stories.stories;
export const selectTotalItems = (state: RootState) => state.stories.totalItems;
export const selectCategory = (state: RootState) => state.stories.category;

export default storiesSlice.reducer;
