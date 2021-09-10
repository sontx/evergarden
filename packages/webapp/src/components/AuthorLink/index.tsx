import { Icon } from "rsuite";
import { Link } from "react-router-dom";
import { GetStoryDto } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";

export function AuthorLink({
  story,
  ...rest
}: StandardProps & { story: GetStoryDto }) {
  return story.authors && story.authors.length > 0 ? (
    <Link {...rest} to={{ pathname: `/author/${story.authors[0].id}` }}>
      <Icon icon="user" />
      {story.authors[0].name}
    </Link>
  ) : (
    <></>
  );
}
