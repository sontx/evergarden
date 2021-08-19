import { useEffect } from "react";
import api from "../../utils/api";
import { useHistory } from "react-router-dom";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useAppSelector } from "../../app/hooks";
import { selectIsLoggedIn } from "../../features/auth/authSlice";
import { IntlShape, useIntl } from "react-intl";

// I know it's a bad way but it works
export let globalIntl: IntlShape;

export function HttpError() {
  const history = useHistory();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  globalIntl = useIntl();

  useEffect(() => {
    if (isLoggedIn) {
      const errorInterceptorId = api.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response.status === 500) {
            history.push("/500");
          }
          return Promise.reject(error);
        },
      );

      const refreshInterceptorId = createAuthRefreshInterceptor(
        api,
        (failedRequest: any) =>
          axios.get("/api/auth/refresh").then((response) => {
            return Promise.resolve();
          }),
        {
          pauseInstanceWhileRefreshing: true,
        },
      );

      return () => {
        api.interceptors.response.eject(errorInterceptorId);
        api.interceptors.response.eject(refreshInterceptorId);
      };
    }
  }, [history, isLoggedIn]);
  return <></>;
}
