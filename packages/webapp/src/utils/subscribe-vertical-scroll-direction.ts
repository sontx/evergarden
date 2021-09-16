export function subscribeVerticalScrollDirection(
  onDirectionChange: (change: {
    isDown: boolean;
    touchedTop: boolean;
    touchedBottom: boolean;
  }) => void,
  target: HTMLElement = document.documentElement,
): () => void {
  let lastScrollTop = target.scrollTop;
  let isLastDown: boolean | undefined = undefined;
  let isLastTouchedTop: boolean | undefined = undefined;
  let isLastTouchedBottom: boolean | undefined = undefined;

  const handleScroll = () => {
    const scrollTop = target.scrollTop;
    const isDown = scrollTop > lastScrollTop;
    const isTouchedTop = scrollTop === 0;
    const isTouchedBottom =
      scrollTop + target.clientHeight >= target.scrollHeight;

    if (
      isLastDown !== isDown ||
      isLastTouchedTop !== isTouchedTop ||
      isLastTouchedBottom !== isTouchedBottom
    ) {
      onDirectionChange({
        isDown,
        touchedTop: isTouchedTop,
        touchedBottom: isTouchedBottom,
      });

      isLastDown = isDown;
      isLastTouchedTop = isTouchedTop;
      isLastTouchedBottom = isTouchedBottom;
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  const scrollElement = target === document.documentElement ? document : target;
  scrollElement.addEventListener("scroll", handleScroll);
  return () => scrollElement.removeEventListener("scroll", handleScroll);
}
