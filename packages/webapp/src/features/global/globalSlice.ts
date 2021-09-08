import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface GlobalSliceState {
  isFloatingHeader: boolean;
  isShowingOverlay?: boolean;
  isDarkMode: boolean;
  isShowingFullScreenLoader?: boolean;
}

const initialState: GlobalSliceState = {
  isFloatingHeader: false,
  isDarkMode: true,
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
    setDarkMode: (state, { payload }) => {
      state.isDarkMode = !!payload;
    },
    setShowingFullScreenLoader: (state, { payload }) => {
      state.isShowingFullScreenLoader = !!payload;
    },
  },
});

export const selectIsFloatingHeader = (state: RootState) =>
  state.global.isFloatingHeader;
export const selectIsShowingOverlay = (state: RootState) =>
  state.global.isShowingOverlay;
export const selectIsDarkMode = (state: RootState) => state.global.isDarkMode;
export const selectIsShowingFullScreenLoader = (state: RootState) =>
  state.global.isShowingFullScreenLoader;

export const {
  setFloatingHeader,
  setIsShowingOverlay,
  setDarkMode,
  setShowingFullScreenLoader,
} = globalSlice.actions;

export default globalSlice.reducer;
