export function waitElementExists(
  targetNode: HTMLElement,
  queryFn: (targetNode: HTMLElement) => HTMLElement | null,
  onExist: (element: HTMLElement) => void,
  timeout: number,
) {
  let timeoutId: number | undefined;

  const cleanupTimeout = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  const onComplete = (element?: HTMLElement) => {
    cleanupTimeout();
    if (element) {
      onExist(element);
    }
  };

  const doCheck = () => {
    const match = queryFn(targetNode);
    if (match) {
      onComplete(match);
    }
    return !!match;
  };

  if (doCheck()) {
    return () => {};
  }

  const config = { childList: true, subtree: true };
  const callback: MutationCallback = (mutationsList, observer) => {
    if (doCheck()) {
      observer.disconnect();
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  timeoutId = window.setTimeout(() => {
    observer.disconnect();
  }, timeout);

  return () => {
    observer.disconnect();
    cleanupTimeout();
  };
}
