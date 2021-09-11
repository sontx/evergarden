import { Button, Modal } from "rsuite";

import * as React from "react";
import { ReactNode, useCallback, useState } from "react";
import {
  AnimationEventProps,
  StandardProps,
  TypeAttributes,
} from "rsuite/lib/@types/common";

import classNames from "classnames";
import ReactDOM from "react-dom";

interface EnhancedModalProps extends StandardProps, AnimationEventProps {
  show?: boolean;
  onHide?: (event: React.SyntheticEvent) => void;
  size?: TypeAttributes.Size;
  icon?: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  mobile?: boolean;
  center?: boolean;
  backdropClose?: boolean;
}

export function EnhancedModal({
  icon,
  className,
  children,
  title,
  actions,
  mobile,
  center,
  backdropClose,
  ...rest
}: EnhancedModalProps) {
  return (
    <Modal
      backdrop={backdropClose ? true : "static"}
      {...rest}
      className={classNames(className, "enhanced-modal", {
        "enhanced-modal--mobile": mobile,
        "enhanced-modal--center": center,
      })}
    >
      {title && (
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {icon && <span className="modal-icon">{icon}</span>}
        {children}
      </Modal.Body>
      {actions && <Modal.Footer>{actions}</Modal.Footer>}
    </Modal>
  );
}

type OpenModalOptions = Omit<
  EnhancedModalProps,
  "actions" | "show" | "onHide" | "children"
> & {
  message: ReactNode;
  ok?: ReactNode;
  close?: ReactNode;
  onOk?: () => void;
  onClose?: () => void;
};

function EnhancedModalWrapper({
  onOk,
  onClose,
  ok,
  close,
  message,
  ...rest
}: OpenModalOptions) {
  const [show, setShow] = useState(true);
  const handleOk = useCallback(() => {
    if (onOk) {
      onOk();
    }
    if (onClose) {
      onClose();
    }
    setShow(false);
  }, [onClose, onOk]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setShow(false);
  }, [onClose]);

  return (
    <EnhancedModal
      {...rest}
      show={show}
      onHide={() => setShow(false)}
      actions={
        <>
          <Button onClick={handleOk} appearance="primary">
            {ok || "OK"}
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            {close || "Close"}
          </Button>
        </>
      }
    >
      {message}
    </EnhancedModal>
  );
}

export function openModal(options: OpenModalOptions) {
  const root = document.getElementById("root");
  if (root) {
    const container = document.createElement("div");
    root.appendChild(container);
    ReactDOM.render(
      <EnhancedModalWrapper
        {...options}
        onExited={() => {
          ReactDOM.unmountComponentAtNode(container);
          root.removeChild(container);
        }}
      />,
      container,
    );
  }
}
