import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProcessingStatus } from "../../utils/types";
import { loginOAuth2, logout } from "./authApi";
import { setUser } from "../user/userSlice";
import { catchRequestError } from "../../utils/api";


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
  },
});

export const selectStatus = (state: RootState) => state.login.status;

export default authSlice.reducer;
