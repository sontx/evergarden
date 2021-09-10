import { ElementType } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectIsShowingFullScreenLoader } from "../../features/global/globalSlice";

export function withGlobalFullScreenLoader(Component: ElementType) {
  return () => {
    const show = useAppSelector(selectIsShowingFullScreenLoader);
    return show ? <Component /> : <></>;
  };
}
