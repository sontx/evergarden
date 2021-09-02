import {
  CreateStoryDto,
  GetStoryDto,
  UpdateStoryDto,
} from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import {
  createStory,
  deleteStoryCover,
  updateStory,
  updateStoryCover,
} from "./storyEditorAPI";
import { RootState } from "../../app/store";
import { fetchStory } from "../story/storyAPI";
import { catchRequestError } from "../../utils/api";

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
    return await fetchStory(url);
  },
);

export const createStoryAsync = createAsyncThunk(
  "storyEditor/create",
  async (
    { story, uploadFile }: { story: CreateStoryDto; uploadFile?: File | null },
    { rejectWithValue },
  ) => {
    return catchRequestError(
      async () => {
        const newStory = await createStory(story);
        if (uploadFile) {
          return await updateStoryCover(newStory.id, uploadFile);
        }
        return newStory;
      },
      rejectWithValue,
      true,
    );
  },
);

export const updateStoryAsync = createAsyncThunk(
  "storyEditor/update",
  async (
    {
      story,
      id,
      uploadFile,
    }: {
      id: number;
      story: UpdateStoryDto;
      uploadFile?: File | null;
    },
    { rejectWithValue },
  ) => {
    return catchRequestError(
      async () => {
        const updatedStory = await updateStory(id, story);
        if (uploadFile) {
          return await updateStoryCover(id, uploadFile);
        } else if (uploadFile === null) {
          return await deleteStoryCover(id);
        } else {
          return updatedStory;
        }
      },
      rejectWithValue,
      true,
    );
  },
);

export const storyEditorSlice = createSlice({
  name: "storyEditor",
  initialState,
  reducers: {
    setStory: (state, { payload }) => {
      state.story = payload;
      if (!payload) {
        state.status = "none";
        state.fetchingStatus = "none";
      }
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
export const selectFetchingStatus = (state: RootState) =>
  state.storyEditor.fetchingStatus;

export default storyEditorSlice.reducer;
