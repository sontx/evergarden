import { ElementType } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { Divider, Icon } from "rsuite";
import { PublishSub } from "../../components/PublishSub";

function BottomSub({ story }: { story: GetStoryDto }) {
  return (
    <div style={{ marginTop: "3px" }}>
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
    </div>
  );
}

export function withCustomizedItem(Component: ElementType) {
  return ({ story, ...rest }: any) => {
    return (
      <Component
        story={story}
        {...rest}
        RightSub={({ story }: { story: GetStoryDto }) => (
          <PublishSub published={story.published} />
        )}
        BottomSub={BottomSub}
      />
    );
  };
}
