import React from "react";
import { Container, Content, Icon, IntlProvider as RSIntlProvider, Nav } from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import { FormattedMessage, IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth } from "./features/auth/Auth";
import { LastUpdatedStories } from "./features/last-updated-stories/LastUpdatedStories";
import { AppHeader } from "./components/AppHeader";
import ResponsiveNav from "@rsuite/responsive-nav";

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
                <ResponsiveNav appearance="subtle" activeKey="updated">
                  <ResponsiveNav.Item eventKey="updated" icon={<Icon icon="creative" />}>
                    <FormattedMessage id="homeNavUpdated" />
                  </ResponsiveNav.Item>
                  <ResponsiveNav.Item eventKey="hot" icon={<Icon icon="trend" />}>
                    <FormattedMessage id="homeNavHot" />
                  </ResponsiveNav.Item>
                  <ResponsiveNav.Item eventKey="following" icon={<Icon icon="star" />}>
                    <FormattedMessage id="userMenuFollowing" />
                  </ResponsiveNav.Item>
                  <ResponsiveNav.Item eventKey="collection" icon={<Icon icon="th-list" />}>
                    <FormattedMessage id="homeNavCollection" />
                  </ResponsiveNav.Item>
                </ResponsiveNav>
                <LastUpdatedStories />
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
