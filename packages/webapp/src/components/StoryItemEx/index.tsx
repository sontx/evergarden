import { GetStoryDto } from "@evergarden/shared";
import defaultThumbnail from "../../images/logo.png";
import moment from "moment";
import { Divider } from "rsuite";
import classNames from "classnames";
import { StandardProps } from "rsuite/es/@types/common";
import { forwardRef, ReactNode, useCallback } from "react";
import { openReading } from "../../features/story/storySlice";
import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";

import "./index.less";

export interface StoryItemExProps extends StandardProps {
  story: GetStoryDto;
  children?: ReactNode;
}

export const StoryItemEx = forwardRef(
  ({ story, children, ...rest }: StoryItemExProps, ref: any) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const intl = useIntl();

    const handleClick = useCallback(() => {
      if (story.history) {
        dispatch(openReading(history, story, story.history.currentChapterNo));
      }
    }, [dispatch, history, story]);

    return (
      <div
        className="story-item-ex-container"
        onClick={handleClick}
        {...rest}
        ref={ref}
      >
        <div className="main">
          <div>
            <img src={story.thumbnail || defaultThumbnail} alt={story.title} />
          </div>
          <div>
            <div>{story.title}</div>
            <span className="sub">
              {story.updated !== undefined && moment(story.updated).fromNow()}
              {story.lastChapter && (
                <>
                  <Divider vertical={true} />
                  <span
                    className={classNames({
                      "new-chapter":
                        story.history &&
                        story.history.isFollowing &&
                        story.lastChapter > story.history.currentChapterNo,
                    })}
                  >
                    {intl.formatMessage(
                      { id: "chapterTitle" },
                      { chapterNo: story.lastChapter },
                    )}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
        {story.history && story.history.currentChapterNo > 0 && (
          <span className="sub">
            {`Continue ${story.history.currentChapterNo}`}
          </span>
        )}
        {children}
      </div>
    );
  },
);
