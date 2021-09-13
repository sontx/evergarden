import { useHistory, useLocation } from "react-router-dom";
import { useCallback } from "react";

export function useGoLogin() {
  const history = useHistory();
  const location = useLocation();
  return useCallback(() => {
    history.push("/login", {
      prevPathName: location.pathname,
    });
  }, [history, location.pathname]);
}
