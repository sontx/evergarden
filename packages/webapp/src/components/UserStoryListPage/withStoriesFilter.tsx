import { ElementType, useEffect, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { StoryListProps } from "../StoryList";
import { SortType } from "./index";
import { useStoriesHistory } from "../../features/histories/hooks/useStoriesHistory";

function sortRecent(item1: GetStoryDto, item2: GetStoryDto) {
  return item2.history && item1.history
    ? (new Date(item2.history.lastVisit) as any) -
        (new Date(item1.history.lastVisit) as any)
    : 0;
}

export function withStoriesFilter(Component: ElementType<StoryListProps>) {
  return ({
    sort,
    sortFn = sortRecent,
    filter,
    stories: passStories,
    ...rest
  }: {
    sort?: SortType;
    filter?: string;
    sortFn?: (item1: GetStoryDto, item2: GetStoryDto) => number;
  } & StoryListProps) => {
    const [showStories, setShowStories] = useState<GetStoryDto[]>();
    const stories = useStoriesHistory(passStories);

    useEffect(() => {
      if (!stories) {
        return;
      }

      let temp: GetStoryDto[];
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
            temp.sort(sortFn);
            break;
          case "recent":
            temp.sort((item1, item2) => -sortFn(item1, item2));
            break;
        }
      }
      setShowStories(temp);
    }, [filter, sort, sortFn, stories]);

    return <Component stories={showStories} {...rest} />;
  };
}
