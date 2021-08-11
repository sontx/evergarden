import Disqus from "disqus-react";
import {GetStoryDto} from "@evergarden/shared";

export function Comment(props: { story: GetStoryDto, onReady?: () => void }) {
  const { story, onReady } = props;
  return (
    <Disqus.DiscussionEmbed
      shortname="evergarden"
      config={{
        identifier: story.url,
        title: story.title,
        onReady
      }}
    />
  );
}
