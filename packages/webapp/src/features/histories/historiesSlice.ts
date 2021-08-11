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
  story: GetReadingHistoryDto,
) {
  if (story) {
    if (state.histories.find((item) => item.storyId === story.id)) {
      state.histories = state.histories.map((item) =>
        item.storyId !== story.storyId ? item : { ...item, ...story },
      );
    } else {
      state.histories.push(story);
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

export const { setHistories } = historiesSlice.actions;

export const selectHistories = (state: RootState) => state.histories.histories;

export default historiesSlice.reducer;
