import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { RootState } from "../../app/store";
import {
  CreateChapterDto,
  GetChapterDto,
  UpdateChapterDto,
} from "@evergarden/shared";
import { createChapter, updateChapter } from "./chapterEditorAPI";
import { fetchChapter } from "../chapter/chapterAPI";
import { catchRequestError } from "../../utils/api";

interface ChapterEditorState {
  chapter?: GetChapterDto;
  status: ProcessingStatus;
  fetchingStatus: ProcessingStatus;
}

const initialState: ChapterEditorState = {
  status: "none",
  fetchingStatus: "none",
};

export const fetchChapterAsync = createAsyncThunk(
  "chapterEditor/fetch",
  async (
    option: { storyId: number; chapterNo: number },
    { rejectWithValue },
  ) => {
    return catchRequestError(
      async () => await fetchChapter(option.storyId, option.chapterNo),
      rejectWithValue,
      true,
    );
  },
);

export const createChapterAsync = createAsyncThunk(
  "chapterEditor/create",
  async (
    {
      chapter,
      storyId,
    }: {
      storyId: number;
      chapter: CreateChapterDto;
    },
    { rejectWithValue },
  ) => {
    return catchRequestError(
      async () => await createChapter(storyId, chapter),
      rejectWithValue,
      true,
    );
  },
);

export const updateChapterAsync = createAsyncThunk(
  "chapterEditor/update",
  async (
    {
      chapter,
      chapterNo,
      storyId,
    }: {
      storyId: number;
      chapterNo: number;
      chapter: UpdateChapterDto;
    },
    { rejectWithValue },
  ) => {
    return catchRequestError(
      async () => await updateChapter(storyId, chapterNo, chapter),
      rejectWithValue,
      true,
    );
  },
);

export const chapterEditorSlice = createSlice({
  name: "chapterEditor",
  initialState,
  reducers: {
    setChapter: (state, { payload }) => {
      state.chapter = payload;
      if (!payload) {
        state.status = "none";
        state.fetchingStatus = "none";
      }
    },
  },
  extraReducers: {
    [`${createChapterAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${createChapterAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.chapter = payload;
    },
    [`${createChapterAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${updateChapterAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${updateChapterAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.chapter = payload;
    },
    [`${updateChapterAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${fetchChapterAsync.pending}`]: (state) => {
      state.fetchingStatus = "processing";
    },
    [`${fetchChapterAsync.fulfilled}`]: (state, { payload }) => {
      state.fetchingStatus = "success";
      state.chapter = payload;
    },
    [`${fetchChapterAsync.rejected}`]: (state, { payload }) => {
      state.fetchingStatus = "error";
    },
  },
});

export const { setChapter } = chapterEditorSlice.actions;

export const selectChapter = (state: RootState) => state.chapterEditor.chapter;
export const selectStatus = (state: RootState) => state.chapterEditor.status;
export const selectFetchingStatus = (state: RootState) =>
  state.chapterEditor.fetchingStatus;

export default chapterEditorSlice.reducer;
