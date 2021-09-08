import { SimpleQueryOptions, useSimpleQuery } from "./useSimpleQuery";
import { QueryKey } from "react-query";
import { useReactQueryPersist } from "../useReactQueryPersist";
import { PersistentManager } from "../../utils/persistence/persistent-manager";

export type PersistQueryOptions<T> = SimpleQueryOptions<T> & {
  enableIfPersisted?: boolean;
};

function toPersistKey(queryKey: QueryKey): string {
  if (typeof queryKey === "string") {
    return queryKey;
  }
  return queryKey.join("-");
}

export function usePersistQuery<T>(
  queryKey: QueryKey,
  queryFn: (queryKey: QueryKey) => Promise<T>,
  options?: PersistQueryOptions<T>,
) {
  const persistKey = toPersistKey(queryKey);
  const { initialData, enabled, cacheTime, enableIfPersisted, ...rest } =
    options || {};

  const persist = useReactQueryPersist();
  const { data, ...rest1 } = useSimpleQuery(queryKey, queryFn, {
    ...rest,
    initialData: PersistentManager.defaultInstance.getObject(
      persistKey,
      initialData,
    ),
    enabled:
      enabled === undefined
        ? enableIfPersisted
          ? PersistentManager.defaultInstance.containsObject(persistKey)
          : false
        : enabled,
  });

  persist(persistKey, data, cacheTime);

  return { data, ...rest1 };
}
