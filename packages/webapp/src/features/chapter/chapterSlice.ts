import { GetChapterDto, CreateReportChapterDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChapter, reportBugChapter } from "./chapterAPI";
import { RootState } from "../../app/store";
import { catchRequestError, RequestError } from "../../utils/api";

let cachedNextChapter: GetChapterDto;

export interface ChapterState {
  chapter?: GetChapterDto;
  status: ProcessingStatus;
  statusReport: ProcessingStatus;
  errorMessage?: RequestError;
}

const initialState: ChapterState = {
  status: "none",
  statusReport: "none",
};

export const fetchChapterAsync = createAsyncThunk(
  "chapter/fetch",
  async (
    { storyId, chapterNo }: { storyId: number; chapterNo: number },
    { rejectWithValue },
  ) => {
    return catchRequestError(async () => {
      if (cachedNextChapter) {
        if (
          cachedNextChapter.storyId === storyId &&
          cachedNextChapter.chapterNo == chapterNo
        ) {
          return cachedNextChapter;
        }
      }
      return await fetchChapter(storyId, chapterNo);
    }, rejectWithValue);
  },
);

export const fetchNextChapterAsync = createAsyncThunk(
  "chapter/fetchNext",
  async (option: { storyId: number; chapterNo: number }) => {
    cachedNextChapter = await fetchChapter(option.storyId, option.chapterNo);
  },
);

export const reportChapterAsync = createAsyncThunk(
  "chapter/report",
  async (
    {
      chapterId,
      report,
    }: {
      chapterId: number;
      report: CreateReportChapterDto;
    },
    { rejectWithValue },
  ) => {
    return catchRequestError(
      async () => await reportBugChapter(chapterId, report),
      rejectWithValue,
      true,
    );
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
      state.errorMessage = payload;
      state.status = "error";
    },
    [`${reportChapterAsync.pending}`]: (state) => {
      state.statusReport = "processing";
    },
    [`${reportChapterAsync.fulfilled}`]: (state) => {
      state.statusReport = "success";
    },
    [`${reportChapterAsync.rejected}`]: (state) => {
      state.statusReport = "error";
    },
  },
});

export const { setChapter } = chapterSlice.actions;

export const selectChapter = (state: RootState) => state.chapter.chapter;
export const selectStatus = (state: RootState) => state.chapter.status;
export const selectStatusReport = (state: RootState) =>
  state.chapter.statusReport;
export const selectErrorMessage = (state: RootState) =>
  state.chapter.errorMessage;

export default chapterSlice.reducer;
