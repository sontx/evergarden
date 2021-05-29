import { Divider, Icon } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
import moment from "moment";

import "./index.less";
import { useIntl } from "react-intl";
import classNames from "classnames";
import { abbreviateNumber } from "../../utils/types";
import defaultThumbnail from "../../images/logo.png";

export interface StoryItemProps {
  story: GetStoryDto;
}

export function StoryItemMobile(props: StoryItemProps) {
  const { story } = props;
  const intl = useIntl();

  return (
    <div className="story-item-container">
      <div className="story-item-main">
        <div>
          <img src={story.thumbnail || defaultThumbnail} />
        </div>
        <div>
          <div>
            {story.title}
          </div>
          <span className="story-item-sub">
            {story.updated !== undefined && moment(story.updated).fromNow()}
            {story.lastChapter && (
              <>
                <Divider vertical={true} />
                <span
                  className={classNames({
                    "new-unread-chapter":
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
      <span className="story-item-sub">
        {abbreviateNumber(story.view)} views
      </span>
    </div>
  );
}

export function StoryItem(props: StoryItemProps) {
  return <StoryItemMobile {...props} />;
}
