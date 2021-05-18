import React from "react";
import {IntlProvider as RSIntlProvider} from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import {IntlProvider} from "react-intl";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Home} from "./pages/Home";
import {Story} from "./pages/Story";
import {Reading} from "./pages/Reading";
import {Login} from "./pages/Login";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/story/:url">
            <Story />
          </Route>
          <Route path="/reading/:url/:chapterNo">
            <Reading />
          </Route>
        </Switch>
      </Router>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
