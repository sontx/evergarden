import {GetStoryDto, VoteType} from "@evergarden/shared";

import upvoteImg from "../../images/sweet_kiss.png";
import downvoteImg from "../../images/beat_brick.png";
import { StandardProps } from "rsuite/es/@types/common";
import { IconButton } from "rsuite";

import "./index.less";
import classNames from "classnames";
import { abbreviateNumber } from "../../utils/types";
import { useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story/storySlice";
import { selectStoryHistory } from "../../features/history/historySlice";
import {useDebouncedCallback} from "use-debounce";
import {useCallback, useEffect} from "react";

function VoteButton({
  imgSrc,
  tooltip,
  count,
  selected,
  ...rest
}: {
  imgSrc: string;
  tooltip: string;
  count: string;
  selected: boolean;
} & StandardProps) {
  return (
    <span
      className={classNames("vote-button", {
        "vote-button--selected": selected,
      })}
    >
      <IconButton
        {...rest}
        appearance="subtle"
        size="sm"
        circle
        icon={<img src={imgSrc} alt={tooltip} title={tooltip} />}
      />
      {count}
    </span>
  );
}

export function Reaction() {
  const story = useAppSelector(selectStory);
  const storyHistory = useAppSelector(selectStoryHistory);
  const changeVoteDebounce = useDebouncedCallback((vote?: VoteType) => {

  }, 3000);

  useEffect(() => {
    if (changeVoteDebounce.isPending()) {
      changeVoteDebounce.flush();
    }
  }, [changeVoteDebounce]);

  const handleUpvote = useCallback(() => {
    if (storyHistory) {
      changeVoteDebounce(storyHistory.vote === "upvote" ? undefined : "upvote");
    }
  }, [changeVoteDebounce, storyHistory]);

  const handleDownvote = useCallback(() => {
    if (storyHistory) {
      changeVoteDebounce(storyHistory.vote === "downvote" ? undefined : "downvote");
    }
  }, [changeVoteDebounce, storyHistory]);

  return (
    <>
      {story && (
        <div className="reaction-container">
          <VoteButton
            onClick={handleUpvote}
            selected={!!storyHistory && storyHistory.vote === "upvote"}
            imgSrc={upvoteImg}
            tooltip="Damn good"
            count={abbreviateNumber(story.upvote || 0)}
          />
          <VoteButton
            onClick={handleDownvote}
            selected={!!storyHistory && storyHistory.vote === "downvote"}
            imgSrc={downvoteImg}
            tooltip="Like a shit"
            count={abbreviateNumber(story.downvote || 0)}
          />
        </div>
      )}
    </>
  );
}
