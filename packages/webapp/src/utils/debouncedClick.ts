import debounce from "lodash.debounce";

export function debouncedClick(fn: (...args: any[]) => void, wait = 1000) {
  return debounce((args) => fn(...args), wait, {
    leading: true,
    trailing: false,
    maxWait: wait,
  });
}
