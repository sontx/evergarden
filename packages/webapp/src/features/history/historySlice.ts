import {
  GetStoryHistoryDto,
  IdType,
  UpdateStoryHistoryDto,
} from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchStoryHistory, updateStoryHistory } from "./historyAPI";

export interface HistoryState {
  storyHistory?: GetStoryHistoryDto;
  status: ProcessingStatus;
}

const initialState: HistoryState = {
  status: "none",
};

export const updateStoryHistoryAsync = createAsyncThunk(
  "histories/update",
  async (
    {
      history,
      startReading,
    }: { history: UpdateStoryHistoryDto; startReading: boolean },
    thunkAPI,
  ) => {
    const historyId = (thunkAPI.getState() as RootState)?.login?.user
      ?.historyId;
    if (historyId) {
      await updateStoryHistory(historyId, history, startReading);
    }
  },
);

export const fetchStoryHistoryAsync = createAsyncThunk(
  "histories/fetch",
  async ({ storyId, historyId }: { storyId: IdType; historyId: IdType }) => {
    if (historyId) {
      return await fetchStoryHistory(historyId, storyId);
    }
  },
);

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    mergeStoryHistory: (state, { payload }) => {
      const oldHistory = state.storyHistory || {};
      state.storyHistory = { ...oldHistory, ...payload };
    },
  },
  extraReducers: {
    [`${fetchStoryHistoryAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${fetchStoryHistoryAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.storyHistory = payload;
    },
    [`${fetchStoryHistoryAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
  },
});

export const { mergeStoryHistory } = historySlice.actions;

export const selectStoryHistory = (state: RootState) =>
  state.history.storyHistory;
export const selectStatus = (state: RootState) => state.history.status;

export default historySlice.reducer;
