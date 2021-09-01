import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface TopViewsState {
  type: "today" | "week" | "month" | "year";
  showFullTopViewStories?: boolean;
}

const initialState: TopViewsState = {
  type: "today"
}

export const topViewsSlice = createSlice({
  name: "topViews",
  initialState,
  reducers: {
    setType: (state, {payload}) => {
      state.type = payload;
    },
    setShowFullTopViewStories: (state, {payload}) => {
      state.showFullTopViewStories = payload;
    }
  }
})

export const {setType, setShowFullTopViewStories} = topViewsSlice.actions;

export const selectType = (state: RootState) => state.topViews.type;
export const selectShowFullTopViewStories = (state: RootState) => state.topViews.showFullTopViewStories;

export default topViewsSlice.reducer;
