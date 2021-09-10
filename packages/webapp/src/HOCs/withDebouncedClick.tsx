import { ElementType, useCallback, useEffect, useRef } from "react";
import { debouncedClick } from "../utils/debouncedClick";
import { StandardProps } from "rsuite/es/@types/common";

export function withDebouncedClick(Component: ElementType) {
  return ({
    onClick,
    debouncedClickInterval = 1000,
    ...rest
  }: {
    onClick?: () => void;
    debouncedClickInterval?: number;
  } & StandardProps) => {
    const passClick = useRef<any>();
    const debounceRef = useRef<any>();

    useEffect(() => {
      passClick.current = onClick;
    }, [onClick]);

    useEffect(() => {
      debounceRef.current = debouncedClick((event) => {
        if (passClick.current) {
          passClick.current(event);
        }
      }, debouncedClickInterval);
    }, [debouncedClickInterval]);

    const handleClick = useCallback((event) => {
      if (debounceRef.current) {
        debounceRef.current(event);
      }
    }, []);

    return <Component {...rest} onClick={handleClick} />;
  };
}
