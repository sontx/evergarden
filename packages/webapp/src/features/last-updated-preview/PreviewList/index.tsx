import { withAnimation } from "../../../components/StoryList/StoryItem/withAnimation";
import { StoryItem } from "../../../components/StoryList/StoryItem";
import { withHistory } from "../../../components/StoryList/StoryItem/withHistory";
import { useAppSelector } from "../../../app/hooks";
import { selectIsLoggedIn } from "../../user/userSlice";
import { selectStories } from "../previewLastUpdated";
import { StoryList } from "../../../components/StoryList";

const GuestStoryItem = withAnimation(StoryItem);
const UserStoryItem = withHistory(GuestStoryItem);

export function PreviewList() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const stories = useAppSelector(selectStories);
  const RenderItem = isLoggedIn ? UserStoryItem : GuestStoryItem;
  return <StoryList stories={stories} layout="infinite" renderItem={story => <RenderItem story={story}/>}/>
}
