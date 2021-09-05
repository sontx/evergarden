import { ElementType, useEffect, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { StoryListProps } from "../components/StoryList";

export type SortType = "none" | "new" | "recent" | "a-z" | "z-a";

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

export function withStoriesFilter(Component: ElementType<StoryListProps>) {
  return ({
    sort,
    filter,
    stories,
    ...rest
  }: {
    sort?: SortType;
    filter?: string;
  } & StoryListProps) => {
    const [showStories, setShowStories] = useState<GetStoryDto[]>();

    useEffect(() => {
      if (!stories) {
        return;
      }

      let temp;
      if (filter) {
        const filterValue = filter.toLowerCase();
        temp = stories.filter((item: GetStoryDto) =>
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
    }, [filter, sort, stories]);

    return <Component stories={showStories} {...rest} />;
  };
}