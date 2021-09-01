import React, { ReactNode } from "react";
import { Container } from "rsuite";
import { StandardProps } from "rsuite/es/@types/common";

import "./firefly.less";
import { useAppSelector } from "../../app/hooks";
import { selectIsShowingOverlay } from "../../features/global/globalSlice";

export function AppContainer(
  props: { children: ReactNode; backgroundEffect?: boolean } & StandardProps,
) {
  const { children, backgroundEffect, ...rest } = props;
  const isShowingOverlay = useAppSelector(selectIsShowingOverlay);

  return (
    <Container style={{ minHeight: "100vh" }} {...rest}>
      {props.children}
      {backgroundEffect && !isShowingOverlay && (
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
