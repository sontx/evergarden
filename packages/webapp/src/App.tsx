import React from 'react';
import {Button, IntlProvider as RSIntlProvider} from 'rsuite';
import locales from './locales';
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import {IntlProvider} from "react-intl";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Login} from "./features/login/Login";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <Router>
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="*">
            no match
          </Route>
        </Switch>
      </Router>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
