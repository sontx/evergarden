import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAuthenticatedUserAsync, selectIsLoggedIn } from "./authSlice";

export function AuthSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLogged) {
      dispatch(fetchAuthenticatedUserAsync());
    }
  }, [dispatch, isLogged]);

  return children;
}
