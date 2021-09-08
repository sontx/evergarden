import { useCallback } from "react";
import { useGoLogin } from "./navigation/useGoLogin";
import { useIsLoggedIn } from "../features/user/hooks/useIsLoggedIn";

export function useAuthorizedRequired() {
  const isLoggedIn = useIsLoggedIn();
  const gotoLogin = useGoLogin();
  return useCallback(
    (fn: () => void) => {
      if (isLoggedIn) {
        fn();
      } else {
        gotoLogin();
      }
    },
    [gotoLogin, isLoggedIn],
  );
}
