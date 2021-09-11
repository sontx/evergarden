import { Header, Navbar } from "rsuite";
import React, { useEffect } from "react";

import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { AppLogo } from "./AppLogo";
import { Toolbar } from "./Toolbar";
import {
  selectIsFloatingHeader,
  setFloatingHeader,
} from "../../features/global/globalSlice";

export function AppHeader({ fixedHeader }: { fixedHeader?: boolean }) {
  const dispatch = useAppDispatch();
  const isFloatingHeader = useAppSelector(selectIsFloatingHeader);

  useEffect(() => {
    return () => {
      dispatch(setFloatingHeader(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (fixedHeader) {
      const scrollTop = () =>
        window.pageYOffset || document.documentElement.scrollTop;
      dispatch(setFloatingHeader(scrollTop() > 0));
      const handleScroll = () => {
        dispatch(setFloatingHeader(scrollTop() > 0));
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [dispatch, fixedHeader]);

  return (
    <>
      <Header
        className={classNames("app-header", {
          "app-header--fixed": fixedHeader,
          "app-header--float": isFloatingHeader,
        })}
      >
        <Navbar appearance="subtle">
          <Navbar.Header>
            <AppLogo />
          </Navbar.Header>
          <Navbar.Body>
            <Toolbar />
          </Navbar.Body>
        </Navbar>
      </Header>
      {fixedHeader && <div className="app-header--dummy" />}
    </>
  );
}
