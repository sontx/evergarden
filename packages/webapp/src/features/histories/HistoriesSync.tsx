import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchReadingHistoriesAsync, setHistories } from "./historiesSlice";
import { selectIsLoggedIn } from "../auth/authSlice";

export function HistoriesSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLogged) {
      dispatch(fetchReadingHistoriesAsync());
    } else {
      dispatch(setHistories([]));
    }
  }, [dispatch, isLogged]);

  return children;
}
