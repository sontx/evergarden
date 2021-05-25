import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const api = axios.create({});

const refreshAuthLogic = (failedRequest: any) =>
  axios.get("/api/auth/refresh").then((response) => {
    return Promise.resolve();
  });

createAuthRefreshInterceptor(api, refreshAuthLogic, {
  pauseInstanceWhileRefreshing: true
});

export default api;
