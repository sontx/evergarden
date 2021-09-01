import { Fab } from "react-tiny-fab";
import { Icon } from "rsuite";
import React, { useCallback, useEffect, useState } from "react";

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
    let lastScrollTop = container.scrollTop;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const isScrollDown = scrollTop > lastScrollTop;
      setShow(isScrollDown);
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    const scrollElement =
      container === document.documentElement ? document : container;
    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
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
