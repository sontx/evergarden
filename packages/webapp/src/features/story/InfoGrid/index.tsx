import { GetStoryDto, GetUserDto } from "@evergarden/shared";
import { Tag } from "rsuite";
import { Link } from "react-router-dom";
import moment from "moment";
import { useCallback } from "react";
import { useGoReading } from "../../../hooks/navigation/useGoReading";

function CreatedBy({ user }: { user: number | GetUserDto }) {
  const showUser =
    typeof user === "object"
      ? { id: user.id, name: user.fullName }
      : { id: user, name: user };
  return (
    <Link
      to={{
        pathname: `/user/${showUser.id}`,
      }}
    >
      {showUser.name}
    </Link>
  );
}

export function InfoGrid(props: { story: GetStoryDto }) {
  const { story } = props;
  const gotoReading = useGoReading();

  const handleLastChapterClick = useCallback(() => {
    if (story.lastChapter !== undefined && story.lastChapter > 0) {
      gotoReading(story, story.lastChapter);
    }
  }, [gotoReading, story]);

  return (
    <div className="info-grid">
      {story.authors && (
        <>
          <label>Author(s)</label>
          <span>
            {(story.authors || []).map((author) => (
              <Tag key={author.id}>
                <Link
                  to={{
                    pathname: `/author/${author.id}`,
                  }}
                >
                  {author.name}
                </Link>
              </Tag>
            ))}
          </span>
        </>
      )}

      {story.genres && (
        <>
          <label>Genre(s)</label>
          <span>
            {(story.genres || []).map((genre) => (
              <Tag key={genre.id}>
                <Link
                  to={{
                    pathname: `/genre/${genre.id}`,
                  }}
                >
                  {genre.name}
                </Link>
              </Tag>
            ))}
          </span>
        </>
      )}

      {story.status && (
        <>
          <label>Status</label>
          {story.status === "full" ? (
            <span className="status--full">Full</span>
          ) : (
            <span className="status--ongoing">Ongoing</span>
          )}
        </>
      )}

      {story.view >= 0 && (
        <>
          <label>View</label>
          <span>{story.view} </span>
        </>
      )}

      {story.createdBy && (
        <>
          <label>Upload by</label>
          <CreatedBy user={story.createdBy} />
        </>
      )}

      {story.updated && (
        <>
          <label>Last updated</label>
          <span>{moment(story.updated).fromNow()}</span>
        </>
      )}

      {!!story.lastChapter && (
        <>
          <label>Last chapter</label>
          <span>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={handleLastChapterClick}>{story.lastChapter}</a>
          </span>
        </>
      )}
    </div>
  );
}
