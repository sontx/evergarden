import React, { useCallback } from "react";

export function useToggle(
  action: React.Dispatch<React.SetStateAction<boolean>>,
) {
  return useCallback(() => {
    action((prev) => !prev);
  }, [action]);
}
