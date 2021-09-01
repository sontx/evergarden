import { ImageMark } from "../../ImageMark";
import { StoryItemMarkOptions } from "../index.api";

export function StoryItemMark({
  mark,
  compact,
}: {
  mark: StoryItemMarkOptions;
  compact?: boolean;
}) {
  return (
    <ImageMark
      compact={compact}
      backgroundColor={mark.backgroundColor}
      spotlight={mark.spotlight}
      color="white"
    >
      {compact ? mark.value : mark.text}
    </ImageMark>
  );
}
