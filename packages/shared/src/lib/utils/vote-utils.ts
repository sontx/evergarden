import { VoteType } from '../story';

export function calculateVoteCount(
  oldVote: VoteType,
  newVote: VoteType
): { upvote: number; downvote: number } | null {
  if (oldVote === newVote) {
    return null;
  }

  switch (newVote) {
    case 'upvote':
      if (oldVote === 'downvote') {
        return { upvote: 1, downvote: -1 };
      } else {
        return { upvote: 1, downvote: 0 };
      }
    case 'downvote':
      if (oldVote === 'upvote') {
        return { upvote: -1, downvote: 1 };
      } else {
        return { downvote: 1, upvote: 0 };
      }
    default:
      switch (oldVote) {
        case 'upvote':
          return { upvote: -1, downvote: 0 };
        case 'downvote':
          return { downvote: -1, upvote: 0 };
      }
  }

  return null;
}
