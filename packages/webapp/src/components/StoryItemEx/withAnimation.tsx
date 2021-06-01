import { ElementType, useEffect, useState } from "react";
import { Animation } from "rsuite";

export function withAnimation(Component: ElementType) {
  return ({ onExitedAnimation, showHandler, ...rest }: any) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
      if (showHandler) {
        showHandler((doShow: boolean) => {
          setShow(doShow);
        });
        return () => showHandler(undefined);
      }
    }, [showHandler]);

    return (
      <Animation.Bounce in={show} onExited={onExitedAnimation}>
        {(props, ref) => (
          <div {...props} ref={ref}>
            <Component {...rest} />
          </div>
        )}
      </Animation.Bounce>
    );
  };
}
