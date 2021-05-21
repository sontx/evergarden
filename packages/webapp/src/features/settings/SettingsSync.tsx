import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../auth/authSlice";
import { setUserSettings } from "./settingsSlice";

export function SettingsSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(setUserSettings(user && user.settings));
  }, [dispatch, user]);

  return children;
}
