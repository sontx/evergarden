import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useAuthorizedRequired } from "../useAuthorizedRequired";

export function useGoHistory() {
  const history = useHistory();
  const authorizedRequired = useAuthorizedRequired();
  return useCallback(() => {
    authorizedRequired(() => {
      history.push("/history");
    });
  }, [authorizedRequired, history]);
}
