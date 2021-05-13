import React from "react";
import { IntlProvider as RSIntlProvider } from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth } from "./features/auth/Auth";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <Router>
        <Switch>
          <Route path="/login">
            <Auth/>
          </Route>
          <Route path="*">no match</Route>
        </Switch>
      </Router>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
