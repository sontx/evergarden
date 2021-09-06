import { ProcessingStatus } from "../../utils/types";
import { GetStoryDto } from "@evergarden/shared";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { RequestError } from "../../utils/api";

export interface StoryState {
  status: ProcessingStatus;
  story?: GetStoryDto;
  errorMessage?: RequestError;
}

const initialState: StoryState = {
  status: "none",
};

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {},
});

export const selectStory = (state: RootState) => state.story.story;

export default storySlice.reducer;
