import {
  AuthUser,
  UpdateUserDto,
  UpdateUserSettingsDto,
} from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAuthenticatedUser } from "../auth/authApi";
import { AppThunk, RootState } from "../../app/store";
import { catchRequestError } from "../../utils/api";
import {
  deleteAvatar,
  updateAvatar,
  updateUser,
  updateUserSettings,
} from "./userAPI";

interface UserState {
  user?: AuthUser;
  fetchingStatus: ProcessingStatus;
  updateStatus: ProcessingStatus;
  updateAvatarStatus: ProcessingStatus;
  deleteAvatarStatus: ProcessingStatus;
}

const initialState: UserState = {
  fetchingStatus: "none",
  updateStatus: "none",
  updateAvatarStatus: "none",
  deleteAvatarStatus: "none",
};

export const fetchUserAsync = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue }) => {
    return catchRequestError(
      async () => await fetchAuthenticatedUser(),
      rejectWithValue,
      true,
    );
  },
);

export const updateAvatarAsync = createAsyncThunk(
  "user/updateAvatar",
  async (file: File, { rejectWithValue }) => {
    return catchRequestError(
      async () => await updateAvatar(file),
      rejectWithValue,
      true,
    );
  },
);

export const deleteAvatarAsync = createAsyncThunk(
  "user/deleteAvatar",
  async (_, { rejectWithValue }) => {
    return catchRequestError(
      async () => await deleteAvatar,
      rejectWithValue,
      true,
    );
  },
);

export const updateUserAsync = createAsyncThunk(
  "user/update",
  async (user: UpdateUserDto, { rejectWithValue }) => {
    return catchRequestError(
      async () => await updateUser(user),
      rejectWithValue,
      true,
    );
  },
);

export const updateUserSettingsAsync = createAsyncThunk(
  "user/updateSettings",
  async (settings: UpdateUserSettingsDto, { rejectWithValue }) => {
    return catchRequestError(
      async () => await updateUserSettings(settings),
      rejectWithValue,
      true,
    );
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
      state.fetchingStatus = "none";
    },
  },
  extraReducers: {
    [`${fetchUserAsync.pending}`]: (state) => {
      state.fetchingStatus = "processing";
    },
    [`${fetchUserAsync.fulfilled}`]: (state, { payload }) => {
      state.user = payload;
      state.fetchingStatus = "success";
    },
    [`${fetchUserAsync.rejected}`]: (state) => {
      state.user = undefined;
      state.fetchingStatus = "error";
    },

    [`${updateAvatarAsync.pending}`]: (state) => {
      state.updateAvatarStatus = "processing";
    },
    [`${updateAvatarAsync.fulfilled}`]: (state, { payload }) => {
      state.user = { ...(state.user || {}), ...(payload || {}) };
      state.updateAvatarStatus = "success";
    },
    [`${updateAvatarAsync.rejected}`]: (state) => {
      state.updateAvatarStatus = "error";
    },

    [`${deleteAvatarAsync.pending}`]: (state) => {
      state.deleteAvatarStatus = "processing";
    },
    [`${deleteAvatarAsync.fulfilled}`]: (state, { payload }) => {
      state.user = { ...(state.user || {}), ...(payload || {}) };
      state.deleteAvatarStatus = "success";
    },
    [`${deleteAvatarAsync.rejected}`]: (state) => {
      state.deleteAvatarStatus = "error";
    },

    [`${updateUserAsync.pending}`]: (state) => {
      state.updateStatus = "processing";
    },
    [`${updateUserAsync.fulfilled}`]: (state, { payload }) => {
      state.user = { ...(state.user || {}), ...(payload || {}) };
      state.updateStatus = "success";
    },
    [`${updateUserAsync.rejected}`]: (state) => {
      state.updateStatus = "error";
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectFetchingStatus = (state: RootState) =>
  state.user.fetchingStatus;
export const selectUpdateStatus = (state: RootState) => state.user.updateStatus;
export const selectUpdateAvatarStatus = (state: RootState) =>
  state.user.updateAvatarStatus;
export const selectDeleteAvatarStatus = (state: RootState) =>
  state.user.deleteAvatarStatus;
export const selectIsLoggedIn = (state: RootState) => !!state.user.user;
export const selectUserSettings = (state: RootState) =>
  state.user.user?.settings;

export const setUserSettings = (
  settings: Partial<UpdateUserSettingsDto>,
): AppThunk => (dispatch, getState) => {
  const user = getState().user.user;
  if (user) {
    const newSettings = {
      ...(user.settings || {}),
      ...settings,
    };
    dispatch(
      setUser({
        ...user,
        settings: newSettings,
      }),
    );
    dispatch(updateUserSettingsAsync(newSettings));
  }
};

export default userSlice.reducer;
