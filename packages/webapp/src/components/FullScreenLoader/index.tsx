import { CuteLoader } from "../CuteLoader";
import { useIsDarkMode } from "../../features/global/hooks/useIsDarkMode";
import { useOverlay } from "../../hooks/useOverlay";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";

export function FullScreenLoader() {
  useOverlay();
  useNoBodyScrolling();
  const isDarkMode = useIsDarkMode();
  return (
    <div className="full-screen-loader rs-modal-backdrop backdrop backdrop-container">
      <CuteLoader center dark={isDarkMode} />
    </div>
  );
}
