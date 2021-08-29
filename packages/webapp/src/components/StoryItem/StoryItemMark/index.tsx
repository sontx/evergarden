import { ImageMark } from "../../ImageMark";
import { StoryItemMarkOptions } from "../index.api";

export function StoryItemMark({ mark }: { mark: StoryItemMarkOptions }) {
  return (
    <ImageMark
      backgroundColor={mark.backgroundColor}
      spotlight={mark.spotlight}
    >
      {mark.text}
    </ImageMark>
  );
}
