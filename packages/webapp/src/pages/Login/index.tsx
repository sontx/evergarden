import { LoginPanel } from "../../features/login/LoginPanel";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppFooter } from "../../components/AppFooter";
import { Redirect } from "react-router-dom";
import { useIsLoggedIn } from "../../features/user/hooks/useIsLoggedIn";

export function Login() {
  const intl = useIntl();
  const { isLoggedIn } = useIsLoggedIn();
  return !isLoggedIn ? (
    <>
      <SEO title={intl.formatMessage({ id: "pageTitleLogin" })} />
      <LoginPanel />
      <AppFooter float />
    </>
  ) : (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  );
}
