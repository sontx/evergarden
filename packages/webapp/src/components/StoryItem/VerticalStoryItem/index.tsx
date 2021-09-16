import classNames from "classnames";
import defaultThumbnail from "../../../images/logo.png";
import TextTruncate from "react-text-truncate";

import { forwardRef } from "react";
import { useStoryHistory } from "../../../features/histories/hooks/useStoryHistory";
import { StoryItemBaseProps } from "../index.api";
import { StoryItemMark } from "../StoryItemMark";
import { LastChapter } from "../LastChapter";

export const VerticalStoryItem = forwardRef(
  (
    { story: passStory, className, onClick, ...rest }: StoryItemBaseProps,
    ref,
  ) => {
    const story = useStoryHistory(passStory);

    return (
      <figure
        ref={ref as any}
        className={classNames("story-item story-item--vertical", className)}
        {...rest}
        onClick={() => {
          if (onClick) {
            onClick(story);
          }
        }}
      >
        <div className="thumbnail-container">
          <img alt={story.title} src={story.thumbnail || defaultThumbnail} />
          {story.mark && <StoryItemMark mark={story.mark} />}
          {story.lastChapter !== undefined && <LastChapter story={story} />}
        </div>
        <div className="info">
          <figcaption className="title">
            <TextTruncate line={2} text={story.title} />
          </figcaption>
          {story.authors && story.authors.length > 0 && (
            <TextTruncate
              containerClassName="author"
              line={2}
              text={story.authors[0].name}
            />
          )}
        </div>
      </figure>
    );
  },
);
