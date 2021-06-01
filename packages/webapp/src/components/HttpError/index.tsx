import { useEffect } from "react";
import api from "../../utils/api";
import { useHistory } from "react-router-dom";

export function HttpError() {
  const history = useHistory();
  useEffect(() => {
    const id = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 404) {
          history.push("/404");
        } else if (error.response.status === 500) {
          history.push("/500");
        }
        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(id);
  }, [history]);
  return <></>;
}
