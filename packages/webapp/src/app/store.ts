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
import settingsReducer from "../features/settings/settingsSlice";
import storyReducer from "../features/story/storySlice";
import storiesReducer from "../features/stories/storiesSlice";
import chaptersReducer from "../features/chapters/chaptersSlice";
import chapterReducer from "../features/chapter/chapterSlice";
import historyReducer from "../features/history/historySlice";
import followingReducer from "../features/following/followingSlice";
import recentReducer from "../features/recent/recentSlice";
import searchReducer from "../features/search/searchSlice";
import storyEditorReducer from "../features/story-editor/storyEditorSlice";
import authorsReducer from "../features/authors/authorsSlice";
import genresReducer from "../features/genres/genresSlice";

const reducers = combineReducers({
  counter: counterReducer,
  followingStories: followingReducer,
  recentStories: recentReducer,
  story: storyReducer,
  stories: storiesReducer,
  chapters: chaptersReducer,
  chapter: chapterReducer,
  login: authReducer,
  settings: settingsReducer,
  history: historyReducer,
  search: searchReducer,
  storyEditor: storyEditorReducer,
  authors: authorsReducer,
  genres: genresReducer
});

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage,
  debug: process.env.NODE_ENV === "development",
  blacklist: [
    "stories",
    "chapters",
    "chapter",
    "history",
    "story",
    "search",
    "storyEditor",
    "authors"
  ],
  migrate: (state: any) => {
    state = state || {};
    if (state.login) {
      state.login.status = "none";
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
export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
