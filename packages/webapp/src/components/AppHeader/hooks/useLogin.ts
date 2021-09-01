import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useLogin() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/login");
  }, [history]);
}
