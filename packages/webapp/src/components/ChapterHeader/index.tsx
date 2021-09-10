import { GetChapterDto } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { FormattedMessage } from "react-intl";
import classNames from "classnames";

export function ChapterHeader({
  chapter,
  className,
  ...rest
}: { chapter: Partial<GetChapterDto> } & StandardProps) {
  const { chapterNo, title } =
    typeof chapter === "object"
      ? chapter
      : { chapterNo: chapter, title: undefined };

  return (
    <span {...rest} className={classNames(className, "chapter-header")}>
      {title ? (
        <>
          <span className="chapter-no chapter-no--suffix">
            <FormattedMessage
              id="chapterTitle"
              values={{ chapterNo: chapterNo }}
            />
          </span>
          <span className="chapter-title">{title}</span>
        </>
      ) : (
        <span className="chapter-no">
          <FormattedMessage
            id="chapterTitle"
            values={{ chapterNo: chapterNo }}
          />
        </span>
      )}
    </span>
  );
}
