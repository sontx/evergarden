import { Alert, Button, Icon, Panel } from "rsuite";
import { FormattedMessage } from "react-intl";
// @ts-ignore
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useCallback, useEffect, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useOAuthFacebook } from "../hooks/useOAuthFacebook";
import { useOAuthGoogle } from "../hooks/useOAuthGoogle";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const FACEBOOK_CLIENT_ID = process.env.REACT_APP_FACEBOOK_CLIENT_ID || "";

const NOT_SUPPORTED_REDIRECT_ROUTES = [
  "/login",
  "/following",
  "/history",
  "/user/story",
];

function isGoogleLoginResponse(
  response: GoogleLoginResponse | GoogleLoginResponseOffline,
): response is GoogleLoginResponse {
  return !!(response as any).accessToken;
}

export function LoginPanel() {
  const location = useLocation();
  const history = useHistory();

  const {
    mutate: loginGg,
    isSuccess: isLoginGgSuccess,
    isLoading: isLoginingGg,
  } = useOAuthGoogle();
  const {
    mutate: loginFb,
    isSuccess: isLoginFbSuccess,
    isLoading: isLoginingFb,
  } = useOAuthFacebook();

  const handleLoginGoogleSuccess = useCallback(
    (data: GoogleLoginResponse | GoogleLoginResponseOffline) => {
      if (isGoogleLoginResponse(data)) {
        loginGg(data.tokenId);
      }
    },
    [loginGg],
  );

  const handleLoginGoogleFailure = useCallback((error) => {
    if (
      process.env.NODE_ENV === "development" &&
      error !== "popup_closed_by_user"
    ) {
      console.log(error);
      Alert.error(error.details, 5000);
    }
  }, []);

  const handleLoginFacebook = useCallback(
    (data) => {
      if (data.accessToken) {
        loginFb(data.accessToken);
      }
    },
    [loginFb],
  );

  useEffect(() => {
    if (isLoginGgSuccess || isLoginFbSuccess) {
      const prevPath: string =
        (location.state && (location.state as any).prevPathName) || "/";
      const redirectPath =
        NOT_SUPPORTED_REDIRECT_ROUTES.findIndex((route) =>
          prevPath.startsWith(route),
        ) >= 0
          ? "/"
          : prevPath;
      history.push(redirectPath);
    }
  }, [history, isLoginFbSuccess, isLoginGgSuccess, location]);

  const isFacebookApp = useMemo(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return (
      ua.indexOf("FBAN") > -1 ||
      ua.indexOf("FBAV") > -1 ||
      ua.indexOf("Instagram") > -1
    );
  }, []);

  return (
    <div className="login-panel">
      <Panel
        className="panel"
        style={isMobileOnly ? { border: "unset" } : {}}
        bordered
        header={
          <div className="title">
            <Link to={{ pathname: "/" }}>
              <h3>
                <FormattedMessage id="loginWelcome" />
              </h3>
            </Link>
            <span>
              <FormattedMessage id="loginSlogan" />
            </span>
          </div>
        }
      >
        <div className="button-container">
          <FacebookLogin
            appId={FACEBOOK_CLIENT_ID}
            fields="name,email,picture"
            callback={handleLoginFacebook}
            autoLoad={isFacebookApp}
            disableMobileRedirect={!isFacebookApp}
            render={(renderProps: any) => (
              <Button
                onClick={renderProps.onClick}
                disabled={renderProps.isDisabled}
                loading={renderProps.isProcessing || isLoginingFb}
                color="blue"
                size="sm"
                block
              >
                <Icon icon="facebook" />{" "}
                <FormattedMessage id="loginWithFacebook" />
              </Button>
            )}
          />
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <Button
                disabled={renderProps.disabled}
                loading={isLoginingGg}
                color="red"
                size="sm"
                block
                onClick={renderProps.onClick}
              >
                <Icon icon="google-plus" />{" "}
                <FormattedMessage id="loginWithGoogle" />
              </Button>
            )}
            onSuccess={handleLoginGoogleSuccess}
            onFailure={handleLoginGoogleFailure}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </Panel>
    </div>
  );
}