import { Avatar } from "rsuite";
import logo from "../../../images/logo.png";
import { Link } from "react-router-dom";
import React from "react";

import "./index.less";

export function AppLogo() {
  return (
    <Link to={{ pathname: "/" }} className="app-logo no-link">
      <Avatar src={logo} />
      <h4>Evergarden</h4>
    </Link>
  );
}
