import { Footer, Icon } from "rsuite";

import "./index.less";
import classNames from "classnames";

export function AppFooter({ float }: { float?: boolean }) {
  return (
    <Footer
      className={classNames("app-footer", { "app-footer--float": float })}
    >
      Made with{" "}
      <Icon
        icon="heart"
        style={{ color: "red", marginLeft: "1px", marginRight: "2px" }}
      />{" "}
      by <a href="https://sontx.dev">sontx.dev</a>
    </Footer>
  );
}
