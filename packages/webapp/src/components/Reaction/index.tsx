import {
  calculateVoteCount,
  GetStoryDto,
  GetStoryHistoryDto,
  VoteType,
} from "@evergarden/shared";

import upvoteImg from "../../images/sweet_kiss.png";
import downvoteImg from "../../images/beat_brick.png";
import { StandardProps } from "rsuite/es/@types/common";
import { IconButton } from "rsuite";

import "./index.less";
import classNames from "classnames";
import { abbreviateNumber } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story/storySlice";
import {
  selectStoryHistory,
  updateStoryHistoryAsync,
} from "../../features/history/historySlice";
import { useDebouncedCallback } from "use-debounce";
import { useCallback, useEffect, useState } from "react";
import {selectUser} from "../../features/auth/authSlice";

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
  const fetchedStory = useAppSelector(selectStory);
  const fetchedStoryHistory = useAppSelector(selectStoryHistory);
  const dispatch = useAppDispatch();

  const [story, setStory] = useState(fetchedStory);
  const [storyHistory, setStoryHistory] = useState(fetchedStoryHistory);

  useEffect(() => {
    if (fetchedStoryHistory) {
      setStoryHistory(fetchedStoryHistory);
    }
  }, [fetchedStoryHistory]);

  useEffect(() => {
    if (fetchedStory) {
      setStory(fetchedStory);
    }
  }, [fetchedStory]);

  const changeVoteDebounce = useDebouncedCallback(
    (story: GetStoryDto, vote?: VoteType) => {
      dispatch(
        updateStoryHistoryAsync({
          history: {
            storyId: story.id,
            vote,
          },
          startReading: false,
        }),
      );
    },
    500,
  );

  useEffect(() => {
    if (changeVoteDebounce.isPending()) {
      changeVoteDebounce.flush();
    }
  }, [changeVoteDebounce]);

  const updateVote = useCallback(
    (
      story: GetStoryDto,
      storyHistory: GetStoryHistoryDto,
      newVote: VoteType,
    ) => {
      const result = calculateVoteCount(storyHistory.vote, newVote);
      if (result) {
        setStoryHistory({
          ...storyHistory,
          vote: newVote,
        });
        setStory({
          ...story,
          upvote: (story.upvote || 0) + result.upvote,
          downvote: (story.downvote || 0) + result.downvote,
        });
        changeVoteDebounce(story, newVote);
      }
    },
    [changeVoteDebounce],
  );

  const handleUpvote = useCallback(() => {
    if (storyHistory && story) {
      const newVote = storyHistory.vote === "upvote" ? "none" : "upvote";
      updateVote(story, storyHistory, newVote);
    }
  }, [story, storyHistory, updateVote]);

  const handleDownvote = useCallback(() => {
    if (storyHistory && story) {
      const newVote = storyHistory.vote === "downvote" ? "none" : "downvote";
      updateVote(story, storyHistory, newVote);
    }
  }, [story, storyHistory, updateVote]);

  const user = useAppSelector(selectUser);

  return (
    <>
      {story && (
        <div className="reaction-container">
          <VoteButton
            disabled={!user}
            onClick={handleUpvote}
            selected={!!storyHistory && storyHistory.vote === "upvote"}
            imgSrc={upvoteImg}
            tooltip="Damn good"
            count={abbreviateNumber(story.upvote || 0)}
          />
          <VoteButton
            disabled={!user}
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
