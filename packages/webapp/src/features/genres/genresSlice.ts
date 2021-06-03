import { GetGenreDto } from "@evergarden/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProcessingStatus } from "../../utils/types";
import { RootState } from "../../app/store";
import { fetchAllGenres } from "./genresAPI";

interface GenresState {
  genres?: GetGenreDto[];
  status: ProcessingStatus;
}

const initialState: GenresState = {
  status: "none",
};

export const fetchAllGenresAsync = createAsyncThunk(
  "genres/fetch",
  async () => {
    return await fetchAllGenres();
  },
);

export const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {},
  extraReducers: {
    [`${fetchAllGenresAsync.pending}`]: (state) => {
      state.status = "processing";
      state.genres = undefined;
    },
    [`${fetchAllGenresAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
      state.genres = payload || [];
    },
    [`${fetchAllGenresAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
      state.genres = [];
    },
  },
});

export const selectGenres = (state: RootState) => state.genres.genres;
export const selectStatus = (state: RootState) => state.genres.status;

export default genresSlice.reducer;
