import { GetChapterDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChapter } from "./chapterAPI";
import { RootState } from "../../app/store";
import { catchRequestError, RequestError } from "../../utils/api";

let cachedNextChapter: GetChapterDto;

export interface ChapterState {
  chapter?: GetChapterDto;
  status: ProcessingStatus;
  errorMessage?: RequestError;
}

const initialState: ChapterState = {
  status: "none",
};

export const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {

  },
});


export const selectChapter = (state: RootState) => state.chapter.chapter;
export const selectStatus = (state: RootState) => state.chapter.status;
export const selectErrorMessage = (state: RootState) =>
  state.chapter.errorMessage;

export default chapterSlice.reducer;
