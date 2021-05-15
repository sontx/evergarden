import { List } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchLastUpdatedStoriesAsync,
  selectCurrentPage,
  selectLimitCount,
  selectStories,
} from "./lastUpdatedStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import { useEffect } from "react";

export function LastUpdatedStories() {
  const stories = useAppSelector(selectStories);
  const currentPage = useAppSelector(selectCurrentPage);
  const limitCount = useAppSelector(selectLimitCount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLastUpdatedStoriesAsync({ page: currentPage, limit: limitCount }));
  }, [currentPage, limitCount]);

  return (
    <List hover size="sm">
      {stories.map((story) => (
        <List.Item key={story.id}>
          <StoryItem story={story} />
        </List.Item>
      ))}
    </List>
  );
}
