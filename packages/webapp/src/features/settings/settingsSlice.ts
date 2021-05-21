import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ReactNode } from "react";
import {
  GetUserSettingsDto,
  SizeType,
  UpdateUserSettingsDto,
} from "@evergarden/shared";
import { updateSettings } from "./settingsAPI";
import { ProcessingStatus } from "../../utils/types";

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
  return (FONTS.find((font) => font.value.name === name) || FONTS[0]).value;
}

export interface SettingsSliceState {
  fixedHeader: boolean;
  currentNavTab: "updated" | "hot" | "following" | "collection";
  limitCountPerPage: number;
  readingFont: string;
  readingFontSize: SizeType;
  readingLineSpacing: SizeType;
  status: ProcessingStatus;
}

const initialState: SettingsSliceState = {
  fixedHeader: true,
  currentNavTab: "updated",
  limitCountPerPage: 10,
  readingFont: "Roboto",
  readingFontSize: "M",
  readingLineSpacing: "M",
  status: "none",
};

export const updateSettingsAsync = createAsyncThunk(
  "settings/update",
  async (settings: UpdateUserSettingsDto) => {
    await updateSettings(settings);
    return settings;
  },
);

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
    setUserSettings: (state, { payload }) => {
      const settings = payload || ({} as GetUserSettingsDto);
      state.readingFont = settings.readingFont || initialState.readingFont;
      state.readingFontSize =
        settings.readingFontSize || initialState.readingFontSize;
      state.readingLineSpacing =
        settings.readingLineSpacing || initialState.readingLineSpacing;
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
  extraReducers: {
    [`${updateSettingsAsync.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${updateSettingsAsync.fulfilled}`]: (state, { payload }) => {
      state.status = "success";
    },
    [`${updateSettingsAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
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
  setUserSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
