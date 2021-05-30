import { StorySearchBody } from "@evergarden/shared";
import { ProcessingStatus, trimText } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchStories } from "./searchAPI";
import { RootState } from "../../app/store";

interface SearchState {
  stories: StorySearchBody[];
  status: ProcessingStatus;
}

const initialState: SearchState = {
  stories: [],
  status: "none",
};

export const searchStoriesAsync = createAsyncThunk(
  "search/search",
  async (text: string) => {
    const searchText = trimText(text);
    return searchText ? await searchStories(text) : [];
  },
);

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clear: (state) => {
      state.status = "none";
      state.stories = [];
    },
  },
  extraReducers: {
    [`${searchStoriesAsync.pending}`]: (state, action) => {
      state.status = "processing";
    },
    [`${searchStoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.stories = payload || [];
      state.status = "success";
    },
    [`${searchStoriesAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
  },
});

export const { clear } = searchSlice.actions;

export const selectStories = (state: RootState) => state.search.stories;
export const selectStatus = (state: RootState) => state.search.status;

export default searchSlice.reducer;
