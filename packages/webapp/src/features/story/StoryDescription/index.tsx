// @ts-ignore
import ShowMoreText from "react-show-more-text";
import { FormattedMessage } from "react-intl";
import { GetStoryDto } from "@evergarden/shared";

export function StoryDescription({ story }: { story: GetStoryDto }) {
  return (
    <div className="story-description">
      <ShowMoreText
        more={<FormattedMessage id="showMore" />}
        lines={7}
        less={<FormattedMessage id="showLess" />}
        expanded={false}
      >
        {story.description}
      </ShowMoreText>
    </div>
  );
}
