import { Reaction } from "../Reaction";
import { useIntl } from "react-intl";
import { GetStoryDto } from "@evergarden/shared";

export function StorySubtitle({story}: {story: GetStoryDto}) {
  const intl = useIntl();
  return (
    <div className="story-subtitle">
      <span>
        {intl.formatNumber(story.view)} readings |{" "}
        {intl.formatDate(story.created)}
      </span>
      <Reaction story={story} />
    </div>
  );
}
