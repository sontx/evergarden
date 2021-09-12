import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useGoFollowing() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/following");
  }, [history]);
}
