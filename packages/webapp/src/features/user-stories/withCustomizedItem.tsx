import { ElementType } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { Divider, Icon } from "rsuite";

function PublishSub({ story }: { story: GetStoryDto }) {
  return story.published ? (
    <span style={{ color: "green", fontWeight: "bold" }}>Published</span>
  ) : (
    <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>Unpublished</span>
  );
}

function BottomSub({ story }: { story: GetStoryDto }) {
  return (
    <>
      <span>
        {story.view} <Icon icon="eye" />
      </span>
      <Divider vertical={true} />
      <span>
        {story.upvote} <Icon icon="thumbs-up" />
      </span>
      <Divider vertical={true} />
      <span>
        {story.downvote} <Icon icon="thumbs-down" />
      </span>
    </>
  );
}

export function withCustomizedItem(Component: ElementType) {
  return ({ story, ...rest }: any) => {
    return (
      <Component
        story={story}
        {...rest}
        RightSub={PublishSub}
        BottomSub={BottomSub}
      />
    );
  };
}
