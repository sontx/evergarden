import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist/es/constants";
import { createFilter } from "redux-persist-transform-filter";
import globalReducer from "../features/global/globalSlice";
import storyReducer from "../features/story/storySlice";
import chaptersReducer from "../features/chapters/chaptersSlice";
import chapterReducer from "../features/chapter/chapterSlice";
import followingReducer from "../features/following/followingSlice";
import searchReducer from "../features/search/searchSlice";
import storyEditorReducer from "../features/story-editor/storyEditorSlice";
import chapterEditorReducer from "../features/chapter-editor/chapterEditorSlice";
import authorsReducer from "../features/authors/authorsSlice";
import genresReducer from "../features/genres/genresSlice";
import userStoriesReducer from "../features/user-stories/userStoriesSlice";
import userReducer from "../features/user/userSlice";
import lastUpdatedReducer from "../features/last-updated/lastUpdatedSlice";
import hotStoriesReducer from "../features/hot-stories/hotStoriesSlice";
import topViewsReducer from "../features/top-views/topViewsSlice";
import newStoriesReducer from "../features/new-stories/newStoriesSlice";

import { QueryClient } from "react-query";

const reducers = combineReducers({
  counter: counterReducer,
  user: userReducer,
  followingStories: followingReducer,
  story: storyReducer,
  chapters: chaptersReducer,
  chapter: chapterReducer,
  login: authReducer,
  global: globalReducer,
  search: searchReducer,
  storyEditor: storyEditorReducer,
  chapterEditor: chapterEditorReducer,
  authors: authorsReducer,
  genres: genresReducer,
  userStories: userStoriesReducer,
  topViews: topViewsReducer,
  lastUpdated: lastUpdatedReducer,
  hotStories: hotStoriesReducer,
  newStories: newStoriesReducer,
});

const saveGlobalFilter = createFilter("global", ["isDarkMode"]);

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage,
  debug: process.env.NODE_ENV === "development",
  whitelist: ["global", "user"],
  transforms: [saveGlobalFilter],
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
export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
