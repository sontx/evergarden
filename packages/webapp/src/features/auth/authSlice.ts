import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {loginWithGoogle, logout} from "./authApi";
import {AuthUser} from "@evergarden/common";

export interface LoginState {
  status: "none" | "logging" | "success" | "failed";
  loginType: "none" | "userpass" | "google" | "facebook";
  loginError?: string;
  user?: AuthUser;
}

const initialState: LoginState = {
  status: "none",
  loginType: "none",
};

export const loginGoogleAsync = createAsyncThunk("auth/google", async () => {
  return await loginWithGoogle();
});

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await logout();
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [`${loginGoogleAsync.pending}`]: (state, { payload }) => {
      state.loginError = undefined;
      state.status = "logging";
      state.loginType = "google";
    },
    [`${loginGoogleAsync.fulfilled}`]: (state, { payload }) => {
      if (payload) {
        state.status = "success";
        state.user = payload;
      } else {
        state.status = "none";
      }
      state.loginType = "none";
    },
    [`${loginGoogleAsync.rejected}`]: (state, { payload }) => {
      state.status = "failed";
      state.loginError = payload;
      state.loginType = "none";
    },
  }
});

export const selectStatus = (state: RootState) => state.login.status;
export const selectLoginType = (state: RootState) => state.login.loginType;
export const selectLoginError = (state: RootState) => state.login.loginError;

export default authSlice.reducer;
