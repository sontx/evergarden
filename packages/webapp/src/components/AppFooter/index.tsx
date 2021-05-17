import { Footer, Icon } from "rsuite";

import "./index.less";

export function AppFooter() {
  return (
    <Footer className="app-footer">
      Made with{" "}
      <Icon
        icon="heart"
        style={{ color: "red", marginLeft: "1px", marginRight: "2px" }}
      />{" "}
      by <a href="https://sontx.dev">sontx.dev</a>
    </Footer>
  );
}
