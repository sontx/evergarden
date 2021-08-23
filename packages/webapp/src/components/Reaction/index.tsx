import { GetStoryDto, VoteType } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { Icon, IconButton } from "rsuite";

import "./index.less";
import classNames from "classnames";
import { abbreviateNumber } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ReactElement, useState } from "react";
import { useAutoFlushDebounce } from "../../hooks/useAutoFlushDebounce";
import { updateStoryHistoryAsync } from "../../features/histories/historiesSlice";
import { selectUser } from "../../features/user/userSlice";

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

export function Reaction({ story }: { story: GetStoryDto }) {
  const dispatch = useAppDispatch();
  const isLogged = !!useAppSelector(selectUser);
  const [vote, setVote] = useState(story?.history?.vote);

  const changeVoteDebounce = useAutoFlushDebounce(
    (story: GetStoryDto, vote?: VoteType) => {
      dispatch(updateStoryHistoryAsync({ storyId: story.id, vote }));
    },
    1000,
  );

  const changeVote = (targetVote: VoteType) => {
    if (story) {
      const oldVote = vote || "none";
      const newVote = oldVote === targetVote ? "none" : targetVote;
      changeVoteDebounce(story, newVote);
      setVote(newVote);
    }
  };

  return (
    <>
      {story && (
        <div className="reaction-container">
          <VoteButton
            disabled={!isLogged}
            onClick={() => changeVote("upvote")}
            selected={vote === "upvote"}
            icon={<Icon icon="thumbs-up" />}
            count={abbreviateNumber(
              (story.upvote || 0) + (vote === "upvote" ? 1 : 0),
            )}
          />
          <VoteButton
            disabled={!isLogged}
            onClick={() => changeVote("downvote")}
            selected={vote === "downvote"}
            icon={<Icon icon="thumbs-down" />}
            count={abbreviateNumber(
              (story.downvote || 0) + (vote === "downvote" ? 1 : 0),
            )}
          />
        </div>
      )}
    </>
  );
}
