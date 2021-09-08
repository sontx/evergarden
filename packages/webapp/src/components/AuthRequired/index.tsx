import { ReactElement } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "../../features/user/hooks/useIsLoggedIn";

export function AuthRequired({ children }: { children: ReactElement }) {
  const isLogged = useIsLoggedIn();
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
