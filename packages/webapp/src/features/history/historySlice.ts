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
    keepLocalFollowing?: boolean;
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
        state.history.currentChapterNo === payload.currentChapterNo
      ) {
        const {
          currentReadingPosition,
          isFollowing,
          keepLocalReadingPosition,
          keepLocalFollowing,
        } = state.history;

        const history = payload ;

        if (keepLocalReadingPosition) {
          history.currentReadingPosition = currentReadingPosition;
        }
        if (keepLocalFollowing) {
          history.isFollowing = isFollowing;
        }

        state.history = history;
        return;
      }

      state.history = payload;
    },
    setReadingPosition: (state, { payload }) => {
      state.history = {
        ...(state.history || {}),
        currentReadingPosition: payload,
        keepLocalReadingPosition: true,
      } as any;
    },
    setCurrentChapterNo: (state, { payload }) => {
      state.history = {
        ...(state.history || {}),
        currentChapterNo: payload,
      } as any;
    },
    setFollowingStory: (state, { payload }) => {
      state.history = {
        ...(state.history || {}),
        isFollowing: !!payload,
        keepLocalFollowing: true,
      } as any;
    },
  },
  extraReducers: {},
});

export const {
  setCurrentChapterNo,
  setHistory,
  setReadingPosition,
  setFollowingStory,
} = historySlice.actions;

export const selectHistory = (state: RootState) => state.history.history;

export default historySlice.reducer;
