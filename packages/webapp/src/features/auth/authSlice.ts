import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { loginWithGoogle, logout } from "./authApi";
import { AuthUser } from "@evergarden/shared";
import {ProcessingStatus} from "../../utils/types";

export interface LoginState {
  status: ProcessingStatus;
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
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [`${loginGoogleAsync.pending}`]: (state) => {
      state.loginError = undefined;
      state.status = "processing";
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
      state.status = "error";
      state.loginError = payload;
      state.loginType = "none";
    },
    [`${logoutAsync.fulfilled}`]: (state) => {
      state.user = undefined;
      state.status = "none";
    },
  },
});

export const selectStatus = (state: RootState) => state.login.status;
export const selectLoginType = (state: RootState) => state.login.loginType;
export const selectLoginError = (state: RootState) => state.login.loginError;
export const selectUser = (state: RootState) => state.login.user;

export default authSlice.reducer;
