import { Fab } from "react-tiny-fab";
import { Icon } from "rsuite";
import React, { useCallback, useEffect, useState } from "react";

export function BackTop() {
  const [show, setShow] = useState(false);

  const handleClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const doc = document.documentElement;
    let lastScrollTop = window.pageYOffset || doc.scrollTop;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || doc.scrollTop;
      const isScrollDown = scrollTop > lastScrollTop;
      setShow(isScrollDown);
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
