import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserAsync, selectIsLoggedIn } from "../user/userSlice";

export function AuthSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLogged) {
      dispatch(fetchUserAsync());
    }
  }, [dispatch, isLogged]);

  return children;
}
