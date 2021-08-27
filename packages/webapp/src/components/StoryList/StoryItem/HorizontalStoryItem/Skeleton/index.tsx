import { forwardRef } from "react";
import { StandardProps } from "rsuite/es/@types/common";

import "./index.less";
import classNames from "classnames";

export namespace HorizontalStoryItem {
  export const Skeleton = forwardRef(
    ({ className, ...rest }: StandardProps, ref) => {
      return (
        <div
          className={classNames(
            "rs-placeholder rs-placeholder-paragraph story-item--skeleton",
            className,
          )}
          {...rest}
          ref={ref as any}
        >
          <div
            className="rs-placeholder-paragraph-graph rs-placeholder-paragraph-graph-square"
            style={{ width: "66px", height: "88px", marginRight: "8px" }}
          >
            <span className="rs-placeholder-paragraph-graph-inner" />
          </div>
          <div className="rs-placeholder-paragraph-rows">
            <p
              style={{ width: "100%", height: "0.9125rem", marginTop: 0 }}
            />
            <p style={{ width: "100%", height: "10px", marginTop: "11px" }} />
            <p
              style={{ width: "90.4286%", height: "10px", marginTop: "5px" }}
            />
            <p
              style={{ width: "47.4286%", height: "10px", marginTop: "5px" }}
            />
            <div
              style={{
                marginTop: "11px",
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
}
