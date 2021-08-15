import { GetStoryDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchStoriesByIds } from "../stories/storiesAPI";

export interface FollowingState {
  stories: GetStoryDto[];
  status: ProcessingStatus;
  errorMessage?: string;
  showingAction?: GetStoryDto;
}

const initialState: FollowingState = {
  stories: [],
  status: "none",
};

export const fetchFollowingStoriesAsync = createAsyncThunk(
  "following/fetch",
  async (ids: number[]) => {
    if (ids && ids.length > 0) {
      return await fetchStoriesByIds(ids);
    }
    return [];
  },
);

export const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    setShowingAction: (state, { payload }) => {
      state.showingAction = payload;
    },
    removeStory: (state, { payload }) => {
      if (payload) {
        state.stories = state.stories.filter(
          (story) => story.id !== payload.id,
        );
      }
    },
    setFollowingStories: (state, action) => {
      state.stories = action.payload;
    }
  },
  extraReducers: {
    [`${fetchFollowingStoriesAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchFollowingStoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.stories = payload || [];
      state.status = "success";
    },
    [`${fetchFollowingStoriesAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const { setShowingAction, removeStory, setFollowingStories } = followingSlice.actions;

export const selectStatus = (state: RootState) => state.followingStories.status;
export const selectStories = (state: RootState) =>
  state.followingStories.stories;
export const selectErrorMessage = (state: RootState) =>
  state.followingStories.errorMessage;
export const selectShowingAction = (state: RootState) =>
  state.followingStories.showingAction;

export default followingSlice.reducer;
