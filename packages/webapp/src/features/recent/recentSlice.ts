import { GetStoryDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchRecentStories } from "./recentAPI";

export interface FollowingState {
  stories: GetStoryDto[];
  status: ProcessingStatus;
  errorMessage?: string;
}

const initialState: FollowingState = {
  stories: [],
  status: "none",
};

export const fetchRecentStoriesAsync = createAsyncThunk(
  "recent/fetch",
  async () => {
    return await fetchRecentStories();
  },
);

export const recentSlice = createSlice({
  name: "recent",
  initialState,
  reducers: {},
  extraReducers: {
    [`${fetchRecentStoriesAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchRecentStoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.stories = payload || [];
      state.status = "success";
    },
    [`${fetchRecentStoriesAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const selectStatus = (state: RootState) => state.recentStories.status;
export const selectStories = (state: RootState) => state.recentStories.stories;
export const selectErrorMessage = (state: RootState) =>
  state.recentStories.errorMessage;

export default recentSlice.reducer;
