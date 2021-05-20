import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SettingsSliceState {
  fixedHeader: boolean;
  currentNavTab: "updated" | "hot" | "following" | "collection";
  limitCountPerPage: number;
  readingFont: { name: string; family: string };
  readingFontSize: "S" | "M" | "L" | "XL";
  readingLineSpacing: "S" | "M" | "L" | "XL";
}

const initialState: SettingsSliceState = {
  fixedHeader: true,
  currentNavTab: "updated",
  limitCountPerPage: 10,
  readingFont: { name: "Roboto", family: "Roboto" },
  readingFontSize: "M",
  readingLineSpacing: "M"
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setFixedHeader: (state, { payload }) => {
      state.fixedHeader = payload;
    },
    setCurrentTab: (state, { payload }) => {
      state.currentNavTab = payload;
    },
    setReadingFont: (state, { payload }) => {
      state.readingFont = payload;
    },
    setReadingFontSize: (state, {payload}) => {
      state.readingFontSize = payload;
    },
    setReadingLineSpacing: (state, {payload}) => {
      state.readingLineSpacing = payload;
    }
  },
});

export const selectFixedHeader = (state: RootState) =>
  state.settings.fixedHeader;
export const selectCurrentTab = (state: RootState) =>
  state.settings.currentNavTab;
export const selectLimitCountPerPage = (state: RootState) =>
  state.settings.limitCountPerPage;
export const selectReadingFont = (state: RootState) =>
  state.settings.readingFont;
export const selectReadingFontSize = (state: RootState) =>
  state.settings.readingFontSize;
export const selectReadingLineSpacing = (state: RootState) =>
  state.settings.readingLineSpacing;

export const {
  setFixedHeader,
  setCurrentTab,
  setReadingFont,
  setReadingFontSize,
  setReadingLineSpacing
} = settingsSlice.actions;

export default settingsSlice.reducer;
