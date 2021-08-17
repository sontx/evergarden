import { GetStoryDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { RootState } from "../../app/store";
import { deleteUserStory, fetchUserStories } from "./userStoriesAPI";

interface UserStoriesState {
  stories: GetStoryDto[];
  status: ProcessingStatus;
}

const initialState: UserStoriesState = {
  status: "none",
  stories: [],
};

export const fetchUserStoriesAsync = createAsyncThunk(
  "userStories/fetch",
  async () => {
    return await fetchUserStories();
  },
);

export const deleteUserStoryAsync = createAsyncThunk(
  "userStories/delete",
  async (id: number) => {
    await deleteUserStory(id);
    return id;
  },
);

export const userStoriesSlice = createSlice({
  name: "userStories",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "none";
    },
  },
  extraReducers: {
    [`${fetchUserStoriesAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${fetchUserStoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.stories = payload || [];
    },
    [`${fetchUserStoriesAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${deleteUserStoryAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${deleteUserStoryAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      const deletedId = payload;
      state.stories = (state.stories || []).filter(
        (story) => story.id !== deletedId,
      );
    },
    [`${deleteUserStoryAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
  },
});

export const { resetStatus } = userStoriesSlice.actions;

export const selectStories = (state: RootState) => state.userStories.stories;
export const selectStatus = (state: RootState) => state.userStories.status;

export default userStoriesSlice.reducer;
