import {
  CreateStoryDto,
  GetStoryDto,
  IdType,
  UpdateStoryDto,
} from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { createStory, updateStory } from "./storyEditorAPI";
import { RootState } from "../../app/store";
import { fetchStoryByUrl } from "../story/storyAPI";

interface StoryEditorState {
  story?: GetStoryDto;
  status: ProcessingStatus;
  fetchingStatus: ProcessingStatus;
}

const initialState: StoryEditorState = {
  status: "none",
  fetchingStatus: "none",
};

export const fetchUserStoryAsync = createAsyncThunk(
  "storyEditor/fetch",
  async (url: string) => {
    return await fetchStoryByUrl(url);
  },
);

export const createStoryAsync = createAsyncThunk(
  "storyEditor/create",
  async (story: CreateStoryDto) => {
    return await createStory(story);
  },
);

export const updateStoryAsync = createAsyncThunk(
  "storyEditor/update",
  async ({ story, id }: { id: IdType; story: UpdateStoryDto }) => {
    return await updateStory(id, story);
  },
);

export const storyEditorSlice = createSlice({
  name: "storyEditor",
  initialState,
  reducers: {
    setStory: (state, { payload }) => {
      state.story = payload;
    },
  },
  extraReducers: {
    [`${createStoryAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${createStoryAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.story = payload;
    },
    [`${createStoryAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${updateStoryAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${updateStoryAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.story = payload;
    },
    [`${updateStoryAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${fetchUserStoryAsync.pending}`]: (state) => {
      state.fetchingStatus = "processing";
    },
    [`${fetchUserStoryAsync.fulfilled}`]: (state, { payload }) => {
      state.fetchingStatus = "success";
      state.story = payload;
    },
    [`${fetchUserStoryAsync.rejected}`]: (state, { payload }) => {
      state.fetchingStatus = "error";
    },
  },
});

export const { setStory } = storyEditorSlice.actions;

export const selectStory = (state: RootState) => state.storyEditor.story;
export const selectStatus = (state: RootState) => state.storyEditor.status;

export default storyEditorSlice.reducer;