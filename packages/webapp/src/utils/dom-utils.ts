export function getAbsoluteSize(
  el: HTMLElement | null,
): { height: number; width: number } {
  if (!el) {
    return { width: 0, height: 0 };
  }

  const styles = window.getComputedStyle(el);
  const verticalMargin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);
  const horizontalMargin =
    parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);
  return {
    height: Math.ceil(el.offsetHeight + verticalMargin),
    width: Math.ceil(el.offsetWidth + horizontalMargin),
  };
}
