import defaultThumbnail from "../../../images/logo.png";
import { LazyImageEx } from "../../LazyImageEx";
import TextTruncate from "react-text-truncate";
import { Icon, Tag, TagGroup } from "rsuite";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { abbreviateNumber } from "../../../utils/types";
import { forwardRef, useCallback } from "react";
import { useStoryHistory } from "../../../features/histories/hooks/useStoryHistory";
import { hasUnreadChapter, StoryItemBaseProps } from "../index.api";
import { AuthorLink } from "../../AuthorLink";
import { StoryItemMark } from "../StoryItemMark";
import { useGoReading } from "../../../hooks/navigation/useGoReading";

export const HorizontalStoryItem = forwardRef(
  (
    { story: passStory, className, onClick, ...rest }: StoryItemBaseProps,
    ref,
  ) => {
    const story = useStoryHistory(passStory);
    const unreadChapter = hasUnreadChapter(story);
    const gotoReading = useGoReading();

    const handleClick = useCallback(() => {
      if (onClick) {
        onClick(story);
      }
    }, [onClick, story]);

    const handleLastChapterClick = useCallback(() => {
      gotoReading(story, story.lastChapter);
    }, [gotoReading, story]);

    return (
      <div
        ref={ref as any}
        className={classNames("story-item story-item--horizontal", className)}
        {...rest}
        onClick={handleClick}
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
            <div>
              <AuthorLink story={story} className="author" />
            </div>
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
                    onClick={handleLastChapterClick}
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
