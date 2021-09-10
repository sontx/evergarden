import { useEffect, useMemo, useState } from "react";

export function useTracker(delayBefore = 5000) {
  const [value, setValue] = useState<number | undefined>();

  const timeoutId = useMemo(() => {
    return (
      typeof value === "number" &&
      window.setTimeout(() => {
        navigator.sendBeacon(`/api/tracker?storyId=${value}`);
      }, delayBefore)
    );
  }, [delayBefore, value]);

  useEffect(() => {
    return () => {
      if (typeof timeoutId === "number") {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return setValue;
}
