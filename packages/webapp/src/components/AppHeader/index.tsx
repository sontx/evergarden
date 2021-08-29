import { Avatar, Header, Icon, Navbar } from "rsuite";
import logo from "../../images/logo.png";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UserToolbar } from "../UserToolbar";

import "./index.less";
import classNames from "classnames";
import { Fab } from "react-tiny-fab";
import { useHistory, useLocation } from "react-router-dom";

export function AppHeader() {
  const location = useLocation();

  const canShowFixedHeader = useMemo(() => location.pathname === "/", [
    location.pathname,
  ]);
  const canShowBackTopButton = useMemo(
    () => location.pathname === "/" || location.pathname.startsWith("/reading"),
    [location.pathname],
  );
  const canShowHeader = useMemo(
    () => !location.pathname.startsWith("/reading"),
    [location.pathname],
  );

  const [showFixedHeader, setShowFixedHeader] = useState(
    window.scrollY > 0 && canShowFixedHeader,
  );
  const [showFab, setShowFab] = useState(false);

  const history = useHistory();

  useEffect(() => {
    let lastScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    const handleScroll = () => {
      if (canShowFixedHeader) {
        if (showFixedHeader && window.scrollY <= 0) {
          setShowFixedHeader(false);
        } else if (!showFixedHeader && window.scrollY > 0) {
          setShowFixedHeader(true);
        }
      }

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
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
  }, [showFixedHeader, showFab, canShowFixedHeader]);

  const handleClickFab = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const handleClickLogo = useCallback(() => {
    history.push("/");
  }, [history]);

  return (
    <>
      {canShowHeader && (
        <Header className={classNames({ "fixed-header": showFixedHeader })}>
          <Navbar appearance="subtle">
            <Navbar.Header
              onClick={handleClickLogo}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Avatar style={{ margin: "0 10px" }} src={logo} />
              <h4>Evergarden</h4>
            </Navbar.Header>
            <Navbar.Body>
              <UserToolbar />
            </Navbar.Body>
          </Navbar>
        </Header>
      )}
      {showFixedHeader && <div style={{ height: "56px" }} />}
      {showFab && canShowBackTopButton && (
        <Fab
          onClick={handleClickFab}
          event="click"
          mainButtonStyles={{ width: "40px", height: "40px", opacity: 0.5 }}
          style={{ bottom: "40px", right: "10px", margin: 0 }}
          icon={<Icon icon="up" />}
        />
      )}
    </>
  );
}
