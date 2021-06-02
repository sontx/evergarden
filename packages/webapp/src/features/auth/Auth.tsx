import { Alert, Button, Icon, Panel } from "rsuite";
import { FormattedMessage, useIntl } from "react-intl";

import "./auth.less";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginGoogleAsync,
  selectLoginError,
  selectLoginType,
  selectStatus,
  selectUser,
} from "./authSlice";
import { useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { setUserSettings } from "../settings/settingsSlice";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

function isGoogleLoginResponse(
  response: GoogleLoginResponse | GoogleLoginResponseOffline,
): response is GoogleLoginResponse {
  return !!(response as any).accessToken;
}

export function Auth() {
  const intl = useIntl();

  const status = useAppSelector(selectStatus);
  const loginType = useAppSelector(selectLoginType);
  const loginError = useAppSelector(selectLoginError);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleLoginGoogleSuccess = useCallback(
    (data: GoogleLoginResponse | GoogleLoginResponseOffline) => {
      if (isGoogleLoginResponse(data)) {
        dispatch(loginGoogleAsync(data.tokenId));
      }
    },
    [dispatch],
  );

  const handleLoginGoogleFailure = useCallback((error) => {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
      Alert.error(error.detail, 5000);
    }
  }, []);

  useEffect(() => {
    if (status === "error") {
      Alert.error(
        loginError || intl.formatMessage({ id: "loginFailedMessage" }),
        5000,
      );
    } else if (status === "success") {
      if (user) {
        dispatch(setUserSettings(user.settings));
        const prevPath =
          (location.state && (location.state as any).prevPathName) || "/";
        history.push(prevPath === "/login" ? "/" : prevPath);
      }
    }
  }, [dispatch, history, intl, loginError, status, user, location]);

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
            <span className="sub">
              <FormattedMessage id="loginSlogan" />
            </span>
          </div>
        }
      >
        <div className="button-container">
          <Button
            disabled={status === "processing"}
            loading={loginType === "facebook" && status === "processing"}
            color="blue"
            block
          >
            <Icon icon="facebook" /> <FormattedMessage id="loginWithFacebook" />
          </Button>
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <Button
                disabled={renderProps.disabled}
                loading={loginType === "google" && status === "processing"}
                color="red"
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
