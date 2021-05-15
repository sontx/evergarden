import { Alert, Button, Icon, Panel } from "rsuite";
import { FormattedMessage, useIntl } from "react-intl";

import "./auth.less";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginGoogleAsync, selectLoginError, selectLoginType, selectStatus } from "./authSlice";
import { useCallback, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import {isMobile} from "react-device-detect";

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
    if (status === "error") {
      Alert.error(loginError || intl.formatMessage({ id: "loginFailedMessage" }), 5000);
    } else if (status === "success") {
      history.push("/");
    }
  }, [loginError, status]);

  return (
    <div className="login-container">
      <Panel
        className="login-panel"
        style={isMobile ? {border: "unset"} : {}}
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
            disabled={status === "processing"}
            loading={loginType === "facebook" && status === "processing"}
            color="blue"
            block
          >
            <Icon icon="facebook" /> <FormattedMessage id="loginWithFacebook" />
          </Button>
          <Button
            disabled={status === "processing"}
            loading={loginType === "google" && status === "processing"}
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
