import useLastUpdatedStories from "../hooks/useLastUpdatedStories";
import { StoryList } from "../../../components/StoryList";

export function PreviewList() {
  const { data } = useLastUpdatedStories(0);
  return (
    <div>
      <StoryList layout="horizontal" stories={data} />
    </div>
  );
}
