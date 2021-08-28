import { forwardRef } from "react";
import { StandardProps } from "rsuite/es/@types/common";

import "./index.less";
import classNames from "classnames";

export const Skeleton = forwardRef(
  ({ className, ...rest }: StandardProps, ref) => {
    return (
      <div
        className={classNames(
          "rs-placeholder rs-placeholder-paragraph story-item story-item--horizontal story-item--skeleton",
          className,
        )}
        {...rest}
        ref={ref as any}
      >
        <div className="rs-placeholder-paragraph-graph rs-placeholder-paragraph-graph-square">
          <span className="rs-placeholder-paragraph-graph-inner" />
        </div>
        <div className="rs-placeholder-paragraph-rows">
          <p style={{ width: "100%", height: "0.9125rem", marginTop: 0 }} />
          <p style={{ width: "100%", height: "10px", marginTop: "12px" }} />
          <p style={{ width: "90.4286%", height: "10px", marginTop: "8px" }} />
          <div
            style={{
              marginTop: "22px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                width: "34.4286%",
                height: "10px",
                backgroundColor: "#3c3f43",
              }}
            />
            <p
              style={{
                width: "29.4286%",
                height: "10px",
                backgroundColor: "#3c3f43",
                marginTop: 0,
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);
