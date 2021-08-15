import { ProcessingStatus } from "../../utils/types";
import { GetStoryDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStory } from "./storyAPI";
import { AppThunk, RootState } from "../../app/store";
import * as H from "history";
import { setChapter } from "../chapter/chapterSlice";

export interface StoryState {
  status: ProcessingStatus;
  story?: GetStoryDto;
}

const initialState: StoryState = {
  status: "none",
};

export const fetchStoryAsync = createAsyncThunk(
  "story/fetch",
  async (idOrSlug: string, thunkAPI) => {
    return await fetchStory(idOrSlug);
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
  },
});

export const { resetStory, setStory } = storySlice.actions;

export const selectStory = (state: RootState) => state.story.story;
export const selectStatus = (state: RootState) => state.story.status;

export const openReading =
  (
    history: H.History<unknown>,
    story: GetStoryDto,
    chapterNo: number,
  ): AppThunk =>
  (dispatch, getState) => {
    const current = getState().story.story;
    if (current !== story) {
      dispatch(setStory(story));
    }
    dispatch(setChapter(undefined));
    history.push(`/reading/${story.url}/${isFinite(chapterNo) ? (chapterNo > 0 ? chapterNo : 1) : 1}`);
  };

export const openStoryByUrl =
  (history: H.History<unknown>, url: string, option?: any): AppThunk =>
  (dispatch, getState) => {
    const current = getState().story.story;
    if (current && current.url === url) {
      return;
    }
    dispatch(resetStory());
    history.push(`/story/${url}`, option);
  };

export const openStory =
  (history: H.History<unknown>, story: GetStoryDto, option?: any): AppThunk =>
  (dispatch, getState) => {
    const current = getState().story.story;
    if (current !== story) {
      dispatch(setStory(story));
    }
    history.push(`/story/${story.url}`, option);
  };

export default storySlice.reducer;
