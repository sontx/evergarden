import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ReactNode } from "react";

interface Font {
  family: string;
  name: string;
}

export const FONTS: { value: Font; label: ReactNode }[] = [
  {
    label: "Roboto",
    value: {
      family: "Roboto",
      name: "Roboto",
    },
  },
  {
    label: "Noto",
    value: {
      family: '"Noto Serif", serif',
      name: "Noto+Serif",
    },
  },
  {
    label: "Quicksand",
    value: {
      family: '"Quicksand", serif',
      name: "Quicksand",
    },
  },
  {
    label: "Asap",
    value: {
      family: '"Asap", serif',
      name: "Asap",
    },
  },
  {
    label: "Farsan",
    value: {
      family: '"Farsan", serif',
      name: "Farsan",
    },
  },
  {
    label: "Open Sans",
    value: {
      family: '"Open Sans", serif',
      name: "Open+Sans",
    },
  },
  {
    label: "Cabin",
    value: {
      family: '"Cabin Condensed", serif',
      name: "Cabin+Condensed",
    },
  },
  {
    label: "Lora",
    value: {
      family: '"Lora", serif',
      name: "Lora",
    },
  },
];

export function getFont(name: string): Font {
  return (FONTS.find(font => font.value.name === name) || FONTS[0]).value;
}

export interface SettingsSliceState {
  fixedHeader: boolean;
  currentNavTab: "updated" | "hot" | "following" | "collection";
  limitCountPerPage: number;
  readingFont: string;
  readingFontSize: "S" | "M" | "L" | "XL";
  readingLineSpacing: "S" | "M" | "L" | "XL";
}

const initialState: SettingsSliceState = {
  fixedHeader: true,
  currentNavTab: "updated",
  limitCountPerPage: 10,
  readingFont: "Roboto",
  readingFontSize: "M",
  readingLineSpacing: "M",
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
    setReadingFontSize: (state, { payload }) => {
      state.readingFontSize = payload;
    },
    setReadingLineSpacing: (state, { payload }) => {
      state.readingLineSpacing = payload;
    },
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
  setReadingLineSpacing,
} = settingsSlice.actions;

export default settingsSlice.reducer;
