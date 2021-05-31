import { createSlice } from "@reduxjs/toolkit";

interface LastUpdatedStoriesState {}

const initialState: LastUpdatedStoriesState = {};

export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {},
  extraReducers: {},
});

export default storiesSlice.reducer;
