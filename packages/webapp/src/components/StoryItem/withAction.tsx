import { ElementType, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectShowingAction,
  setShowingAction,
} from "../../features/following/followingSlice";
import { useSwipeable } from "react-swipeable";

export function withAction(Component: ElementType) {
  return ({ action, story, onActionClick, ...rest }: any) => {
    const dispatch = useAppDispatch();
    const showingAction = useAppSelector(selectShowingAction);
    const actionRef = useRef<HTMLDivElement>(null);
    const actionPosRef = useRef(0);

    useEffect(() => {
      const ref = actionRef.current;
      if (ref) {
        const timeoutId = window.setTimeout(() => {
          ref.style.right = `${-ref.offsetWidth}px`;
        }, 400);
        return () => window.clearTimeout(timeoutId);
      }
    }, [actionRef]);

    useEffect(() => {
      if (showingAction !== story && actionRef.current) {
        actionRef.current.style.right = `${-actionRef.current.offsetWidth}px`;
      }
    }, [showingAction, story]);

    const handlers = useSwipeable({
      onSwipeStart: () => {
        const actionElement = actionRef.current;
        if (actionElement) {
          actionElement.style.opacity = "1";
          actionPosRef.current = parseInt(actionElement.style.right);
        }
      },
      onSwiping: (eventData) => {
        const actionElement = actionRef.current;
        if (
          actionElement &&
          eventData.initial[0] !== 0 &&
          eventData.initial[1] !== 0
        ) {
          const currentRight = parseInt(actionElement.style.right);
          if (currentRight < 0 || eventData.dir === "Right") {
            const newRight = Math.min(
              actionPosRef.current - eventData.deltaX,
              0,
            );
            actionElement.style.right = `${newRight}px`;
          }
        }
      },
      onSwiped: () => {
        const actionElement = actionRef.current;
        if (actionElement) {
          const shownWidth =
            actionElement.offsetWidth + parseInt(actionElement.style.right);
          if (shownWidth >= actionElement.offsetWidth / 3) {
            actionElement.style.right = "0";
            dispatch(setShowingAction(story));
          } else {
            actionElement.style.right = `${-actionElement.offsetWidth}px`;
            actionElement.style.opacity = "0";
          }
        }
      },
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    });

    return (
      <Component {...rest} story={story} {...handlers} additionPadding>
        <div onClick={onActionClick} className="action" ref={actionRef}>
          {action}
        </div>
      </Component>
    );
  };
}
