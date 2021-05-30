import { ProcessingStatus } from "../../utils/types";
import { GetStoryDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStoryByUrl } from "./storyAPI";
import { AppThunk, RootState } from "../../app/store";
import * as H from "history";
import { setChapter } from "../chapter/chapterSlice";
import { setHistory } from "../history/historySlice";

export interface StoryState {
  status: ProcessingStatus;
  story?: GetStoryDto;
}

const initialState: StoryState = {
  status: "none",
};

function extractHistory(story: GetStoryDto) {
  return story ? { ...(story.history || {}), storyId: story.id } : undefined;
}

export const fetchStoryByUrlAsync = createAsyncThunk(
  "story/fetchByUrl",
  async (url: string, thunkAPI) => {
    const story = await fetchStoryByUrl(url);
    thunkAPI.dispatch(setHistory(extractHistory(story)));
    return story;
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
): AppThunk => (dispatch, getState) => {
  const current = getState().story.story;
  if (current !== story) {
    dispatch(setStory(story));
    dispatch(setHistory(extractHistory(story)));
  }
  dispatch(setChapter(undefined));
  history.push(`/reading/${story.url}/${chapterNo}`);
};

export const openStoryByUrl = (
  history: H.History<unknown>,
  url: string,
  option?: any,
): AppThunk => (dispatch, getState) => {
  const current = getState().story.story;
  if (current && current.url === url) {
    return;
  }
  dispatch(resetStory());
  dispatch(setHistory(null));
  history.push(`/story/${url}`, option);
};

export const openStory = (
  history: H.History<unknown>,
  story: GetStoryDto,
  option?: any,
): AppThunk => (dispatch, getState) => {
  const current = getState().story.story;
  if (current !== story) {
    dispatch(setStory(story));
    dispatch(setHistory(extractHistory(story)));
  }
  history.push(`/story/${story.url}`, option);
};

export default storySlice.reducer;
