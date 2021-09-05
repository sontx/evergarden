import { ProcessingStatus } from "../../utils/types";
import { GetStoryDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStory } from "./storyAPI";
import { RootState } from "../../app/store";
import { catchRequestError, RequestError } from "../../utils/api";

export interface StoryState {
  status: ProcessingStatus;
  story?: GetStoryDto;
  errorMessage?: RequestError;
}

const initialState: StoryState = {
  status: "none",
};

export const fetchStoryAsync = createAsyncThunk(
  "story/fetch",
  async (idOrSlug: string, { rejectWithValue }) => {
    return catchRequestError(
      async () => await fetchStory(idOrSlug),
      rejectWithValue,
    );
  },
);

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {},
});

export const selectStory = (state: RootState) => state.story.story;
export const selectStatus = (state: RootState) => state.story.status;
export const selectErrorMessage = (state: RootState) =>
  state.story.errorMessage;

export default storySlice.reducer;
