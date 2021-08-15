import { createAsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  GetReadingHistoryDto,
  UpdateReadingHistoryDto,
} from "@evergarden/shared";
import { fetchReadingHistories, updateStoryHistory } from "./historiesAPI";

export interface HistoriesState {
  histories: GetReadingHistoryDto[];
}

const initialState: HistoriesState = {
  histories: [],
};

export const updateStoryHistoryAsync = createAsyncThunk(
  "histories/update",
  async (history: UpdateReadingHistoryDto) => {
    updateStoryHistory(history).then();
    return history;
  },
);

export const fetchReadingHistoriesAsync = createAsyncThunk(
  "histories/fetch",
  async () => {
    return await fetchReadingHistories();
  },
);

function setStoryHistory(
  state: Draft<HistoriesState>,
  readingHistory: GetReadingHistoryDto,
) {
  if (readingHistory) {
    if (state.histories.find((item) => item.storyId === readingHistory.storyId)) {
      state.histories = state.histories.map((item) =>
        item.storyId !== readingHistory.storyId ? item : { ...item, ...readingHistory },
      );
    } else {
      state.histories.push(readingHistory);
    }
  }
}

export const historiesSlice = createSlice({
  name: "histories",
  initialState,
  reducers: {
    setHistories: (state, action) => {
      state.histories = action.payload || [];
    },
    setHistory: (state, action) => {
      const updatedHistory = action.payload;
      setStoryHistory(state, updatedHistory);
    },
  },
  extraReducers: {
    [`${updateStoryHistoryAsync.fulfilled}`]: (state, { payload }) => {
      setStoryHistory(state, payload);
    },
    [`${fetchReadingHistoriesAsync.fulfilled}`]: (state, { payload }) => {
      state.histories = payload || [];
    },
  },
});

export const { setHistories, setHistory } = historiesSlice.actions;

export const selectHistories = (state: RootState) => state.histories.histories;

export default historiesSlice.reducer;
