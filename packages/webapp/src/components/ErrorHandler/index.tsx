import * as React from "react";
import { ReactNode, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { EnhancedModal } from "../EnhancedModal";
import { Button, Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import { ErrorPanel } from "../HttpError/ErrorPanel";

export function ErrorHandler({ children }: { children: ReactNode }) {
  const location = useLocation<{
    errorStatusCode?: number;
    errorMessage?: string;
  }>();
  const history = useHistory();

  const { errorStatusCode, errorMessage } = location.state || {};

  const Error = () => {
    switch (errorStatusCode) {
      case 404:
        return <ErrorPanel code="404" />;
      case 500:
        return <ErrorPanel code="500" />;
      case 403:
        return <FormattedMessage id="error403" />;
      default:
        return errorMessage;
    }
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
          mobile
          show
          title={
            errorStatusCode === 404 || errorStatusCode === 500 ? (
              <></>
            ) : (
              errorStatusCode
            )
          }
          onHide={closeErrorPanel}
          actions={
            <>
              <Button onClick={handleGoBack} appearance="primary">
                <Icon icon="back-arrow" />
                <FormattedMessage id="goBackButton" />
              </Button>
              <Button onClick={handleReload} appearance="subtle">
                <Icon icon="refresh2" />
                <FormattedMessage id="refreshButton" />
              </Button>
            </>
          }
        >
          {Error()}
        </EnhancedModal>
      )}
    </>
  );
}
