import { GetStoryDto } from "@evergarden/shared";
import defaultThumbnail from "../../images/logo.png";
import moment from "moment";
import { Divider } from "rsuite";
import classNames from "classnames";
import { StandardProps } from "rsuite/es/@types/common";
import { ElementType, forwardRef, ReactNode, useCallback } from "react";
import { useIntl } from "react-intl";

import "./index.less";
import { useStoryHistory } from "../../features/histories/useStoryHistory";

export interface StoryItemExProps extends StandardProps {
  story: GetStoryDto;
  children?: ReactNode;
  RightSub?: ElementType<{ story: GetStoryDto }>;
  BottomSub?: ElementType<{ story: GetStoryDto }>;
  mainNoWrap?: boolean;
  additionPadding?: boolean;
  onClick?: (story: GetStoryDto) => void;
}

export const StoryItemEx = forwardRef(
  (
    {
      story: passStory,
      children,
      RightSub,
      BottomSub,
      mainNoWrap,
      additionPadding,
      onClick,
      ...rest
    }: StoryItemExProps,
    ref: any,
  ) => {
    const story = useStoryHistory(passStory);
    const intl = useIntl();

    const handleClick = useCallback(() => {
      if (onClick) {
        onClick(story);
      }
    }, [onClick, story]);

    return (
      <div
        className="story-item-ex-container"
        onClick={handleClick}
        {...rest}
        ref={ref}
      >
        <div
          className={classNames("main", {
            "main--padding": additionPadding,
            "main--nowrap": mainNoWrap,
          })}
        >
          <div>
            <img src={story.thumbnail || defaultThumbnail} alt={story.title} />
          </div>
          <div>
            <div className="title">{story.title}</div>
            {BottomSub ? (
              <div className="sub">
                <BottomSub story={story} />
              </div>
            ) : (
              <span className="sub">
                {story.updated !== undefined && moment(story.updated).fromNow()}
                {story.lastChapter && story.lastChapter > 0 && (
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
            )}
          </div>
        </div>
        {RightSub ? (
          <div className="sub sub--left">
            <RightSub story={story} />
          </div>
        ) : (
          story.history &&
          story.history.currentChapterNo > 0 && (
            <span className="sub sub--left">
              {`Continue ${story.history.currentChapterNo}`}
            </span>
          )
        )}
        {children}
      </div>
    );
  },
);
