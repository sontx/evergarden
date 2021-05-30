import {VoteType} from "./common-types";

export function randomNumberString(length: number): string {
  const result = [];
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join('');
}

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

export function toInt(st: any): number {
  if (typeof st === "string" && st) {
    const num = parseInt(st);
    if (isNaN(num)) {
      throw new Error(`${st} is not a valid number`);
    }
    return num;
  }
  return st;
}
