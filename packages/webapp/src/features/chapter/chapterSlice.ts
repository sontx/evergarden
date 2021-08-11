import { GetChapterDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChapter } from "./chapterAPI";
import { RootState } from "../../app/store";

let cachedNextChapter: GetChapterDto;

export interface ChapterState {
  chapter?: GetChapterDto;
  status: ProcessingStatus;
  errorMessage?: string;
}

const initialState: ChapterState = {
  status: "none",
};

export const fetchChapterAsync = createAsyncThunk(
  "chapter/fetch",
  async (
    { storyId, chapterNo }: { storyId: number; chapterNo: number },
    thunkAPI,
  ) => {
    if (cachedNextChapter) {
      if (
        cachedNextChapter.storyId === storyId &&
        cachedNextChapter.chapterNo == chapterNo
      ) {
        return cachedNextChapter;
      }
    }
    return await fetchChapter(storyId, chapterNo);
  },
);

export const fetchNextChapterAsync = createAsyncThunk(
  "chapter/fetchNext",
  async (option: { storyId: number; chapterNo: number }) => {
    cachedNextChapter = await fetchChapter(option.storyId, option.chapterNo);
  },
);

export const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    setChapter: (state, { payload }) => {
      state.chapter = payload;
      if (!payload) {
        state.status = "none";
      }
    },
  },
  extraReducers: {
    [`${fetchChapterAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchChapterAsync.fulfilled}`]: (state, { payload }) => {
      state.chapter = payload;
      state.status = "success";
    },
    [`${fetchChapterAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const { setChapter } = chapterSlice.actions;

export const selectChapter = (state: RootState) => state.chapter.chapter;
export const selectStatus = (state: RootState) => state.chapter.status;

export default chapterSlice.reducer;
