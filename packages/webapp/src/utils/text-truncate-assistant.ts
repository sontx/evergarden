import toPX from "to-px";

export function textTruncateAssistant(ref: HTMLElement | null) {
  if (!ref) {
    return;
  }

  ref.style.maxHeight = "unset";

  const innerText = ref.innerText;
  const flex = ref.style.flex;
  const minHeight = ref.style.minHeight;

  ref.innerText = "A";
  ref.style.flex = "unset";
  ref.style.minHeight = "unset";

  const lineHeight = toPX(window.getComputedStyle(ref).height);
  ref.innerText = innerText;
  ref.style.flex = flex;
  ref.style.minHeight = minHeight;

  const height = toPX(window.getComputedStyle(ref).height);
  if (lineHeight === null || height === null) {
    return;
  }

  const bestFitLines = Math.floor(height / lineHeight);
  const bestFitHeight = bestFitLines * lineHeight;
  ref.style.webkitLineClamp = `${bestFitLines}`;
  ref.style.maxHeight = `${bestFitHeight}px`;

}

