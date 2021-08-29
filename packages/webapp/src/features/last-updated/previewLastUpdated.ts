import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetStoryDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { fetchStories } from "../stories/storiesAPI";
import { catchRequestError } from "../../utils/api";
import { RootState } from "../../app/store";

const MAX_STORIES = 10;

interface PreviewLastUpdatedState {
  stories?: GetStoryDto[];
  status: ProcessingStatus;
}

const initialState: PreviewLastUpdatedState = {
  status: "none",
};

const fetchPreviewLastUpdatedStoriesAsync = createAsyncThunk(
  "previewLastUpdated/fetch",
  async (_, { rejectWithValue }) => {
    return await catchRequestError(
      async () => await fetchStories(0, MAX_STORIES, "updated"),
      rejectWithValue,
      true,
    );
  },
);

export const previewLastUpdated = createSlice({
  name: "previewLastUpdated",
  initialState,
  reducers: {},
  extraReducers: {
    [`${fetchPreviewLastUpdatedStoriesAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${fetchPreviewLastUpdatedStoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.stories = payload;
    },
    [`${fetchPreviewLastUpdatedStoriesAsync.rejected}`]: (state) => {
      state.status = "error";
    },
  },
});

export const selectStories = (state: RootState) => state.previewLastUpdated.stories;

export default previewLastUpdated.reducer;
