import useSpotlightStories from "../hooks/useSpotlightStories";
import { SpotlightList } from "../../../components/SpotlightList";
import { useGoStory } from "../../../hooks/navigation/useGoStory";

export function SpotlightBanner() {
  const { data } = useSpotlightStories();
  const gotoStory = useGoStory();
  return (
    <div className="spotlight-banner">
      <SpotlightList stories={data} onClick={gotoStory} />
    </div>
  );
}
