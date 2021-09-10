import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useGoLogin() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/login");
  }, [history]);
}
