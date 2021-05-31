import { Animation, Divider, Icon } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
import moment from "moment";

import "./followingItem.less";
import { useIntl } from "react-intl";
import classNames from "classnames";

import defaultThumbnail from "../../images/logo.png";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import {
  removeStory,
  selectShowingAction,
  setShowingAction,
} from "./followingSlice";
import { openReading } from "../story/storySlice";
import { updateStoryHistoryAsync } from "../history/historySlice";

export function FollowingItem({ story }: { story: GetStoryDto }) {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const showingAction = useAppSelector(selectShowingAction);
  const actionRef = useRef<HTMLDivElement>(null);
  const actionPosRef = useRef(0);
  const [show, setShow] = useState(true);

  const handleClick = useCallback(
    (event) => {
      if (story.history) {
        dispatch(openReading(history, story, story.history.currentChapterNo));
      }
    },
    [dispatch, history, story],
  );

  const handleDelete = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setShow(false);
      dispatch(
        updateStoryHistoryAsync({
          history: {
            storyId: story.id,
            isFollowing: false,
          },
          startReading: false,
        }),
      );
    },
    [dispatch, story],
  );

  const handleExitedAnimation = useCallback(() => {
    dispatch(removeStory(story));
  }, [dispatch, story]);

  useEffect(() => {
    const ref = actionRef.current;
    if (ref) {
      const timeoutId = window.setTimeout(() => {
        ref.style.display = "flex";
        ref.style.right = `${-ref.offsetWidth}px`;
      }, 400);
      return () => window.clearTimeout(timeoutId);
    }
  }, [actionRef, actionRef.current]);

  useEffect(() => {
    if (showingAction !== story && actionRef.current) {
      actionRef.current.style.right = `${-actionRef.current.offsetWidth}px`;
    }
  }, [showingAction, story]);

  const handlers = useSwipeable({
    onSwipeStart: () => {
      const actionElement = actionRef.current;
      if (actionElement) {
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
          const newRight = Math.min(actionPosRef.current - eventData.deltaX, 0);
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
        }
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Animation.Bounce in={show} onExited={handleExitedAnimation}>
      {(props, ref) => (
        <div {...props} ref={ref}>
          <div
            className="following-item-container"
            onClick={handleClick}
            {...handlers}
          >
            <div className="following-item-main">
              <div>
                <img src={story.thumbnail || defaultThumbnail} />
              </div>
              <div>
                <div>{story.title}</div>
                <span className="following-item-sub">
                  {story.updated !== undefined &&
                    moment(story.updated).fromNow()}
                  {story.lastChapter && (
                    <>
                      <Divider vertical={true} />
                      <span
                        className={classNames({
                          "new-unread-chapter":
                            story.history &&
                            story.history.isFollowing &&
                            story.lastChapter > story.history.currentChapterNo,
                        })}
                      >
                        {intl.formatMessage(
                          { id: "chapterTitle" },
                          { chapterNo: story.lastChapter },
                        )}
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>
            {story.history && story.history.currentChapterNo > 0 && (
              <span className="following-item-sub">
                {`Continue ${story.history.currentChapterNo}`}
              </span>
            )}
            <div
              onClick={handleDelete}
              ref={actionRef}
              className="action--delete"
            >
              <Icon icon="trash" />
            </div>
          </div>
        </div>
      )}
    </Animation.Bounce>
  );
}
