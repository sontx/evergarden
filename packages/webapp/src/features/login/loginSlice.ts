import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import * as ls from "local-storage";
import {RootState} from "../../app/store";
import {loginWithGoogle, logout} from "./loginApi";

export interface LoginState {
  status: "none" | "logging" | "success" | "failed";
  loginType: "none" | "userpass" | "google" | "facebook";
  loginError?: string;
}

const initialState: LoginState = {
  status: "none",
  loginType: "none",
};

export const loginGoogleAsync = createAsyncThunk("login/google", async () => {
  await logout();
  return await loginWithGoogle();
});

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginGoogleAsync.pending, (state) => {
      state.loginError = undefined;
      state.status = "logging";
      state.loginType = "google";
    });
    builder.addCase(loginGoogleAsync.fulfilled, (state, action) => {
      const response = action.payload;
      if (response) {
        if (response && response.success) {
          state.status = "success";
          ls.set("currentUser", response.user);
        } else {
          state.status = "failed";
          state.loginError = response.error?.message;
        }
      } else {
        state.status = "none";
      }

      state.loginType = "none";
    });
  },
});

export const selectStatus = (state: RootState) => state.login.status;
export const selectLoginType = (state: RootState) => state.login.loginType;
export const selectLoginError = (state: RootState) => state.login.loginError;

export default loginSlice.reducer;
