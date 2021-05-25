import {
  GetStoryHistoryDto,
  IdType,
  UpdateStoryHistoryDto,
} from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { updateStoryHistory } from "./historyAPI";

export interface HistoryState {
  history?: GetStoryHistoryDto & {
    keepLocalReadingPosition?: boolean;
    storyId: IdType;
  };
}

const initialState: HistoryState = {};

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

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistory: (state, { payload }) => {
      if (
        payload &&
        state.history &&
        state.history.keepLocalReadingPosition &&
        state.history.currentChapterNo === payload.currentChapterNo
      ) {
        state.history = {
          ...payload,
          currentReadingPosition: state.history.currentReadingPosition,
        };
      } else {
        state.history = payload;
      }
    },
    setReadingPosition: (state, { payload }) => {
      state.history = {
        ...(state.history || {}),
        currentReadingPosition: payload,
        keepLocalReadingPosition: true
      } as any;
    },
    setCurrentChapterNo: (state, { payload }) => {
      state.history = {
        ...(state.history || {}),
        currentChapterNo: payload,
      } as any;
    },
  },
  extraReducers: {},
});

export const {
  setCurrentChapterNo,
  setHistory,
  setReadingPosition,
} = historySlice.actions;

export const selectHistory = (state: RootState) => state.history.history;

export default historySlice.reducer;
