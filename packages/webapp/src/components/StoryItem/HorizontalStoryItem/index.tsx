import defaultThumbnail from "../../../images/logo.png";
import { LazyImageEx } from "../../LazyImageEx";
import TextTruncate from "react-text-truncate";
import { Icon, Tag, TagGroup } from "rsuite";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import { abbreviateNumber } from "../../../utils/types";
import { openReading, openStory } from "../../../features/story/storySlice";
import { useAppDispatch } from "../../../app/hooks";
import { forwardRef } from "react";
import { useStoryHistory } from "../../../features/histories/useStoryHistory";
import { hasUnreadChapter, StoryItemBaseProps } from "../index.api";
import { AuthorLink } from "../../AuthorLink";
import { StoryItemMark } from "../StoryItemMark";

export const HorizontalStoryItem = forwardRef(
  ({ story: passStory, className, ...rest }: StoryItemBaseProps, ref) => {
    const story = useStoryHistory(passStory);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const unreadChapter = hasUnreadChapter(story);

    return (
      <div
        ref={ref as any}
        className={classNames("story-item story-item--horizontal", className)}
        {...rest}
        onClick={() => dispatch(openStory(history, story))}
      >
        <div>
          <LazyImageEx
            alt={story.title}
            defaultSrc={defaultThumbnail}
            src={story.thumbnail}
          />
          {story.mark && <StoryItemMark mark={story.mark} />}
        </div>
        <div className="info">
          <h5 className="title">{story.title}</h5>
          <div className="desc">
            <TextTruncate text={story.description} line={2} />
          </div>
          <div className="meta">
            <AuthorLink story={story} className="author" />
            <div>
              <TagGroup>
                {story.genres && story.genres.length > 0 && (
                  <Tag>
                    <Link
                      to={{
                        pathname: `/genre/${story.genres[0].id}`,
                      }}
                    >
                      {story.genres[0].name}
                    </Link>
                  </Tag>
                )}
                <Tag>
                  <Icon icon="eye" /> {abbreviateNumber(story.view)}
                </Tag>
                {story.lastChapter !== undefined && story.lastChapter > 0 && (
                  <Tag
                    className={classNames({ "unread-chapter": unreadChapter })}
                    onClick={() =>
                      dispatch(
                        openReading(history, story, story.lastChapter || 1),
                      )
                    }
                  >
                    <Icon icon="list-ol" /> {story.lastChapter}
                  </Tag>
                )}
              </TagGroup>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
