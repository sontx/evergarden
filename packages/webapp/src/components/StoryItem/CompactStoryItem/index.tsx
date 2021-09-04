import defaultThumbnail from "../../../images/logo.png";
import { Divider } from "rsuite";
import classNames from "classnames";
import { memo, ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useStoryHistory } from "../../../features/histories/hooks/useStoryHistory";
import { LazyImageEx } from "../../LazyImageEx";
import { StoryItemBaseProps } from "../index.api";
import { GetStoryDto } from "@evergarden/shared";
import { StoryItemMark } from "../StoryItemMark";
import { ChapterNumber } from "./ChapterNumber";
import { UpdatedTime } from "./UpdatedTime";

export interface CompactStoryItemProps extends StoryItemBaseProps {
  title?: (story: GetStoryDto) => ReactNode;
  subtitle?: (story: GetStoryDto) => ReactNode;
  rightSlot?: (story: GetStoryDto) => ReactNode;
  onClick?: (story: GetStoryDto) => void;
}

export const CompactStoryItem = memo(function ({
  story: passStory,
  title,
  subtitle,
  rightSlot,
  onClick,
  className,
  ...rest
}: CompactStoryItemProps) {
  const story = useStoryHistory(passStory);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(story);
    }
  }, [onClick, story]);

  return (
    <div
      className={classNames("story-item story-item--compact", className)}
      onClick={handleClick}
      {...rest}
    >
      <div className="slot--left">
        <div>
          <LazyImageEx
            alt={story.title}
            src={story.thumbnail}
            defaultSrc={defaultThumbnail}
          />
          {story.mark && <StoryItemMark mark={story.mark} compact />}
        </div>
        <div className="info">
          <div className="title">{title ? title(story) : story.title}</div>
          <span className="subtitle">
            {subtitle ? (
              subtitle(story)
            ) : (
              <>
                {story.updated !== undefined && <UpdatedTime story={story} />}
                {story.lastChapter !== undefined && story.lastChapter > 0 && (
                  <>
                    <Divider vertical={true} />
                    <ChapterNumber story={story} />
                  </>
                )}
              </>
            )}
          </span>
        </div>
      </div>
      {rightSlot ? (
        <div className="slot--right">{rightSlot(story)}</div>
      ) : (
        story.history &&
        story.history.currentChapterNo > 0 && (
          <div className="slot--right">
            <span className="continue-reading">
              <FormattedMessage
                id="continueReadingText"
                values={{ chapter: story.history.currentChapterNo }}
              />
            </span>
          </div>
        )
      )}
    </div>
  );
});
