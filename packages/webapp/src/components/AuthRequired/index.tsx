import { ReactElement } from "react";
import { useAppSelector } from "../../app/hooks";
import { Redirect, useLocation } from "react-router-dom";
import { selectIsLoggedIn } from "../../features/user/userSlice";

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
