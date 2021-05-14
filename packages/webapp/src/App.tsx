import React from "react";
import {
  Avatar,
  Container, Content,
  Dropdown,
  Header,
  Icon,
  IntlProvider as RSIntlProvider,
  Nav,
  Navbar
} from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import {FormattedMessage, IntlProvider} from "react-intl";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Auth} from "./features/auth/Auth";

import logo from "./images/logo.png";
import {UserToolbar} from "./features/auth/UserToolbar";

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
              <Header>
                <Navbar appearance="subtle">
                  <Navbar.Header style={{display: "flex", alignItems: "center"}}>
                    <Avatar style={{ margin: "8px" }} src={logo} />
                    <h4>Evergarden</h4>
                  </Navbar.Header>
                  <Navbar.Body>
                    <UserToolbar/>
                  </Navbar.Body>
                </Navbar>
              </Header>
              <Content style={{padding: "10px"}}>
                this is content
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
