import useSpotlightStories from "../hooks/useSpotlightStories";
import { SpotlightList } from "../../../components/SpotlightList";

import "./index.less";

export function SpotlightBanner() {
  const { data } = useSpotlightStories();
  return (
    <div className="spotlight-banner">
      <SpotlightList stories={data} />
    </div>
  );
}
