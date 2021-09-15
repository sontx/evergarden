import { Fab } from "react-tiny-fab";
import { Icon } from "rsuite";
import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { subscribeVerticalScrollDirection } from "../../utils/subscribe-vertical-scroll-direction";

export function BackTop({
  containerElement,
}: {
  containerElement?: HTMLElement | null;
}) {
  const container = containerElement || document.documentElement;
  const containerRef = useRef<HTMLElement>();

  const handleClick = useCallback(() => {
    container.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [container]);

  useLayoutEffect(() => {
    containerRef.current = document.querySelector(
      "ul[data-testid='fab']",
    ) as HTMLElement;
    if (containerRef.current) {
      containerRef.current.style.display = "none";
    }
  }, []);

  useEffect(() => {
    return subscribeVerticalScrollDirection(({ isDown }) => {
      if (containerRef.current) {
        containerRef.current.style.display = isDown ? "unset" : "none";
      }
    });
  }, [container]);

  return (
    <Fab
      onClick={handleClick}
      event="click"
      mainButtonStyles={{ width: "40px", height: "40px", opacity: 0.5 }}
      style={{ bottom: "40px", right: "10px", margin: 0 }}
      icon={<Icon icon="up" />}
    />
  );
}
