import {GetStoryDto} from "@evergarden/shared";
import {ProcessingStatus} from "../../utils/types";

export interface LastUpdatedStoriesState {
  stories: GetStoryDto[];
  status: ProcessingStatus;
  errorMessage?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const initialState: LastUpdatedStoriesState = {
  stories: [],
  status: "none",
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
};
