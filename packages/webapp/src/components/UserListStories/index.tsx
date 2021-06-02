import { GetStoryDto } from "@evergarden/shared";
import { UserListItemsChildrenProps } from "../UserListStoriesPage";
import { useAppSelector } from "../../app/hooks";
import {
  selectErrorMessage,
  selectStatus,
} from "../../features/recent/recentSlice";
import { ElementType, useEffect, useState } from "react";
import { List, Loader, Message } from "rsuite";
import { isEmpty } from "../../utils/types";

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
}: UserListItemsChildrenProps & {
  StoryItem: ElementType;
  stories: GetStoryDto[];
  hasAction?: boolean;
}) {
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
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
    <>
      {status === "error" && (
        <Message
          type="error"
          description={errorMessage || "Error while fetching data"}
        />
      )}
      {status === "processing" && isEmpty(stories) ? (
        <Loader center />
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
