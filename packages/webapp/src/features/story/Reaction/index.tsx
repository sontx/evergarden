import { GetStoryDto, VoteType } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { Icon, IconButton } from "rsuite";

import classNames from "classnames";
import { abbreviateNumber } from "../../../utils/types";
import { useAppSelector } from "../../../app/hooks";
import { ReactElement, useState } from "react";
import { useAutoFlushDebounce } from "../../../hooks/useAutoFlushDebounce";
import { selectUser } from "../../user/userSlice";
import { useVote } from "../hooks/useVote";

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
  const isLogged = !!useAppSelector(selectUser);
  const [vote, setVote] = useState(story?.history?.vote);
  const { mutate } = useVote();

  const changeVoteDebounce = useAutoFlushDebounce(
    (story: GetStoryDto, vote: VoteType, voteAction) => {
      voteAction(story.id, vote);
    },
    1000,
  );

  const changeVote = (targetVote: VoteType) => {
    if (story) {
      const oldVote = vote || "none";
      const newVote = oldVote === targetVote ? "none" : targetVote;
      changeVoteDebounce(story, newVote, mutate);
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
