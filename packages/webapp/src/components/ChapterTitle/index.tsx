import { GetChapterDto } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { FormattedMessage } from "react-intl";
import classNames from "classnames";

export function ChapterTitle({
  chapter,
  className,
  ...rest
}: { chapter: GetChapterDto } & StandardProps) {
  return (
    <span {...rest} className={classNames(className, "chapter-title")}>
      {chapter.title ? (
        <>
          <span className="chapter-no chapter-no--suffix">
            <FormattedMessage
              id="chapterTitle"
              values={{ chapterNo: chapter.chapterNo }}
            />
          </span>
          {chapter.title}
        </>
      ) : (
        <span className="chapter-no">
          <FormattedMessage
            id="chapterTitle"
            values={{ chapterNo: chapter.chapterNo }}
          />
        </span>
      )}
    </span>
  );
}
