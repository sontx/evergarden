import { GetStoryDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLastUpdatedStories } from "./lastUpdatedStoriesAPI";
import { RootState } from "../../app/store";

export interface LastUpdatedStoriesState {
  stories: GetStoryDto[];
  status: "none" | "fetching" | "success" | "failed";
  errorMessage?: string;
  currentPage: number;
  limitCount: number;
  totalPages: number;
}

const initialState: LastUpdatedStoriesState = {
  stories: [],
  status: "none",
  currentPage: 0,
  limitCount: 100,
  totalPages: 0,
};

export const fetchLastUpdatedStoriesAsync = createAsyncThunk(
  "last-updated-stories/fetch",
  async (option: {page: number, limit: number}) => {
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
      state.status = "fetching";
    },
    [`${fetchLastUpdatedStoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.stories = payload.items.map((item: any) => {
        if (Math.random() < 0.3) {
          item.isFollowing = true;
        }
        return item;
      });
      state.status = "success";
      state.totalPages = Math.ceil(payload.meta.totalItems / state.limitCount);
    },
    [`${fetchLastUpdatedStoriesAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "failed";
    },
  },
});

export const selectStories = (state: RootState) => state.lastUpdatedStories.stories;
export const selectCurrentPage = (state: RootState) => state.lastUpdatedStories.currentPage;
export const selectLimitCount = (state: RootState) => state.lastUpdatedStories.limitCount;

export const { gotoPage, nextPage, backPage } = lastUpdatedStoriesSlice.actions;

export default lastUpdatedStoriesSlice.reducer;
