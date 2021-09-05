import { useAppSelector } from "../app/hooks";
import { selectIsLoggedIn } from "../features/user/userSlice";
import { useCallback } from "react";
import { useGoLogin } from "./navigation/useGoLogin";

export function useAuthorizedRequired() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
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
