import { forwardRef } from "react";

import classNames from "classnames";
import { StandardProps } from "rsuite/es/@types/common";

export const Skeleton = forwardRef(
  ({ className, ...rest }: StandardProps, ref) => {
    return (
      <div
        ref={ref as any}
        className={classNames(
          "story-item--skeleton rs-placeholder rs-placeholder-paragraph story-item--compact story-item",
          className,
        )}
        {...rest}
      >
        <div className="rs-placeholder-paragraph-graph rs-placeholder-paragraph-graph-square">
          <span className="rs-placeholder-paragraph-graph-inner" />
        </div>
        <div className="rs-placeholder-paragraph-rows">
          <p
            style={{ width: "64.4229%", height: "10px", marginTop: "3px" }}
          />
          <p
            style={{ width: "47.1585%", height: "10px", marginTop: "12px" }}
          />
        </div>
      </div>
    );
  },
);
