import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useGoUserStoryList() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/user/story");
  }, [history]);
}
