import { useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import { setIsShowingOverlay } from "../features/global/globalSlice";

export function useOverlay() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsShowingOverlay(true));
    return () => {
      dispatch(setIsShowingOverlay(false));
    };
  }, [dispatch]);
}
