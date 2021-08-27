import { forwardRef } from "react";

import "./index.less";
import classNames from "classnames";
import { StandardProps } from "rsuite/es/@types/common";

export namespace CompactStoryItem {
  export const Skeleton = forwardRef(
    ({ className, ...rest }: StandardProps, ref) => {
      return (
        <div
          ref={ref as any}
          className={classNames(
            "story-item--skeleton rs-placeholder rs-placeholder-paragraph",
            className,
          )}
          {...rest}
        >
          <div className="rs-placeholder-paragraph-graph rs-placeholder-paragraph-graph-square">
            <span className="rs-placeholder-paragraph-graph-inner" />
          </div>
          <div className="rs-placeholder-paragraph-rows">
            <p
              style={{ width: "64.4229%", height: "10px", marginTop: "5px" }}
            />
            <p
              style={{ width: "47.1585%", height: "10px", marginTop: "10px" }}
            />
          </div>
        </div>
      );
    },
  );
}
