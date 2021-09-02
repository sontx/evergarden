import React, { useEffect } from "react";
import { IntlProvider as RSIntlProvider } from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Story } from "./pages/Story";
import { Reading } from "./pages/Reading";
import { Login } from "./pages/Login";
import { AuthSync } from "./features/auth/AuthSync";
import { HttpError } from "./components/HttpError";
import { ErrorPage } from "./pages/ErrorPage";
import { Following } from "./pages/Following";
import { History } from "./pages/History";
import { AuthRequired } from "./components/AuthRequired";
import { StoryEditorPage } from "./pages/StoryEditor";
import { UserStoriesPage } from "./pages/UserStories";
import { UserChaptersPage } from "./pages/UserChapters";
import { ChapterEditorPage } from "./pages/ChapterEditor";
import { HistoriesSync } from "./features/histories/HistoriesSync";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./app/store";

import "./index.less";
import "./styles/dark/index.less";

import "./styles/light/index.less";
import { useAppSelector } from "./app/hooks";
import { selectIsDarkMode } from "./features/global/globalSlice";
import { ThemeManager } from "./utils/theme-manager/theme-manager";

export default function App() {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  useEffect(() => {
    ThemeManager.defaultInstance.setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en" messages={locales.en}>
        <RSIntlProvider locale={enGB}>
          <AuthSync>
            <HistoriesSync>
              <Router>
                <HttpError />
                <Switch>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                  <Route exact path="/story/:url">
                    <Story />
                  </Route>
                  <Route exact path="/reading/:url/:chapterNo">
                    <Reading />
                  </Route>
                  <Route exact path="/following">
                    <AuthRequired>
                      <Following />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/history">
                    <AuthRequired>
                      <History />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/user/story">
                    <AuthRequired>
                      <UserStoriesPage />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/user/story/new">
                    <AuthRequired>
                      <StoryEditorPage />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/user/story/:url">
                    <AuthRequired>
                      <StoryEditorPage />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/user/story/:url/chapter">
                    <AuthRequired>
                      <UserChaptersPage />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/user/story/:url/chapter/new">
                    <AuthRequired>
                      <ChapterEditorPage />
                    </AuthRequired>
                  </Route>
                  <Route exact path="/user/story/:url/chapter/:chapterNo">
                    <AuthRequired>
                      <ChapterEditorPage />
                    </AuthRequired>
                  </Route>
                  <Route path="/500">
                    <ErrorPage code="500" />
                  </Route>
                  <Route>
                    <ErrorPage code="404" />
                  </Route>
                </Switch>
              </Router>
            </HistoriesSync>
          </AuthSync>
        </RSIntlProvider>
      </IntlProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
