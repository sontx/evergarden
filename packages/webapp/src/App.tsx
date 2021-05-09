import React from 'react';
import {Button, IntlProvider as RSIntlProvider} from 'rsuite';
import locales from './locales';
import 'rsuite/dist/styles/rsuite-default.css';
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import {IntlProvider} from "react-intl";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Button>Click me</Button>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/about">
              about
            </Route>
            <Route path="/users">
              users
            </Route>
            <Route path="/">
              home
            </Route>
            <Route path="*">
              no match
            </Route>
          </Switch>
        </div>
      </Router>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
