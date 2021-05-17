import { ProcessingStatus } from "../../utils/types";
import { GetStoryDto, IdType } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStory, fetchStoryByUrl } from "./storyAPI";
import { RootState } from "../../app/store";

export interface StoryState {
  status: ProcessingStatus;
  story?: GetStoryDto;
}

const initialState: StoryState = {
  status: "none",
};

export const fetchStoryAsync = createAsyncThunk(
  "story/fetch",
  async (id: IdType) => {
    return await fetchStory(id);
  },
);

export const fetchStoryByUrlAsync = createAsyncThunk(
  "story/fetchByUrl",
  async (url: string) => {
    return await fetchStoryByUrl(url);
  },
);

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    resetStory: (state) => {
      state.story = undefined;
    },
  },
  extraReducers: {
    [`${fetchStoryAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${fetchStoryAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.story = payload;
    },
    [`${fetchStoryAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${fetchStoryByUrlAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${fetchStoryByUrlAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.story = payload;
    },
    [`${fetchStoryByUrlAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
  },
});

export const { resetStory } = storySlice.actions;

export const selectStory = (state: RootState) => state.story.story;
export const selectStatus = (state: RootState) => state.story.status;

export default storySlice.reducer;
