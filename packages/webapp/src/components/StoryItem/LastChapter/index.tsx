import { memo } from "react";
import { GetStoryDto } from "@evergarden/shared";
import classNames from "classnames";

export const LastChapter = memo(({ story }: { story: GetStoryDto }) => {
  const currentChapterNo = story.history?.currentChapterNo;
  const lastChapterNo = story.lastChapter;
  return (
    <span
      className={classNames("last-chapter", {
        "last-chapter--unread":
          currentChapterNo !== undefined &&
          lastChapterNo !== undefined &&
          currentChapterNo < lastChapterNo,
      })}
    >
      {lastChapterNo}
    </span>
  );
});
