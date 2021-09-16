export function scrollIntoHighlightedChapter(container?: HTMLElement) {
  const elements = (container || document).getElementsByClassName(
    "chapter--highlighted",
  );
  if (elements.length === 1) {
    elements.item(0)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return true;
  }
  return false;
}
