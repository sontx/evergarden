import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import classNames from "classnames";
import { openStory } from "../../../features/story/storySlice";
import { LazyImageEx } from "../../LazyImageEx";
import defaultThumbnail from "../../../images/logo.png";
import TextTruncate from "react-text-truncate";

import "./index.less";
import { forwardRef } from "react";
import { useStoryHistory } from "../../../features/histories/useStoryHistory";
import { StoryItemBaseProps } from "../index.api";
import { StoryItemMark } from "../StoryItemMark";

export const VerticalStoryItem = forwardRef(
  ({ story: passStory, className, ...rest }: StoryItemBaseProps, ref) => {
    const story = useStoryHistory(passStory);
    const history = useHistory();
    const dispatch = useAppDispatch();

    return (
      <figure
        ref={ref as any}
        className={classNames("story-item story-item--vertical", className)}
        {...rest}
        onClick={() => dispatch(openStory(history, story))}
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
