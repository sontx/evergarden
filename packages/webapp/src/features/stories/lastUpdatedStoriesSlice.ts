import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLastUpdatedStories } from "./storiesAPI";
import { RootState } from "../../app/store";
import { initialState } from "./interfaces";

export const fetchLastUpdatedStoriesAsync = createAsyncThunk(
  "last-updated-stories/fetch",
  async (option: { page: number; limit: number }) => {
    return await fetchLastUpdatedStories(option.page, option.limit);
  },
);

export const lastUpdatedStoriesSlice = createSlice({
  name: "last-updated-stories",
  initialState,
  reducers: {
    gotoPage: (state, { payload }) => {
      if (payload >= 0 && payload < state.totalPages) {
        state.currentPage = payload;
      }
    },
    nextPage: (state) => {
      if (state.currentPage < state.totalPages - 1) {
        state.currentPage++;
      }
    },
    backPage: (state) => {
      if (state.currentPage > 0) {
        state.currentPage--;
      }
    },
  },
  extraReducers: {
    [`${fetchLastUpdatedStoriesAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchLastUpdatedStoriesAsync.fulfilled}`]: (state, { payload }) => {
      const data = payload;
      state.currentPage = data.meta.currentPage;
      state.totalPages = data.meta.totalPages;
      state.totalItems = data.meta.totalItems;
      state.stories =
        state.currentPage === 0 ? data.items : state.stories.concat(data.items);
      state.status = "success";
    },
    [`${fetchLastUpdatedStoriesAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const selectStories = (state: RootState) =>
  state.lastUpdatedStories.stories;
export const selectCurrentPage = (state: RootState) =>
  state.lastUpdatedStories.currentPage;
export const selectTotalItems = (state: RootState) =>
  state.lastUpdatedStories.totalItems;
export const selectStatus = (state: RootState) =>
  state.lastUpdatedStories.status;

export const { gotoPage, nextPage, backPage } = lastUpdatedStoriesSlice.actions;

export default lastUpdatedStoriesSlice.reducer;
