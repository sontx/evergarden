import React, { ReactNode } from "react";
import { Container } from "rsuite";
import { StandardProps } from "rsuite/es/@types/common";

import "./firefly.less";

export function AppContainer(
  props: { children: ReactNode; backgroundEffect?: boolean } & StandardProps,
) {
  const { children, backgroundEffect, ...rest } = props;
  return (
    <Container style={{ minHeight: "100vh" }} {...rest}>
      {props.children}
      {backgroundEffect && (
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
