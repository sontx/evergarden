import { useEffect, useState } from "react";
import { waitElementExists } from "../utils/wait-element-exists";

export function useDocumentQuery(
  queryFn: () => HTMLElement | null,
  timeout: number,
) {
  const [found, setFound] = useState<HTMLElement | undefined>();

  useEffect(() => {
    return waitElementExists(
      document.documentElement,
      queryFn,
      (element) => {
        setFound(element);
      },
      timeout,
    );
  }, [queryFn, timeout]);

  return found;
}
