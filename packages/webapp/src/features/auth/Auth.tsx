import { Alert, Button, Icon, Panel } from "rsuite";
import { FormattedMessage, useIntl } from "react-intl";

import "./auth.less";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginGoogleAsync, selectLoginError, selectLoginType, selectStatus } from "./authSlice";
import { useCallback, useEffect } from "react";
import { useHistory } from 'react-router-dom';

export function Auth() {
  const intl = useIntl();

  const status = useAppSelector(selectStatus);
  const loginType = useAppSelector(selectLoginType);
  const loginError = useAppSelector(selectLoginError);

  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleLoginGoogle = useCallback(() => {
    dispatch(loginGoogleAsync());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      Alert.error(loginError || intl.formatMessage({ id: "loginFailedMessage" }), 5000);
    } else if (status === "success") {
      history.push("/");
    }
  }, [loginError, status]);

  return (
    <div className="login-container">
      <Panel
        className="login-panel"
        bordered
        header={
          <div>
            <h2>
              <FormattedMessage id="loginWelcome" />
            </h2>
            <div>
              <FormattedMessage id="loginSlogan" />
            </div>
          </div>
        }
      >
        <div className="login-button-container">
          <Button
            disabled={status === "logging"}
            loading={loginType === "facebook" && status === "logging"}
            color="blue"
            block
          >
            <Icon icon="facebook" /> <FormattedMessage id="loginWithFacebook" />
          </Button>
          <Button
            disabled={status === "logging"}
            loading={loginType === "google" && status === "logging"}
            color="red"
            block
            onClick={handleLoginGoogle}
          >
            <Icon icon="google-plus" /> <FormattedMessage id="loginWithGoogle" />
          </Button>
        </div>
      </Panel>
    </div>
  );
}
