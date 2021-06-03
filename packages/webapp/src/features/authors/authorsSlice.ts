import { GetAuthorDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { RootState } from "../../app/store";
import { searchAuthor } from "./authorsAPI";

interface AuthorsState {
  authors: GetAuthorDto[];
  status: ProcessingStatus;
}

const initialState: AuthorsState = {
  status: "none",
  authors: [],
};

export const searchAuthorAsync = createAsyncThunk(
  "authors/search",
  async (name: string) => {
    return await searchAuthor(name);
  },
);

export const authorsSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: {
    [`${searchAuthorAsync.pending}`]: (state) => {
      state.status = "processing";
      state.authors = [];
    },
    [`${searchAuthorAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.authors = payload || [];
    },
    [`${searchAuthorAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
  },
});

export const selectAuthors = (state: RootState) => state.authors.authors;
export const selectStatus = (state: RootState) => state.authors.status;

export default authorsSlice.reducer;
