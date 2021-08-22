import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProcessingStatus } from "../../utils/types";
import { loginOAuth2, logout } from "./authApi";
import { setUser } from "../user/userSlice";
import { catchRequestError } from "../../utils/api";

import { fetchAuthenticatedUser, loginOAuth2, logout, updateFullName, updateAvatar, deleteAvatar } from "./authApi";

export interface LoginState {
  status: ProcessingStatus;
}

const initialState: LoginState = {
  status: "none",
};

export const loginOAuth2Async = createAsyncThunk(
  "auth/loginOAuth2",
  async (data: { token: string; provider: string }, { rejectWithValue, dispatch }) => {
    return catchRequestError(
      async () => {
        const response = await loginOAuth2(data.token, data.provider);
        dispatch(setUser(response));
        return response;
      },
      rejectWithValue,
      true,
    );
  },
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    logout().then();
    dispatch(setUser(undefined));
  },
);

export const updateFullNameAsync = createAsyncThunk(
  "auth/updateFullName",
  async (name: string, { rejectWithValue }) => {
    return catchRequestError(
      async () => await updateFullName(name),
      rejectWithValue,
      true,
    );
  },
);

export const updateAvatarAsync = createAsyncThunk(
  "auth/updateAvatar",
  async (file: File, { rejectWithValue }) => {
    return catchRequestError(async () =>await updateAvatar(file),rejectWithValue, true)
  },
);

export const deleteAvatarAsync = createAsyncThunk(
  "auth/updateAvatar",
  async (_, { rejectWithValue }) => {
    return catchRequestError(async () => await deleteAvatar(),rejectWithValue, true)
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [`${loginOAuth2Async.pending}`]: (state) => {
      state.status = "processing";
    },
    [`${loginOAuth2Async.fulfilled}`]: (state) => {
      state.status = "success";
    },
    [`${loginOAuth2Async.rejected}`]: (state) => {
      state.status = "error";
    },
    [`${updateFullNameAsync.fulfilled}`]: (state, { payload }) => {
      state.user = payload;
      state.status = "success";
    },
    [`${updateFullNameAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${updateAvatarAsync.fulfilled}`]: (state, { payload }) => {
      state.user = payload;
      state.status = "success";
    },
    [`${updateAvatarAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
    [`${deleteAvatarAsync.fulfilled}`]: (state, { payload }) => {
      state.user = payload;
      state.status = "success";
    },
    [`${deleteAvatarAsync.rejected}`]: (state, { payload }) => {
      state.status = "error";
    },
  },
});

export const selectStatus = (state: RootState) => state.login.status;

export default authSlice.reducer;
