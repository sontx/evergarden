import {
  fetchFollowingStoriesAsync,
  selectErrorMessage,
  selectStatus,
  selectStories,
} from "./followingSlice";
import { List, Loader, Message } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { isEmpty } from "../../utils/types";
import { FollowingItem } from "./FollowingItem";
import { UserListItemsChildrenProps } from "../../components/UserListItemsPage";
import { GetStoryDto } from "@evergarden/shared";

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

export function FollowingStories({ filter, sort }: UserListItemsChildrenProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
  const stories = useAppSelector(selectStories);
  const [showStories, setShowStories] = useState<GetStoryDto[]>([]);

  useEffect(() => {
    dispatch(fetchFollowingStoriesAsync());
  }, [dispatch]);

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
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <FollowingItem story={story} />
            </List.Item>
          ))}
        </List>
      )}
    </>
  );
}
