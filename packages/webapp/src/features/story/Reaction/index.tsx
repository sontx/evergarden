import { GetStoryDto, VoteType } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { Icon, IconButton } from "rsuite";

import classNames from "classnames";
import { abbreviateNumber } from "../../../utils/types";
import { ReactElement } from "react";
import { useVote } from "../hooks/useVote";
import { withDebouncedClick } from "../../../HOCs/withDebouncedClick";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";

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

const DebouncedVoteButton = withDebouncedClick(VoteButton);

export function Reaction({ story }: { story: GetStoryDto }) {
  const { isLoggedIn } = useIsLoggedIn();
  const { mutate } = useVote(story.url);
  const currentVote = story.history?.vote;

  const changeVote = (targetVote: VoteType) => {
    if (story) {
      const oldVote = story.history?.vote || "none";
      const newVote = oldVote === targetVote ? "none" : targetVote;
      mutate(story, newVote);
    }
  };

  return (
    <>
      {story && (
        <div className="reaction-container">
          <DebouncedVoteButton
            disabled={!isLoggedIn}
            onClick={() => changeVote("upvote")}
            selected={currentVote === "upvote"}
            icon={<Icon icon="thumbs-up" />}
            count={abbreviateNumber(story.upvote)}
          />
          <DebouncedVoteButton
            disabled={!isLoggedIn}
            onClick={() => changeVote("downvote")}
            selected={currentVote === "downvote"}
            icon={<Icon icon="thumbs-down" />}
            count={abbreviateNumber(story.downvote)}
          />
        </div>
      )}
    </>
  );
}
