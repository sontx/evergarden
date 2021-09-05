import { Fab } from "react-tiny-fab";
import { Icon } from "rsuite";
import React, { useCallback, useEffect, useState } from "react";
import { subscribeVerticalScrollDirection } from "../../utils/subscribe-vertical-scroll-direction";

export function BackTop({
  containerElement,
}: {
  containerElement?: HTMLElement | null;
}) {
  const [show, setShow] = useState(false);
  const container = containerElement || document.documentElement;

  const handleClick = useCallback(() => {
    container.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [container]);

  useEffect(() => {
    return subscribeVerticalScrollDirection(({ isDown }) => {
      setShow(isDown);
    });
  }, [container]);

  return (
    <>
      {show && (
        <Fab
          onClick={handleClick}
          event="click"
          mainButtonStyles={{ width: "40px", height: "40px", opacity: 0.5 }}
          style={{ bottom: "40px", right: "10px", margin: 0 }}
          icon={<Icon icon="up" />}
        />
      )}
    </>
  );
}
