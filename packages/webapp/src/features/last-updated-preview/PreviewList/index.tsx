import useLastUpdatedStories from "../hooks/useLastUpdatedStories";
import { StoryList } from "../../../components/StoryList";
import {
  NavigateAction,
  StoryListHeader,
} from "../../../components/StoryListHeader";

export function PreviewList() {
  const { data } = useLastUpdatedStories(0);
  return (
    <div>
      <StoryListHeader title="Last updated" subtitle="This is sub" action={<NavigateAction/>}/>
      <StoryList layout="vertical" stories={data} />
    </div>
  );
}
