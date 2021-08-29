import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface TopViewsState {
  type: "all" | "week" | "month" | "year"
}

const initialState: TopViewsState = {
  type: "all"
}

export const topViewsSlice = createSlice({
  name: "topViews",
  initialState,
  reducers: {
    setType: (state, {payload}) => {
      state.type = payload;
    }
  }
})

export const {setType} = topViewsSlice.actions;

export const selectType = (state: RootState) => state.topViews.type;

export default topViewsSlice.reducer;
