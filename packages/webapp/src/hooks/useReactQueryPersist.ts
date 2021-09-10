import { useCallback } from "react";
import { PersistentManager } from "../utils/persistence/persistent-manager";
import { useQueryClient } from "react-query";

export function useReactQueryPersist() {
  const queryClient = useQueryClient();
  const defaultOptions = queryClient.getDefaultOptions();
  const defaultCacheTime = defaultOptions.queries?.cacheTime || "5m";
  return useCallback(
    (key, data: any, cacheTime?: number | string | false) => {
      PersistentManager.defaultInstance.persist(
        key,
        data,
        cacheTime === undefined ? defaultCacheTime : cacheTime,
      );
    },
    [defaultCacheTime],
  );
}
