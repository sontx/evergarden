import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { RootState } from "../../app/store";
import {
  CreateChapterDto,
  GetChapterDto,
  IdType,
  UpdateChapterDto,
} from "@evergarden/shared";
import { createChapter, updateChapter } from "./chapterEditorAPI";
import {fetchChapter} from "../chapter/chapterAPI";

interface ChapterEditorState {
  chapter?: GetChapterDto;
  status: ProcessingStatus;
  fetchingStatus: ProcessingStatus;
}

const initialState: ChapterEditorState = {
  status: "none",
  fetchingStatus: "none"
};

export const fetchChapterAsync = createAsyncThunk(
  "chapterEditor/fetch",
  async (option: { storyId: IdType; chapterNo: number }) => {
    return await fetchChapter(option.storyId, option.chapterNo);
  },
);

export const createChapterAsync = createAsyncThunk(
  "chapterEditor/create",
  async ({
    chapter,
    storyId,
  }: {
    storyId: IdType;
    chapter: CreateChapterDto;
  }) => {
    return await createChapter(storyId, chapter);
  },
);

export const updateChapterAsync = createAsyncThunk(
  "chapterEditor/update",
  async ({
    chapter,
    storyId,
  }: {
    storyId: IdType;
    chapter: UpdateChapterDto;
  }) => {
    return await updateChapter(storyId, chapter);
  },
);

export const chapterEditorSlice = createSlice({
  name: "chapterEditor",
  initialState,
  reducers: {
    setChapter: (state, { payload }) => {
      state.chapter = payload;
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

export default chapterEditorSlice.reducer;
