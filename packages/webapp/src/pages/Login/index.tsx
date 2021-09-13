import { LoginPanel } from "../../features/login/LoginPanel";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppFooter } from "../../components/AppFooter";
import { Redirect, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "../../features/user/hooks/useIsLoggedIn";

const NOT_SUPPORTED_REDIRECT_ROUTES = [
  "/login"
];

export function Login() {
  const intl = useIntl();
  const { isLoggedIn } = useIsLoggedIn();
  const location = useLocation<{prevPathName: string}>();
  const prevPath: string = location.state?.prevPathName || "/";
  const redirectPath =
    NOT_SUPPORTED_REDIRECT_ROUTES.findIndex((route) =>
      prevPath.startsWith(route),
    ) >= 0
      ? "/"
      : prevPath;

  return !isLoggedIn ? (
    <>
      <SEO title={intl.formatMessage({ id: "pageTitleLogin" })} />
      <LoginPanel />
      <AppFooter float />
    </>
  ) : (
    <Redirect
      to={{
        pathname: redirectPath,
      }}
    />
  );
}
