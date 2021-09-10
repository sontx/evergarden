import { SEO } from "../../components/SEO";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { AppContainer } from "../../components/AppContainer";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AppContent } from "../../components/AppContent";
import { ErrorPanel } from "../../components/ErrorPanel";
import { Button } from "rsuite";
import { useHistory } from "react-router-dom";

export function ErrorPage({ code }: { code: number }) {
  const intl = useIntl();
  const history = useHistory();
  return (
    <AppContainer className="error-page">
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <AppContent flexFlow style={{ justifyContent: "center" }}>
        <ErrorPanel code={code} />
        <Button appearance="link" onClick={history.goBack}>
          <FormattedMessage id="goBackButton" />
        </Button>
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
