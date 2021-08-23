import { Auth } from "../../features/auth/Auth";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppFooter } from "../../components/AppFooter";
import { useAppSelector } from "../../app/hooks";
import { selectIsLoggedIn } from "../../features/user/userSlice";
import { Redirect } from "react-router-dom";

export function Login() {
  const intl = useIntl();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  return !isLoggedIn ? (
    <>
      <SEO title={intl.formatMessage({ id: "pageTitleLogin" })} />
      <Auth />
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
