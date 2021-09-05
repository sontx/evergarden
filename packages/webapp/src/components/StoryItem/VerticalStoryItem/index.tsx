import classNames from "classnames";
import { LazyImageEx } from "../../LazyImageEx";
import defaultThumbnail from "../../../images/logo.png";
import TextTruncate from "react-text-truncate";

import { forwardRef } from "react";
import { useStoryHistory } from "../../../features/histories/hooks/useStoryHistory";
import { StoryItemBaseProps } from "../index.api";
import { StoryItemMark } from "../StoryItemMark";

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
        <LazyImageEx
          alt={story.title}
          defaultSrc={defaultThumbnail}
          src={story.thumbnail}
        />
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
        {story.mark && <StoryItemMark mark={story.mark} />}
      </figure>
    );
  },
);
