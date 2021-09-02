import useSpotlightStories from "../hooks/useSpotlightStories";
import { SpotlightList } from "../../../components/SpotlightList";

export function SpotlightBanner() {
  const { data } = useSpotlightStories();
  return (
    <div className="spotlight-banner">
      <SpotlightList stories={data} />
    </div>
  );
}
