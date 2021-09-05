import { GetStoryDto } from "@evergarden/shared";

export function canContinueReading(story: GetStoryDto | undefined) {
  return (
    typeof story?.history?.currentChapterNo === "number" &&
    story.history.currentChapterNo > 0
  );
}
