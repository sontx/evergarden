import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SettingsSliceState {
  fixedHeader: boolean;
}

const initialState: SettingsSliceState = {
  fixedHeader: true,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setFixedHeader: (state, { payload }) => {
      state.fixedHeader = payload;
    },
  },
});

export const selectFixedHeader = (state: RootState) => state.settings.fixedHeader;

export const { setFixedHeader } = settingsSlice.actions;

export default settingsSlice.reducer;
