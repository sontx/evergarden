import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useGoCreateStory() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/user/story/new");
  }, [history]);
}
