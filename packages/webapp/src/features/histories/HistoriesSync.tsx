import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchReadingHistoriesAsync, setHistories } from "./historiesSlice";
import { setFollowingStories } from "../following/followingSlice";
import { selectIsLoggedIn } from "../user/userSlice";

export function HistoriesSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLogged) {
      dispatch(fetchReadingHistoriesAsync());
    } else {
      dispatch(setHistories([]));
      dispatch(setFollowingStories([]));
    }
  }, [dispatch, isLogged]);

  return children;
}
