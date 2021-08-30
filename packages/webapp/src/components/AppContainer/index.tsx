import React, { ReactNode } from "react";
import { Container } from "rsuite";
import { StandardProps } from "rsuite/es/@types/common";

import "./firefly.less";
import { useAppSelector } from "../../app/hooks";
import {
  selectShowMenu,
  selectShowSearchBox,
} from "../../features/settings/settingsSlice";

export function AppContainer(
  props: { children: ReactNode; backgroundEffect?: boolean } & StandardProps,
) {
  const { children, backgroundEffect, ...rest } = props;
  const showSearchBox = useAppSelector(selectShowSearchBox);
  const showMenu = useAppSelector(selectShowMenu);
  const isOverlayShown = showSearchBox || showMenu;
  return (
    <Container style={{ minHeight: "100vh" }} {...rest}>
      {props.children}
      {backgroundEffect && !isOverlayShown && (
        <>
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
        </>
      )}
    </Container>
  );
}
