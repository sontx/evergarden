import { ReactElement, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchAuthenticatedUserAsync } from "./authSlice";

export function AuthSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAuthenticatedUserAsync());
  }, [dispatch]);

  return children;
}
