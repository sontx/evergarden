import {
  fetchFollowingStoriesAsync,
  selectErrorMessage,
  selectStatus,
  selectStories,
} from "./followingSlice";
import {List, Loader, Message} from "rsuite";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useEffect} from "react";
import {isEmpty} from "../../utils/types";
import {FollowingItem} from "./FollowingItem";
import {useSwipeable} from "react-swipeable";

export function FollowingStories() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
  const stories = useAppSelector(selectStories);

  useEffect(() => {
    dispatch(fetchFollowingStoriesAsync());
  }, [dispatch]);

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
          {(stories || []).map((story) => (
            <List.Item key={story.id} style={{paddingTop: 0, paddingBottom: 0}}>
              <FollowingItem story={story}/>
            </List.Item>
          ))}
        </List>
      )}
    </>
  );
}
