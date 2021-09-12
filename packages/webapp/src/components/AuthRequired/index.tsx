import { ReactElement } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "../../features/user/hooks/useIsLoggedIn";
import { CuteLoader } from "../CuteLoader";

export function AuthRequired({ children }: { children: ReactElement }) {
  const { isLoggedIn, isLoading } = useIsLoggedIn();
  const location = useLocation();

  if (isLoading) {
    return <CuteLoader center />;
  }
  return isLoggedIn ? (
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
