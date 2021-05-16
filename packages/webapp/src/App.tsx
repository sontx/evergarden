import React from "react";
import { IntlProvider as RSIntlProvider } from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth } from "./features/auth/Auth";
import { Home } from "./pages/Home";
import { Story } from "./pages/Story";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <Router>
        <Switch>
          <Route path="/login">
            <Auth />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/story/:url">
            <Story />
          </Route>
        </Switch>
      </Router>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
