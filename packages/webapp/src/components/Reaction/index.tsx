import { calculateVoteCount, GetStoryDto, VoteType } from "@evergarden/shared";

import upvoteImg from "../../images/sweet_kiss.png";
import downvoteImg from "../../images/beat_brick.png";
import { StandardProps } from "rsuite/es/@types/common";
import { IconButton } from "rsuite";

import "./index.less";
import classNames from "classnames";
import { abbreviateNumber } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory, setStory } from "../../features/story/storySlice";
import { updateStoryHistoryAsync } from "../../features/history/historySlice";
import { useDebouncedCallback } from "use-debounce";
import { useCallback, useEffect } from "react";
import { selectUser } from "../../features/auth/authSlice";

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
  const dispatch = useAppDispatch();

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
    (story: GetStoryDto, oldVote: VoteType, newVote: VoteType) => {
      const result = calculateVoteCount(oldVote, newVote);
      if (result) {
        dispatch(
          setStory({
            ...story,
            upvote: (story.upvote || 0) + result.upvote,
            downvote: (story.downvote || 0) + result.downvote,
            history: {
              ...(story.history || {}),
              vote: newVote,
            },
          }),
        );
        changeVoteDebounce(story, newVote);
      }
    },
    [changeVoteDebounce, dispatch],
  );

  const handleUpvote = useCallback(() => {
    if (story) {
      const oldVote = story.history ? story.history.vote : "none";
      const newVote = oldVote === "upvote" ? "none" : "upvote";
      updateVote(story, oldVote, newVote);
    }
  }, [story, updateVote]);

  const handleDownvote = useCallback(() => {
    if (story) {
      const oldVote = story.history ? story.history.vote : "none";
      const newVote = oldVote === "downvote" ? "none" : "downvote";
      updateVote(story, oldVote, newVote);
    }
  }, [story, updateVote]);

  const isLogged = !!useAppSelector(selectUser);
  const vote = story && story.history ? story.history.vote : "none";

  return (
    <>
      {story && (
        <div className="reaction-container">
          <VoteButton
            disabled={!isLogged}
            onClick={handleUpvote}
            selected={vote === "upvote"}
            imgSrc={upvoteImg}
            tooltip="Damn good"
            count={abbreviateNumber(story.upvote || 0)}
          />
          <VoteButton
            disabled={!isLogged}
            onClick={handleDownvote}
            selected={vote === "downvote"}
            imgSrc={downvoteImg}
            tooltip="Like a shit"
            count={abbreviateNumber(story.downvote || 0)}
          />
        </div>
      )}
    </>
  );
}
