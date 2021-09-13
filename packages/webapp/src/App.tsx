import React from "react";
import { IntlProvider as RSIntlProvider } from "rsuite";
import locales from "./locales";
import enGB from "rsuite/lib/IntlProvider/locales/en_GB";
import { IntlProvider } from "react-intl";
import {
  BrowserRouter as Router,
  Route,
  Switch as DesktopSwitch,
} from "react-router-dom";
// @ts-ignore
import { FacebookProvider } from "react-facebook";
import { AuthRequired } from "./components/AuthRequired";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./app/store";
import { ErrorHandler } from "./components/ErrorHandler";
import { ThemeProvider } from "./ThemeProvider";
import { FullScreenLoader } from "./components/FullScreenLoader";
import { AnimatedSwitch } from "./components/AnimatedSwitch";
import { withGlobalFullScreenLoader } from "./components/FullScreenLoader/withGlobalFullScreenLoader";

import "./index.less";
import "./styles/dark/index.less";
import "./styles/light/index.less";
import { isMobileOnly } from "react-device-detect";
import { routes } from "./routes";

const GlobalLoader = withGlobalFullScreenLoader(FullScreenLoader);
const Switch = isMobileOnly ? AnimatedSwitch : DesktopSwitch;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en" messages={locales.en}>
        <RSIntlProvider locale={enGB}>
          <ThemeProvider>
            <FacebookProvider appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}>
              <Router>
                <ErrorHandler>
                  <Switch>
                    {routes.map(
                      ({ Component, authRequired, path, exact }, index) => (
                        <Route key={index} path={path} exact={exact}>
                          {authRequired ? (
                            <AuthRequired>
                              <Component />
                            </AuthRequired>
                          ) : (
                            <Component />
                          )}
                        </Route>
                      ),
                    )}
                  </Switch>
                  <GlobalLoader />
                </ErrorHandler>
              </Router>
            </FacebookProvider>
          </ThemeProvider>
        </RSIntlProvider>
      </IntlProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
