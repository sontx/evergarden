import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SettingsSliceState {
  fixedHeader: boolean;
  currentNavTab: "updated" | "hot" | "following" | "collection";
  limitCountPerPage: number;
}

const initialState: SettingsSliceState = {
  fixedHeader: true,
  currentNavTab: "updated",
  limitCountPerPage: 10
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
  },
});

export const selectFixedHeader = (state: RootState) => state.settings.fixedHeader;
export const selectCurrentTab = (state: RootState) => state.settings.currentNavTab;
export const selectLimitCountPerPage = (state: RootState) => state.settings.limitCountPerPage;

export const { setFixedHeader, setCurrentTab } = settingsSlice.actions;

export default settingsSlice.reducer;
