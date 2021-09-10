import { useEffect } from "react";
import { DOMHelper } from "rsuite";

export function useNoBodyScrolling() {
  useEffect(() => {
    DOMHelper.addClass(document.body, "noscroll");
    return () => {
      DOMHelper.removeClass(document.body, "noscroll");
    };
  }, []);
}
