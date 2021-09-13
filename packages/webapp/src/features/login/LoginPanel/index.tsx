import { Alert, Button, Icon, Panel } from "rsuite";
import { FormattedMessage } from "react-intl";
// @ts-ignore
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useOAuthFacebook } from "../hooks/useOAuthFacebook";
import { useOAuthGoogle } from "../hooks/useOAuthGoogle";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const FACEBOOK_CLIENT_ID = process.env.REACT_APP_FACEBOOK_CLIENT_ID || "";

function isGoogleLoginResponse(
  response: GoogleLoginResponse | GoogleLoginResponseOffline,
): response is GoogleLoginResponse {
  return !!(response as any).accessToken;
}

export function LoginPanel() {
  const { mutate: loginGg, isLoading: isLoginingGg } = useOAuthGoogle();
  const { mutate: loginFb, isLoading: isLoginingFb } = useOAuthFacebook();

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
      error?.error !== "popup_closed_by_user"
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
