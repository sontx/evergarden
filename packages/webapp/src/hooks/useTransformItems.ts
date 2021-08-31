import { useEffect, useState } from "react";

export function useTransformItems<T>(
  items: T[] | undefined,
  transformFunc?: (items: T[] | undefined) => T[] | undefined,
) {
  const [data, setData] = useState<T[]>();
  useEffect(() => {
    setData(transformFunc ? transformFunc(items) : items);
  }, [items, transformFunc]);
  return data;
}
