import { GetChapterDto, IdType } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChapters } from "./chaptersAPI";
import {RootState} from "../../app/store";

export interface ChaptersState {
  chapters: GetChapterDto[];
  status: ProcessingStatus;
  errorMessage?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const initialState: ChaptersState = {
  chapters: [],
  status: "none",
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
};

export const fetchChaptersAsync = createAsyncThunk(
  "chapters/fetch",
  async (option: { storyId: IdType; page: number; limit: number }) => {
    return await fetchChapters(option.storyId, option.page, option.limit);
  },
);

export const chaptersSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    resetChapters: state => {
      state.chapters = [];
      state.currentPage = 0;
    }
  },
  extraReducers: {
    [`${fetchChaptersAsync.pending}`]: (state, action) => {
      state.errorMessage = undefined;
      state.status = "processing";
    },
    [`${fetchChaptersAsync.fulfilled}`]: (state, { payload }) => {
      const data = payload;
      state.currentPage = data.meta.currentPage;
      state.totalPages = data.meta.totalPages;
      state.totalItems = data.meta.totalItems;
      state.chapters = data.items;
      state.status = "success";
    },
    [`${fetchChaptersAsync.rejected}`]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.status = "error";
    },
  },
});

export const {resetChapters} = chaptersSlice.actions;

export const selectChapters = (state: RootState) => state.chapters.chapters;
export const selectCurrentPage = (state: RootState) => state.chapters.currentPage;
export const selectTotalItems = (state: RootState) => state.chapters.totalItems;
export const selectStatus = (state: RootState) => state.chapters.status;
export const selectTotalPage = (state: RootState) => state.chapters.totalPages;
export const selectErrorMessage = (state: RootState) => state.chapters.errorMessage;

export default chaptersSlice.reducer;
