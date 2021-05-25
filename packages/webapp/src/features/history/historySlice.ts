import { UpdateStoryHistoryDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { updateStoryHistory } from "./historyAPI";

export interface HistoryState {}

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
  reducers: {},
  extraReducers: {},
});

export default historySlice.reducer;
