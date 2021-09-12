import { useHistory } from "react-router-dom";
import { useCallback } from "react";

export function useGoHistory() {
  const history = useHistory();
  return useCallback(() => {
    history.push("/history");
  }, [history]);
}
