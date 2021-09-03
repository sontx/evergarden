import { GetStoryDto } from "@evergarden/shared";
import { UserListItemsChildrenProps } from "../UserListStoriesPage";
import { ElementType, ReactNode, useEffect, useState } from "react";
import { ProcessingStatus } from "../../utils/types";
import { StoryList } from "../StoryList";
import { GetStoryDtoEx } from "../StoryItem/index.api";

function sortNew(item1: GetStoryDto, item2: GetStoryDto) {
  // @ts-ignore
  return new Date(item2.updated) - new Date(item1.updated);
}

function sortRecent(item1: GetStoryDto, item2: GetStoryDto) {
  return item2.history && item1.history
    ? (new Date(item2.history.lastVisit) as any) -
        (new Date(item1.history.lastVisit) as any)
    : 0;
}

function sortAZ(item1: GetStoryDto, item2: GetStoryDto) {
  return item1.title.toLowerCase().localeCompare(item2.title.toLowerCase());
}

function sortZA(item1: GetStoryDto, item2: GetStoryDto) {
  return item2.title.toLowerCase().localeCompare(item1.title.toLowerCase());
}

export function UserListStories({
  filter,
  sort,
  stories,
  skeletonCount = 10,
  renderItem,
  renderSkeleton,
}: UserListItemsChildrenProps & {
  StoryItem?: ElementType;
  stories?: GetStoryDto[];
  status?: ProcessingStatus;
  errorMessage?: string;
  hasAction?: boolean;
  skeletonCount?: number;
  renderItem?: (story: GetStoryDtoEx) => ReactNode;
  renderSkeleton?: () => ReactNode;
}) {
  const [showStories, setShowStories] = useState<GetStoryDto[]>([]);

  useEffect(() => {
    if (stories) {
      let temp;
      if (filter) {
        const filterValue = filter.toLowerCase();
        temp = stories.filter((item) =>
          item.title.toLowerCase().includes(filterValue),
        );
      } else {
        temp = [...stories];
      }

      if (sort) {
        switch (sort) {
          case "new":
            temp.sort(sortNew);
            break;
          case "recent":
            temp.sort(sortRecent);
            break;
          case "a-z":
            temp.sort(sortAZ);
            break;
          case "z-a":
            temp.sort(sortZA);
            break;
        }
      }
      setShowStories(temp);
    }
  }, [filter, sort, stories]);

  return (
    <StoryList
      layout="vertical"
      stories={stories ? showStories : undefined}
      skeletonCount={skeletonCount}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
    />
  );
}
