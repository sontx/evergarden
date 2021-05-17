import Disqus from "disqus-react";
import {GetStoryDto} from "@evergarden/shared";

export function Comment(props: { story: GetStoryDto }) {
  const { story } = props;
  return (
    <Disqus.DiscussionEmbed
      shortname="evergarden"
      config={{
        identifier: story.id as string,
        title: story.title,
      }}
    />
  );
}
