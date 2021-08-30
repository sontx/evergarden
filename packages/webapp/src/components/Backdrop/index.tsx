import React from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

import "./index.less";

export function Backdrop({
  className,
  noHeader,
  ...rest
}: StandardProps & { noHeader?: boolean }) {
  return (
    <div
      className={classNames(
        className,
        "rs-modal-backdrop backdrop backdrop-container",
        { "backdrop-container--noHeader": noHeader },
      )}
      {...rest}
    />
  );
}
