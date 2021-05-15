import React from "react";
import {Container, Content, IntlProvider as RSIntlProvider} from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import {IntlProvider} from "react-intl";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Auth} from "./features/auth/Auth";
import {AppHeader} from "./components/AppHeader";
import {Home} from "./pages/Home";

const App = () => (
  <IntlProvider locale="en" messages={locales.en}>
    <RSIntlProvider locale={enGB}>
      <Router>
        <Switch>
          <Route path="/login">
            <Auth />
          </Route>
          <Route path="/">
            <Container>
              <AppHeader />
              <Content style={{ padding: "10px" }}>
                <Home/>
              </Content>
            </Container>
          </Route>
          <Route path="*">no match</Route>
        </Switch>
      </Router>
    </RSIntlProvider>
  </IntlProvider>
);

export default App;
