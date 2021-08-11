import { DebouncedState, Options } from "use-debounce/lib/useDebouncedCallback";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useAutoFlushDebounce<
  T extends (...args: any[]) => ReturnType<T>
>(func: T, wait?: number, options?: Options): DebouncedState<T> {
  const callback = useDebouncedCallback(func, wait, options);
  useEffect(() => {
    return () => {
      if (callback.isPending()) {
        callback.flush();
      }
    };
  }, [callback]);
  return callback;
}
