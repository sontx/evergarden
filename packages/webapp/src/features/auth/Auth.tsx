import { Alert, Button, Icon, Panel } from "rsuite";
import { FormattedMessage, useIntl } from "react-intl";
// @ts-ignore
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import "./auth.less";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginOAuth2Async,
  selectLoginError,
  selectStatus,
  selectUser,
} from "./authSlice";
import { useCallback, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { setUserSettings } from "../settings/settingsSlice";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

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

export function Auth() {
  const intl = useIntl();

  const status = useAppSelector(selectStatus);
  const loginError = useAppSelector(selectLoginError);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleLoginGoogleSuccess = useCallback(
    (data: GoogleLoginResponse | GoogleLoginResponseOffline) => {
      if (isGoogleLoginResponse(data)) {
        dispatch(loginOAuth2Async({ token: data.tokenId, provider: "google" }));
      }
    },
    [dispatch],
  );

  const handleLoginGoogleFailure = useCallback((error) => {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
      Alert.error(error.details, 5000);
    }
  }, []);

  const handleLoginFacebook = useCallback(
    (data) => {
      if (data.accessToken) {
        dispatch(
          loginOAuth2Async({ token: data.accessToken, provider: "facebook" }),
        );
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (status === "error") {
      Alert.error(
        loginError || intl.formatMessage({ id: "loginFailedMessage" }),
        5000,
      );
    } else if (status === "success") {
      if (user) {
        dispatch(setUserSettings(user.settings));
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
    }
  }, [dispatch, history, intl, loginError, status, user, location]);

  const isFacebookApp = useMemo(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return (
      ua.indexOf("FBAN") > -1 ||
      ua.indexOf("FBAV") > -1 ||
      ua.indexOf("Instagram") > -1
    );
  }, []);

  return (
    <div className="login-container">
      <Panel
        className="panel"
        style={isMobile ? { border: "unset" } : {}}
        bordered
        header={
          <div className="title">
            <h3>
              <FormattedMessage id="loginWelcome" />
            </h3>
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
                loading={renderProps.isProcessing}
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
