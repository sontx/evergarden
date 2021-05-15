import { Action, configureStore, getDefaultMiddleware, ThunkAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist/es/constants";
import lastUpdatedStoriesReducer from "../features/stories/lastUpdatedStoriesSlice";
import hotStoriesReducer from "../features/stories/hotStoriesSlice";
import settingsReducer from "../features/settings/settingsSlice";

const reducers = combineReducers({
  counter: counterReducer,
  lastUpdatedStories: lastUpdatedStoriesReducer,
  hotStories: hotStoriesReducer,
  login: authReducer,
  settings: settingsReducer,
});

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage,
  debug: process.env.NODE_ENV === "development",
  migrate: (state: any) => {
    state = state || {};
    if (state.lastUpdatedStories) {
      state.lastUpdatedStories.status = "none";
    }
    return Promise.resolve(state);
  },
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
