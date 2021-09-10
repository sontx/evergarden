import * as React from "react";
import { ReactNode, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { EnhancedModal } from "../EnhancedModal";
import { Button, ButtonGroup, Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import { ErrorPanel } from "../ErrorPanel";
import { isMobileOnly } from "react-device-detect";

export function ErrorHandler({ children }: { children: ReactNode }) {
  const location = useLocation<{
    errorStatusCode?: number;
    errorMessage?: string;
  }>();
  const history = useHistory();

  const { errorStatusCode, errorMessage } = location.state || {};

  const Error = () => {
    if (errorStatusCode === 503) {
      return (
        <ErrorPanel
          code={503}
          className="error-503"
          hideCode
          errorMessage={
            <div>
              <span className="error-title">
                <FormattedMessage id="error503_1" />
              </span>
              <span className="error-subtitle">
                <FormattedMessage id="error503_2" />
              </span>
            </div>
          }
        />
      );
    }

    const message =
      errorStatusCode !== 401 &&
      errorStatusCode !== 403 &&
      errorStatusCode !== 404 &&
      errorStatusCode !== 500 &&
      errorStatusCode !== 502 &&
      errorStatusCode !== 504
        ? errorMessage
        : undefined;

    return errorStatusCode !== undefined ? (
      <ErrorPanel code={errorStatusCode} errorMessage={message} />
    ) : (
      <></>
    );
  };

  const closeErrorPanel = useCallback(() => {
    history.replace(history.location.pathname, {});
  }, [history]);
  const handleGoBack = useCallback(() => {
    history.goBack();
    closeErrorPanel();
  }, [closeErrorPanel, history]);
  const handleReload = useCallback(() => {
    window.location.reload();
    closeErrorPanel();
  }, [closeErrorPanel]);

  return (
    <>
      {children}
      {errorStatusCode && (
        <EnhancedModal
          className="error-handler"
          backdrop
          center
          mobile={isMobileOnly}
          show
          title={<></>}
          onHide={closeErrorPanel}
          actions={
            <ButtonGroup block justified={isMobileOnly}>
              <Button size="sm" onClick={handleGoBack} appearance="primary">
                <Icon icon="back-arrow" />
                <FormattedMessage id="goBackButton" />
              </Button>
              <Button size="sm" onClick={handleReload} appearance="subtle">
                <Icon icon="refresh2" />
                <FormattedMessage id="refreshButton" />
              </Button>
            </ButtonGroup>
          }
        >
          {Error()}
        </EnhancedModal>
      )}
    </>
  );
}
