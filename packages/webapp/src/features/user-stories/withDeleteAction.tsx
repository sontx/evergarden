import {
  ElementType,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { withAction } from "../../components/StoryItemEx/withAction";
import { withAnimation } from "../../components/StoryItemEx/withAnimation";
import { Button, Icon, Loader, Message, Modal } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import "./withDeleteAction.less";
import {
  deleteUserStoryAsync,
  resetStatus,
  selectStatus,
} from "./userStoriesSlice";

export function withDeleteAction(Component: ElementType) {
  const Wrapper = withAnimation(withAction(Component));

  return ({ story, ...rest }: any) => {
    const dispatch = useAppDispatch();
    const showHandlerRef =
      useRef<((show: boolean) => void) | undefined>(undefined);
    const [showConfirm, setShowConfirm] = useState(false);
    const status = useAppSelector(selectStatus);

    useEffect(() => {
      if (showConfirm && status !== "processing" && status !== "none") {
        setShowConfirm(false);
        if (showHandlerRef.current) {
          showHandlerRef.current(false);
        }
      }
    }, [status, showConfirm]);

    const handleDelete = useCallback(() => {
      dispatch(deleteUserStoryAsync(story.id));
    }, [dispatch, story]);

    const handleAskForDeleting = useCallback(
      (event: SyntheticEvent) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(resetStatus());
        setShowConfirm(true);
      },
      [dispatch],
    );

    const showHandler = useCallback((handler) => {
      showHandlerRef.current = handler;
    }, []);

    const handleClose = useCallback(() => {
      setShowConfirm(false);
    }, []);

    return (
      <>
        <Wrapper
          {...rest}
          story={story}
          action={
            <div className="with-delete-action">
              <Icon icon="trash" />
            </div>
          }
          onActionClick={handleAskForDeleting}
          showHandler={showHandler}
        />
        <Modal
          className="model--mobile delete-user-story-confirm-dialog"
          backdrop={true}
          show={showConfirm}
          onHide={handleClose}
          size="xs"
        >
          <Modal.Body style={{ lineHeight: "1.35em" }}>
            <Icon
              icon="remind"
              style={{
                color: "#ffb300",
                fontSize: 18,
                marginRight: "5px",
              }}
            />
            <span>
              Delete <strong>{story.title}</strong>?
            </span>
            <span className="delete-warning">
              All your story and its chapters will be deleted forever!
            </span>
          </Modal.Body>
          <Modal.Footer>
            <Button
              loading={status === "processing"}
              disabled={status === "processing"}
              style={{ background: "red" }}
              onClick={handleDelete}
              appearance="primary"
            >
              Delete
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
}
