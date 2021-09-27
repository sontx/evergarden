import { VoteType } from '../story/vote-type';

export interface GetReadingHistoryDto {
  id: number;
  storyId: number;
  currentChapterNo: number;
  started: Date;
  lastVisit: Date;
  currentReadingPosition?: number;
  vote: VoteType;
  isFollowing: boolean;
}
