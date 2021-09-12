import { CuteLoader } from "../CuteLoader";
import { useOverlay } from "../../hooks/useOverlay";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";
import { Backdrop } from "../Backdrop";

export function FullScreenLoader() {
  useOverlay();
  useNoBodyScrolling();
  return (
    <div className="full-screen-loader">
      <CuteLoader center />
      <Backdrop noHeader />
    </div>
  );
}
