import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStories } from "./storiesAPI";
import { RootState } from "../../app/store";
import { GetStoryDto, StoryCategory } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";

interface LastUpdatedStoriesState {
  stories: GetStoryDto[];
  status: ProcessingStatus;
  errorMessage?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  category: StoryCategory;
}

const initialState: LastUpdatedStoriesState = {
  stories: [],
  status: "none",
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  category: "updated",
};

export const fetchStoriesAsync = createAsyncThunk(
  "stories/fetch",
  async (option: { page: number; limit: number; category: StoryCategory }) => {
    return await fetchStories(option.page, option.limit, option.category);
  },
);

export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setCategory: (state, { payload }) => {
      state.category = payload || "updated";
      state.stories = [];
      state.currentPage = 0;
    },
  },
  extraReducers: {
    [`${fetchStoriesAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchStoriesAsync.fulfilled}`]: (state, { payload }) => {
      const data = payload;
      state.currentPage = data.meta.currentPage;
      state.totalPages = data.meta.totalPages;
      state.totalItems = data.meta.totalItems;
      state.stories =
        state.currentPage === 0 ? data.items : state.stories.concat(data.items);
      state.status = "success";
    },
    [`${fetchStoriesAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const { setCategory } = storiesSlice.actions;

export const selectStories = (state: RootState) => state.stories.stories;
export const selectCurrentPage = (state: RootState) =>
  state.stories.currentPage;
export const selectTotalItems = (state: RootState) => state.stories.totalItems;
export const selectStatus = (state: RootState) => state.stories.status;
export const selectCategory = (state: RootState) => state.stories.category;

export default storiesSlice.reducer;
