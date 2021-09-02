import { GetStoryDto } from "@evergarden/shared";
import { UserListItemsChildrenProps } from "../UserListStoriesPage";
import { ElementType, useEffect, useState } from "react";
import { List, Message } from "rsuite";
import { isEmpty, ProcessingStatus } from "../../utils/types";
import { useStoriesHistories } from "../../features/histories/useStoriesHistories";
import { StoryListLoading } from "../StoryListLoading";

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
  StoryItem,
  stories,
  hasAction,
  status,
  errorMessage,
}: UserListItemsChildrenProps & {
  StoryItem: ElementType;
  stories: GetStoryDto[];
  status?: ProcessingStatus;
  errorMessage?: string;
  hasAction?: boolean;
}) {
  const storiesWithHistories = useStoriesHistories(stories);
  const [showStories, setShowStories] = useState<GetStoryDto[]>([]);

  useEffect(() => {
    if (storiesWithHistories) {
      let temp;
      if (filter) {
        const filterValue = filter.toLowerCase();
        temp = storiesWithHistories.filter((item) =>
          item.title.toLowerCase().includes(filterValue),
        );
      } else {
        temp = [...storiesWithHistories];
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
  }, [filter, sort, storiesWithHistories]);

  return (
    <>
      {status === "error" && (
        <Message
          type="error"
          description={errorMessage || "Error while fetching data"}
        />
      )}
      {status === "processing" && isEmpty(storiesWithHistories) ? (
        <StoryListLoading min={3} max={7} />
      ) : (
        <List>
          {(showStories || []).map((story) => (
            <List.Item
              key={story.id}
              style={hasAction ? { paddingTop: 0, paddingBottom: 0 } : {}}
            >
              <StoryItem story={story} />
            </List.Item>
          ))}
        </List>
      )}
    </>
  );
}
