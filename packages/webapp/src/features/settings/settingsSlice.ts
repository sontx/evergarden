import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SettingsSliceState {
  isFloatingHeader: boolean;
  currentNavTab: "updated" | "hot" | "following" | "collection";
  showSearchBox?: boolean;
  showMenu?: boolean;
}

const initialState: SettingsSliceState = {
  isFloatingHeader: false,
  currentNavTab: "updated",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setFloatingHeader: (state, { payload }) => {
      state.isFloatingHeader = payload;
    },
    setShowMenu: (state, {payload}) => {
      state.showMenu = payload;
    },
    setShowSearchBox: (state, { payload }) => {
      state.showSearchBox = !!payload;
    },
    setCurrentTab: (state, { payload }) => {
      state.currentNavTab = payload;
    },
  },
});

export const selectIsFloatingHeader = (state: RootState) =>
  state.settings.isFloatingHeader;
export const selectShowSearchBox = (state: RootState) =>
  state.settings.showSearchBox;
export const selectShowMenu = (state: RootState) =>
  state.settings.showMenu;
export const selectCurrentTab = (state: RootState) =>
  state.settings.currentNavTab;

export const {
  setFloatingHeader,
  setShowSearchBox,
  setShowMenu,
  setCurrentTab,
} = settingsSlice.actions;

export default settingsSlice.reducer;
