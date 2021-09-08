import { useAppSelector } from "../../../app/hooks";
import { selectIsDarkMode } from "../globalSlice";

export function useIsDarkMode() {
  return useAppSelector(selectIsDarkMode);
}
