import React, { ElementType, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { openModal } from "../components/EnhancedModal";
import { Icon } from "rsuite";
import { useIntl } from "react-intl";

export function withHttpErrorCatch(Component: ElementType) {
  return ({ status, errorMessage, ...rest }: any) => {
    const history = useHistory();
    const intl = useIntl();

    const goBack = useCallback(() => {
      history.goBack();
    }, [history]);

    useEffect(() => {
      if (status === "error" && errorMessage) {
        openModal({
          title: errorMessage.code,
          message: errorMessage.prettierMessage,
          ok: intl.formatMessage({ id: "goBackButton" }),
          className: "model--mobile",
          icon: (
            <Icon
              icon="remind"
              style={{
                color: "#ffb300",
              }}
            />
          ),
          onOk: goBack,
        });
      }
    }, [status, errorMessage, intl, history, goBack]);

    return (
      <Component
        {...rest}
        status={status}
        errorMessage={errorMessage}
        goBack={goBack}
      />
    );
  };
}
