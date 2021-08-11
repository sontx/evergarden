import { useCallback, useEffect, useState } from "react";

export function useEndOfSessionWatch() {
  const [isEndOfSession, setEndOfSession] = useState(false);

  const callbackWrapper = useCallback(() => {
    if (!isEndOfSession) {
      if (document.visibilityState === "hidden") {
        setEndOfSession(true);
      }
    }
  }, [isEndOfSession]);

  useEffect(() => {
    if (!isEndOfSession) {
      document.addEventListener("visibilitychange", callbackWrapper);
      return () => {
        setEndOfSession(true);
        document.removeEventListener("visibilitychange", callbackWrapper);
      };
    }
  }, [isEndOfSession, callbackWrapper]);

  return isEndOfSession;
}
