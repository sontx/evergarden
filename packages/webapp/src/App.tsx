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
import { AuthSync } from "./features/auth/AuthSync";
import { SettingsSync } from "./features/settings/SettingsSync";
import { HttpError } from "./components/HttpError";
import { ErrorPage } from "./pages/ErrorPage";
import { Following } from "./pages/Following";
import { History } from "./pages/History";
import { AuthRequired } from "./components/AuthRequired";
import { StoryEditorPage } from "./pages/StoryEditor";
import { UserStoriesPage } from "./pages/UserStories";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <AuthSync>
        <SettingsSync>
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
              <Route exact path="/user/stories">
                <AuthRequired>
                  <UserStoriesPage />
                </AuthRequired>
              </Route>
              <Route exact path="/user/stories/new">
                <AuthRequired>
                  <StoryEditorPage />
                </AuthRequired>
              </Route>
              <Route exact path="/user/stories/:url">
                <AuthRequired>
                  <StoryEditorPage />
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
        </SettingsSync>
      </AuthSync>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
