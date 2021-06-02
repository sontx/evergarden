import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthUser } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { fetchAuthenticatedUser, loginOAuth2, logout } from "./authApi";

export interface LoginState {
  status: ProcessingStatus;
  loginError?: string;
  user?: AuthUser;
}

const initialState: LoginState = {
  status: "none",
};

export const loginOAuth2Async = createAsyncThunk(
  "auth/loginOAuth2",
  async (data: { token: string; provider: string }) => {
    return await loginOAuth2(data.token, data.provider);
  },
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await logout();
  window.location.reload();
});

export const fetchAuthenticatedUserAsync = createAsyncThunk(
  "auth/fetch",
  async () => {
    return await fetchAuthenticatedUser();
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [`${loginOAuth2Async.pending}`]: (state) => {
      state.loginError = undefined;
      state.status = "processing";
    },
    [`${loginOAuth2Async.fulfilled}`]: (state, { payload }) => {
      if (payload) {
        state.status = "success";
        state.user = payload;
      } else {
        state.status = "none";
      }
    },
    [`${loginOAuth2Async.rejected}`]: (state, { payload }) => {
      state.status = "error";
      state.loginError = payload;
    },
    [`${logoutAsync.fulfilled}`]: (state) => {
      state.user = undefined;
      state.status = "none";
    },
    [`${logoutAsync.rejected}`]: (state) => {
      state.user = undefined;
      state.status = "none";
    },
    [`${fetchAuthenticatedUserAsync.fulfilled}`]: (state, { payload }) => {
      state.user = payload;
    },
    [`${fetchAuthenticatedUserAsync.rejected}`]: (state, { payload }) => {
      state.user = undefined;
    },
  },
});

export const selectStatus = (state: RootState) => state.login.status;
export const selectLoginError = (state: RootState) => state.login.loginError;
export const selectUser = (state: RootState) => state.login.user;
export const selectIsLoggedIn = (state: RootState) => !!state.login.user;

export default authSlice.reducer;
