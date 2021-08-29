import { Avatar, DOMHelper, Header, Navbar } from "rsuite";
import logo from "../../images/logo.png";
import React, { useEffect } from "react";
import { UserToolbar } from "../UserToolbar";

import "./index.less";
import { Link } from "react-router-dom";
import classNames from "classnames";

export function AppHeader({ fixedHeader }: { fixedHeader?: boolean }) {
  useEffect(() => {
    if (fixedHeader) {
      const header = document.getElementsByClassName("app-header").item(0);
      const handleScroll = () => {
        if (header) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > 0) {
            DOMHelper.addClass(header, "app-header--float");
          } else {
            DOMHelper.removeClass(header, "app-header--float");
          }
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [fixedHeader]);
  return (
    <>
      <Header
        className={classNames("app-header", {
          "app-header--fixed": fixedHeader,
        })}
      >
        <Navbar appearance="subtle">
          <Link to={{ pathname: "/" }}>
            <Navbar.Header style={{ display: "flex", alignItems: "center" }}>
              <Avatar style={{ margin: "0 10px" }} src={logo} />
              <h4>Evergarden</h4>
            </Navbar.Header>
          </Link>
          <Navbar.Body>
            <UserToolbar />
          </Navbar.Body>
        </Navbar>
      </Header>
      {fixedHeader && <div className="app-header--dummy" />}
    </>
  );
}
