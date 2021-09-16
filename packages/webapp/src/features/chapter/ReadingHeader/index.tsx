import moment from "moment";
import { Link } from "react-router-dom";
import { GetChapterDto } from "@evergarden/shared";
import { FormattedMessage } from "react-intl";
import { ChapterHeader } from "../../../components/ChapterHeader";

export function ReadingHeader({ chapter }: { chapter: GetChapterDto }) {
  return (
    <div className="reading-header">
      <ChapterHeader chapter={chapter}/>
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
