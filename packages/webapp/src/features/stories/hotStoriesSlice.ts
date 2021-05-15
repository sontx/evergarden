import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchHotStories} from "./storiesAPI";
import {RootState} from "../../app/store";
import {initialState} from "./interfaces";

export const fetchHotStoriesAsync = createAsyncThunk(
  "hot-stories/fetch",
  async (option: { page: number; limit: number }) => {
    return await fetchHotStories(option.page, option.limit);
  },
);

export const hotStoriesSlice = createSlice({
  name: "hot-stories",
  initialState,
  reducers: {
  },
  extraReducers: {
    [`${fetchHotStoriesAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchHotStoriesAsync.fulfilled}`]: (state, { payload }) => {
      const data = payload;
      state.currentPage = data.meta.currentPage;
      state.totalPages = data.meta.totalPages;
      state.totalItems = data.meta.totalItems;
      state.stories = state.currentPage === 0 ? data.items : state.stories.concat(data.items);
      state.status = "success";
    },
    [`${fetchHotStoriesAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const selectStories = (state: RootState) => state.hotStories.stories;
export const selectCurrentPage = (state: RootState) => state.hotStories.currentPage;
export const selectTotalItems = (state: RootState) => state.hotStories.totalItems;
export const selectStatus = (state: RootState) => state.hotStories.status;

export default hotStoriesSlice.reducer;
