import React from "react";
import { IntlProvider as RSIntlProvider } from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Story } from "./pages/Story";
import { Reading } from "./pages/Reading";
import { Login } from "./pages/Login";
import { ErrorPage } from "./pages/ErrorPage";
import { Following } from "./pages/Following";
import { History } from "./pages/History";
import { AuthRequired } from "./components/AuthRequired";
import { StoryEditorPage } from "./pages/StoryEditor";
import { UserStoriesPage } from "./pages/UserStories";
import { UserChaptersPage } from "./pages/UserChapters";
import { ChapterEditorPage } from "./pages/ChapterEditor";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./app/store";
import { ErrorHandler } from "./components/ErrorHandler";
import { ThemeProvider } from "./ThemeProvider";
import { FullScreenLoader } from "./components/FullScreenLoader";
import { withGlobalFullScreenLoader } from "./components/FullScreenLoader/withGlobalFullScreenLoader";

import "./index.less";
import "./styles/dark/index.less";
import "./styles/light/index.less";

const GlobalLoader = withGlobalFullScreenLoader(FullScreenLoader);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en" messages={locales.en}>
        <RSIntlProvider locale={enGB}>
          <ThemeProvider>
            <Router>
              <ErrorHandler>
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
                  <Route>
                    <ErrorPage code={404} />
                  </Route>
                </Switch>
                <GlobalLoader />
              </ErrorHandler>
            </Router>
          </ThemeProvider>
        </RSIntlProvider>
      </IntlProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
