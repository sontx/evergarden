import { ReactElement } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectIsLoggedIn } from "../../features/auth/authSlice";
import { Redirect, useLocation } from "react-router-dom";

export function AuthRequired({ children }: { children: ReactElement }) {
  const isLogged = useAppSelector(selectIsLoggedIn);
  const location = useLocation();
  return isLogged ? (
    children
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: {
          prevPathName: location.pathname,
        },
      }}
    />
  );
}
