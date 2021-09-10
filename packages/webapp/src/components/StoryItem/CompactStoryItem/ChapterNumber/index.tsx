import { GetStoryDtoEx } from "../../index.api";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";

export function ChapterNumber({
  story,
  className,
  ...rest
}: { story: GetStoryDtoEx } & StandardProps) {
  return (
    <span
      className={classNames(className, "chapter-number", {
        "new-chapter":
          story.history &&
          story.history.isFollowing &&
          story.lastChapter !== undefined &&
          story.lastChapter > story.history.currentChapterNo,
      })}
      {...rest}
    >
      <FormattedMessage
        id="chapterTitle"
        values={{ chapterNo: story.lastChapter }}
      />
    </span>
  );
}
