import { GetStoryDto, GetUserDto, IdType } from "@evergarden/shared";
import { Icon, IconButton, Rate, Tag } from "rsuite";
import { Link } from "react-router-dom";
import moment from "moment";
import { isEmpty } from "../../utils/types";

import "./storyDetail.less";
import { useEffect, useState } from "react";
import { pingUser } from "../user/userAPI";

function Ongoing() {
  return <span className="story-preview-detail-status--ongoing">Ongoing</span>;
}

function Full() {
  return <span className="story-preview-detail-status--full">Full</span>;
}

function UploadBy(props: { userId: IdType }) {
  const { userId } = props;
  const [user, setUser] = useState<GetUserDto | null>(null);
  useEffect(() => {
    pingUser(userId).then((responseUser: GetUserDto | null) => {
      setUser(responseUser);
    });
  }, [userId]);
  return (
    <span>
      {user && (
        <Link
          to={{
            pathname: `/user/${user.id}`,
          }}
        >
          {user.fullName}
        </Link>
      )}
    </span>
  );
}

export function StoryDetail(props: { story: GetStoryDto }) {
  const { story } = props;

  return (
    <div className="story-preview-detail">
      {story.authors && (
        <>
          <label>Author(s)</label>
          <span>
            {(story.authors || []).map((author) => (
              <Tag key={author}>
                <Link
                  to={{
                    pathname: "/author",
                    search: `?name=${encodeURIComponent(author)}`,
                  }}
                >
                  {author}
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
              <Tag key={genre}>
                <Link
                  to={{
                    pathname: "/genre",
                    search: `?name=${encodeURIComponent(genre)}`,
                  }}
                >
                  {genre}
                </Link>
              </Tag>
            ))}
          </span>
        </>
      )}

      {story.status && (
        <>
          <label>Status</label>
          {story.status === "full" ? <Full /> : <Ongoing />}
        </>
      )}

      {story.view && (
        <>
          <label>View</label>
          <span>{story.view} </span>
        </>
      )}

      {story.uploadBy && (
        <>
          <label>Upload by</label>
          <UploadBy userId={story.uploadBy} />
        </>
      )}

      {story.updated && (
        <>
          <label>Last updated</label>
          <span>{moment(story.updated).fromNow()}</span>
        </>
      )}

      {!isEmpty(story.lastChapter) && (
        <>
          <label>Last chapter</label>
          <span>
            <Link
              to={{
                pathname: `/reading/${story.url}/chapter-${story.lastChapter}`,
              }}
            >
              {story.lastChapter} <Icon icon="arrow-right-line" />
            </Link>
          </span>
        </>
      )}
    </div>
  );
}
