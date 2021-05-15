import { Avatar, Header, Icon, Navbar } from "rsuite";
import logo from "../../images/logo.png";
import React, { useCallback, useEffect, useState } from "react";
import { UserToolbar } from "../UserToolbar";
import { useAppSelector } from "../../app/hooks";
import { selectFixedHeader } from "../../features/settings/settingsSlice";

import "./index.less";
import classNames from "classnames";
import { Fab } from "react-tiny-fab";

export function AppHeader() {
  const fixedHeader = useAppSelector(selectFixedHeader);
  const [showFixedHeader, setShowFixedHeader] = useState(window.scrollY > 0 && fixedHeader);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const handleScroll = () => {
      if (fixedHeader) {
        if (showFixedHeader && window.scrollY <= 0) {
          setShowFixedHeader(false);
        } else if (!showFixedHeader && window.scrollY > 0) {
          setShowFixedHeader(true);
        }
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollDown = scrollTop > lastScrollTop;
      if (isScrollDown) {
        if (!showFab) {
          setShowFab(true);
        }
      } else {
        if (showFab) {
          setShowFab(false);
        }
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showFixedHeader, showFab, fixedHeader]);

  const handleClickFab = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

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
      {showFab && (
        <Fab onClick={handleClickFab} event="click" style={{ bottom: 0, right: 0 }} icon={<Icon icon="up" />} />
      )}
    </>
  );
}
