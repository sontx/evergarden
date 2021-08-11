import { calculateVoteCount, GetStoryDto, VoteType } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { Icon, IconButton } from "rsuite";

import "./index.less";
import classNames from "classnames";
import { abbreviateNumber } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory, setStory } from "../../features/story/storySlice";
import { ReactElement, useCallback } from "react";
import { selectUser } from "../../features/auth/authSlice";
import { useAutoFlushDebounce } from "../../hooks/useAutoFlushDebounce";
import { useStoryHistory } from "../../features/histories/useStoryHistory";
import { updateStoryHistoryAsync } from "../../features/histories/historiesSlice";

function VoteButton({
  icon,
  count,
  selected,
  ...rest
}: {
  icon: ReactElement;
  count: string;
  selected: boolean;
} & StandardProps) {
  return (
    <span
      className={classNames("vote-button", {
        "vote-button--selected": selected,
      })}
    >
      <IconButton {...rest} appearance="subtle" size="sm" circle icon={icon} />
      {count}
    </span>
  );
}

export function Reaction() {
  const story = useStoryHistory(useAppSelector(selectStory));
  const dispatch = useAppDispatch();

  const changeVoteDebounce = useAutoFlushDebounce(
    (story: GetStoryDto, vote?: VoteType) => {
      dispatch(updateStoryHistoryAsync({ storyId: story.id, vote }));
    },
    500,
  );

  const updateVote = useCallback(
    (story: GetStoryDto, oldVote: VoteType, newVote: VoteType) => {
      const result = calculateVoteCount(oldVote, newVote);
      if (result) {
        dispatch(
          setStory({
            ...story,
            upvote: (story.upvote || 0) + result.upvote,
            downvote: (story.downvote || 0) + result.downvote,
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
            icon={<Icon icon="thumbs-up" />}
            count={abbreviateNumber(story.upvote || 0)}
          />
          <VoteButton
            disabled={!isLogged}
            onClick={handleDownvote}
            selected={vote === "downvote"}
            icon={<Icon icon="thumbs-down" />}
            count={abbreviateNumber(story.downvote || 0)}
          />
        </div>
      )}
    </>
  );
}
