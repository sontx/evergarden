import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import classNames from "classnames";
import { openStory } from "../../../features/story/storySlice";
import { LazyImageEx } from "../../LazyImageEx";
import defaultThumbnail from "../../../images/logo.png";
// @ts-ignore
import LinesEllipsis from "react-lines-ellipsis";

import "./index.less";
import { forwardRef } from "react";
import { useStoryHistory } from "../../../features/histories/useStoryHistory";
import { StoryItemBaseProps } from "../index.api";
import { ImageMark } from "../../ImageMark";

export const VerticalStoryItem = forwardRef(
  ({ story: passStory, mark, className, ...rest }: StoryItemBaseProps, ref) => {
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
            <LinesEllipsis maxLine={2} text={story.title} />
          </figcaption>
          {story.authors && story.authors.length > 0 && (
            <LinesEllipsis
              className="author"
              maxLine={2}
              text={story.authors[0].name}
            />
          )}
        </div>
        {mark && (
          <ImageMark
            backgroundColor={mark.backgroundColor}
            spotlight={mark.spotlight}
          >
            {mark.text}
          </ImageMark>
        )}
      </figure>
    );
  },
);
