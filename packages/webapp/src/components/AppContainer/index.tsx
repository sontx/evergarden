import React, { ReactNode } from "react";
import { Container } from "rsuite";
import { StandardProps } from "rsuite/es/@types/common";

import "./firefly.less";
import { useAppSelector } from "../../app/hooks";
import { selectIsShowingOverlay } from "../../features/global/globalSlice";
import { BackTop } from "../BackTop";
import { useIsDarkMode } from "../../features/global/hooks/useIsDarkMode";

export function AppContainer({
  children,
  backgroundEffect,
  showBackTop,
  ...rest
}: {
  children: ReactNode;
  backgroundEffect?: boolean;
  showBackTop?: boolean;
} & StandardProps) {
  const isShowingOverlay = useAppSelector(selectIsShowingOverlay);
  const { isDarkMode } = useIsDarkMode();

  return (
    <Container style={{ minHeight: "100vh" }} {...rest}>
      {children}
      {backgroundEffect && !isShowingOverlay && isDarkMode && (
        <div>
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
        </div>
      )}
      {showBackTop && !isShowingOverlay && <BackTop />}
    </Container>
  );
}
