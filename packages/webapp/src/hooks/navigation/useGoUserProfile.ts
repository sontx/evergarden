import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useGoUserProfile() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/user/profile");
  }, [history]);
}
