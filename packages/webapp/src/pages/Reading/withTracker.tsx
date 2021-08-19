import React, { ElementType, useEffect, useMemo } from "react";

export function withTracker(Component: ElementType) {
  return ({ story, ...rest }: any) => {
    const storyId = useMemo(() => story?.id, [story]);

    useEffect(() => {
      if (storyId) {
        navigator.sendBeacon(`/api/tracker?storyId=${storyId}`);
      }
    }, [storyId]);
    return <Component {...rest} story={story} />;
  };
}
