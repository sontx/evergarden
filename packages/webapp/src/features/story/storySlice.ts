import { ProcessingStatus } from "../../utils/types";
import { GetStoryDto, IdType } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStory, fetchStoryByUrl } from "./storyAPI";
import { AppThunk, RootState } from "../../app/store";
import * as H from 'history';

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
    setStory: (state, { payload }) => {
      state.story = payload;
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

export const { resetStory, setStory } = storySlice.actions;

export const selectStory = (state: RootState) => state.story.story;
export const selectStatus = (state: RootState) => state.story.status;

export const openReading = (
  history: H.History<unknown>,
  story: GetStoryDto,
  chapterNo: number,
): AppThunk => (dispatch) => {
  dispatch(setStory(story));
  history.push(`/reading/${story.url}/${chapterNo}`);
};

export const openStory = (
  history: H.History<unknown>,
  story: GetStoryDto,
  option?: any,
): AppThunk => (dispatch, getState, extraArgument) => {
  dispatch(setStory(story));
  console.log(extraArgument);
  history.push(`/story/${story.url}`, option);
};

export default storySlice.reducer;
