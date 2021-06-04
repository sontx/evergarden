import { ElementType } from "react";
import { GetStoryDto } from "@evergarden/shared";

function PublishSub({ story }: { story: GetStoryDto }) {
  return story.published ? (
    <span style={{ color: "green", fontWeight: "bold" }}>Published</span>
  ) : (
    <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>Unpublished</span>
  );
}

export function withPublishedSub(Component: ElementType) {
  return ({ story, ...rest }: any) => {
    return <Component story={story} {...rest} Sub={PublishSub} />;
  };
}
