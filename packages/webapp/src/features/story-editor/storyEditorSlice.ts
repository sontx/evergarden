import {
  CreateStoryDto,
  GetStoryDto,
  UpdateStoryDto,
} from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { createStory, updateStory, uploadThumbnail } from "./storyEditorAPI";
import { RootState } from "../../app/store";
import { fetchStory } from "../story/storyAPI";

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
  async ({story, uploadFile} : {story: CreateStoryDto, uploadFile?: File | null}) => {
    const newStory =  await createStory(story);
    if (uploadFile) {
      const uploadedFile = await uploadThumbnail(newStory.id, uploadFile);
      return await updateStory(newStory.id, {
        thumbnail: uploadedFile.thumbnail,
        cover: uploadedFile.cover
      });
    }
    return newStory;
  },
);

export const updateStoryAsync = createAsyncThunk(
  "storyEditor/update",
  async ({ story, id, uploadFile }: { id: number; story: UpdateStoryDto, uploadFile?: File | null }) => {
    if (uploadFile) {
      const uploadedFile = await uploadThumbnail(id, uploadFile);
      return await updateStory(id, {
        ...story,
        thumbnail: uploadedFile.thumbnail,
        cover: uploadedFile.cover
      });
    } if (uploadFile === null) {
      return await updateStory(id, {
        ...story,
        thumbnail: "",
        cover: ""
      });
    } else {
      return await updateStory(id, story);
    }
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
