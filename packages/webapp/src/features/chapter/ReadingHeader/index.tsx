import moment from "moment";
import { Link } from "react-router-dom";
import { GetChapterDto } from "@evergarden/shared";
import { FormattedMessage } from "react-intl";
import classNames from "classnames";

export function ReadingHeader({ chapter }: { chapter: GetChapterDto }) {
  return (
    <div className="reading-header">
      <h5>
        <span
          className={classNames("chapter-no", {
            "chapter-no--with-title": !!chapter.title,
          })}
        >
          <FormattedMessage
            id="chapterTitle"
            values={{ chapterNo: chapter.chapterNo }}
          />
          {chapter.title && ":"}
        </span>
        {chapter.title && (
          <span className="chapter-title">{chapter.title}</span>
        )}
      </h5>
      <span className="upload-info">
        {typeof chapter.createdBy === "object" ? (
          <FormattedMessage
            id="readingSubtitle"
            values={{
              updated: moment(chapter.updated).fromNow(),
              updatedBy: (
                <Link
                  to={{
                    pathname: `/user/${chapter.createdBy.id}`,
                  }}
                >
                  {chapter.createdBy.fullName}
                </Link>
              ),
            }}
          />
        ) : (
          moment(chapter.updated).fromNow()
        )}
      </span>
    </div>
  );
}
