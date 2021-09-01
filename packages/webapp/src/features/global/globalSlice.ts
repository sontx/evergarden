import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface GlobalSliceState {
  isFloatingHeader: boolean;
  isShowingOverlay?: boolean;
}

const initialState: GlobalSliceState = {
  isFloatingHeader: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFloatingHeader: (state, { payload }) => {
      state.isFloatingHeader = payload;
    },
    setIsShowingOverlay: (state, { payload }) => {
      state.isShowingOverlay = payload;
    },
  },
});

export const selectIsFloatingHeader = (state: RootState) =>
  state.global.isFloatingHeader;
export const selectIsShowingOverlay = (state: RootState) =>
  state.global.isShowingOverlay;

export const { setFloatingHeader, setIsShowingOverlay } = globalSlice.actions;

export default globalSlice.reducer;
