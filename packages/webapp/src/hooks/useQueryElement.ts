import { useCallback, useEffect, useRef, useState } from "react";
import { waitElementExists } from "../utils/wait-element-exists";

export function useQueryElement(
  queryFn: (targetNode: HTMLElement) => HTMLElement | null,
  timeout: number,
): [HTMLElement | undefined, (ref: HTMLElement | null) => void] {
  const [found, setFound] = useState<HTMLElement | undefined>();
  const cancelRef = useRef<() => void>(() => {});

  useEffect(() => {
    return () => {
      cancelRef.current();
    };
  }, []);

  const callback = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        cancelRef.current = waitElementExists(
          ref,
          queryFn,
          (element) => {
            setFound(element);
          },
          timeout,
        );
      }
    },
    [queryFn, timeout],
  );

  return [found, callback];
}
