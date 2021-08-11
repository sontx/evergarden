import Disqus from "disqus-react";
import {GetStoryDto} from "@evergarden/shared";

export function CommentCount(props: { story: GetStoryDto }) {
  const { story } = props;
  return (
    <Disqus.CommentCount
      shortname="evergarden"
      config={{
        identifier: story.url,
        title: story.title,
      }}
    />
  );
}
