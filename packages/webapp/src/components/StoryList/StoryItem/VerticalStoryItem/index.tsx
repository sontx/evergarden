import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../../../app/hooks";
import classNames from "classnames";
import { openStory } from "../../../../features/story/storySlice";
import { LazyImageEx } from "../../../LazyImageEx";
import defaultThumbnail from "../../../../images/logo.png";

import "./index.less";
import { forwardRef } from "react";
import { useStoryHistory } from "../../../../features/histories/useStoryHistory";
import { StoryItemBaseProps } from "../index";

export const VerticalStoryItem = forwardRef(
  ({ story: passStory, className, ...rest }: StoryItemBaseProps, ref) => {
    const story = useStoryHistory(passStory);
    const history = useHistory();
    const dispatch = useAppDispatch();

    return (
      <figure
        ref={ref as any}
        className={classNames("story-item--vertical", className)}
        {...rest}
        onClick={() => dispatch(openStory(history, story))}
      >
        <LazyImageEx
          alt={story.title}
          defaultSrc={defaultThumbnail}
          src={story.thumbnail}
        />
        <div className="info">
          <figcaption className="title">{story.title}</figcaption>
          {story.authors && story.authors.length > 0 && (
            <p className="author">{story.authors[0].name}</p>
          )}
        </div>
      </figure>
    );
  },
);
