import { forwardRef } from "react";
import { StandardProps } from "rsuite/es/@types/common";

import classNames from "classnames";

export const Skeleton = forwardRef(
  ({ className, ...rest }: StandardProps, ref) => {
    return (
      <div
        className={classNames(
          "rs-placeholder rs-placeholder-paragraph story-item story-item--vertical story-item--skeleton",
          className,
        )}
        ref={ref as any}
        style={{
          display: "block",
          maxWidth: "min-content",
        }}
      >
        <div className="rs-placeholder-paragraph-graph rs-placeholder-paragraph-graph-square">
          <span className="rs-placeholder-paragraph-graph-inner" />
        </div>
        <div className="rs-placeholder-paragraph-rows">
          <p style={{ width: "100%", height: ".8125rem", marginTop: "10px" }} />
          <p
            style={{
              width: "65.3116%",
              height: ".8125rem",
              marginTop: "5px",
            }}
          />
        </div>
      </div>
    );
  },
);
