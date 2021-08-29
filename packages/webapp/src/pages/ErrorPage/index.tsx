import { ErrorPanel } from "../../components/HttpError/ErrorPanel";
import { SEO } from "../../components/SEO";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { AppContainer } from "../../components/AppContainer";
import React from "react";
import { useIntl } from "react-intl";
import { AppContent } from "../../components/AppContent";

export function ErrorPage({ code }: { code: "404" | "500" }) {
  const intl = useIntl();
  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <AppContent flexFlow style={{ justifyContent: "center" }}>
        <ErrorPanel code={code} />
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
