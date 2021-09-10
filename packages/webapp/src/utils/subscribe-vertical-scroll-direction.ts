export function subscribeVerticalScrollDirection(
  onDirectionChange: (change: {
    isDown: boolean;
    touchedTop: boolean;
    touchedBottom: boolean;
  }) => void,
  target: HTMLElement = document.documentElement,
): () => void {
  let lastScrollTop = target.scrollTop;
  let isDown: boolean | undefined = undefined;
  const handleScroll = () => {
    const scrollTop = target.scrollTop;
    const isScrollDown = scrollTop > lastScrollTop;
    if (isDown !== isScrollDown) {
      onDirectionChange({
        isDown: isScrollDown,
        touchedTop: scrollTop === 0,
        touchedBottom: scrollTop + target.clientHeight >= target.scrollHeight,
      });
      isDown = isScrollDown;
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  const scrollElement = target === document.documentElement ? document : target;
  scrollElement.addEventListener("scroll", handleScroll);
  return () => scrollElement.removeEventListener("scroll", handleScroll);
}
