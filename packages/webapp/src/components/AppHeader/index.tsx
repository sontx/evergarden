import { Avatar, Header, Navbar } from "rsuite";
import logo from "../../images/logo.png";
import React, { useEffect, useState } from "react";
import { UserToolbar } from "../UserToolbar";
import { useAppSelector } from "../../app/hooks";
import { selectFixedHeader } from "../../features/settings/settingsSlice";

import "./index.less";
import classNames from "classnames";

export function AppHeader() {
  const fixedHeader = useAppSelector(selectFixedHeader);
  const [showFixedHeader, setShowFixedHeader] = useState(window.scrollY > 0 && fixedHeader);
  useEffect(() => {
    if (fixedHeader) {
      const handleScroll = () => {
        if (showFixedHeader && window.scrollY === 0) {
          setShowFixedHeader(false);
        } else if (!showFixedHeader && window.scrollY > 0) {
          setShowFixedHeader(true);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [showFixedHeader, fixedHeader]);

  return (
    <>
      <Header className={classNames({ "fixed-header": showFixedHeader })}>
        <Navbar appearance="subtle">
          <Navbar.Header style={{ display: "flex", alignItems: "center" }}>
            <Avatar style={{ margin: "8px" }} src={logo} />
            <h4>Evergarden</h4>
          </Navbar.Header>
          <Navbar.Body>
            <UserToolbar />
          </Navbar.Body>
        </Navbar>
      </Header>
      {showFixedHeader && <div style={{ height: "56px" }} />}
    </>
  );
}
