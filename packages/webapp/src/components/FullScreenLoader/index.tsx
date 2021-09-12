import { CuteLoader } from "../CuteLoader";
import { useIsDarkMode } from "../../features/global/hooks/useIsDarkMode";
import { useOverlay } from "../../hooks/useOverlay";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";
import { Backdrop } from "../Backdrop";

export function FullScreenLoader() {
  useOverlay();
  useNoBodyScrolling();
  const { isDarkMode } = useIsDarkMode();
  return (
    <div className="full-screen-loader">
      <CuteLoader center dark={isDarkMode} />
      <Backdrop noHeader/>
    </div>
  );
}
