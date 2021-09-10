import { GetStoryDtoEx } from "../../index.api";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import moment from "moment";

export function UpdatedTime({
  story,
  className,
  ...rest
}: { story: GetStoryDtoEx } & StandardProps) {
  return (
    <span className={classNames(className, "updated-time")} {...rest}>
      {moment(story.updated).fromNow()}
    </span>
  );
}
