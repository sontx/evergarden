import useLastUpdatedStories from "../hooks/useLastUpdatedStories";
import { StoryList } from "../../../components/StoryList";
import { SpotlightList } from "../../../components/SpotlightList";

export function PreviewList() {
  const { data } = useLastUpdatedStories(0);
  return (
    <div>
      <SpotlightList stories={data}/>
    </div>
  );
}
