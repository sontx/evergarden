import defaultThumbnail from "../../../../images/logo.png";
import { LazyImageEx } from "../../../LazyImageEx";
import { GetStoryDto } from "@evergarden/shared";

import "./index.less";
import { Icon, Tag, TagGroup } from "rsuite";
import { Link, useHistory } from "react-router-dom";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { abbreviateNumber } from "../../../../utils/types";
import { openReading, openStory } from "../../../../features/story/storySlice";
import { useAppDispatch } from "../../../../app/hooks";
import { forwardRef } from "react";
import { useStoryHistory } from "../../../../features/histories/useStoryHistory";

export const HorizontalStoryItem = forwardRef(
  (
    {
      story: passStory,
      className,
      ...rest
    }: { story: GetStoryDto } & StandardProps,
    ref,
  ) => {
    const story = useStoryHistory(passStory);
    const history = useHistory();
    const dispatch = useAppDispatch();

    return (
      <div
        ref={ref as any}
        className={classNames("story-item--horizontal", className)}
        {...rest}
        onClick={() => dispatch(openStory(history, story))}
      >
        <LazyImageEx
          alt={story.title}
          defaultSrc={defaultThumbnail}
          src={story.thumbnail}
        />
        <div className="info">
          <h5 className="title">{story.title}</h5>
          <p className="desc">{story.description}</p>
          <div className="meta">
            {story.authors && story.authors.length > 0 && (
              <Link
                className="author"
                to={{ pathname: `/author/${story.authors[0].id}` }}
              >
                <Icon icon="user" />
                {story.authors[0].name}
              </Link>
            )}
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
