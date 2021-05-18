import { GetChapterDto, IdType } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChapter } from "./chapterAPI";
import { RootState } from "../../app/store";

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
  async (option: {
    storyId: IdType;
    chapterNo: number;
    searchById: boolean;
  }) => {
    return await fetchChapter(
      option.storyId,
      option.chapterNo,
      option.searchById,
    );
  },
);

export const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
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

export const selectChapter = (state: RootState) => state.chapter.chapter;
export const selectStatus = (state: RootState) => state.chapter.status;

export default chapterSlice.reducer;
