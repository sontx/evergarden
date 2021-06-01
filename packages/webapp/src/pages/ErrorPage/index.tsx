import { ErrorPanel } from "../../components/HttpError/ErrorPanel";
import { SEO } from "../../components/SEO";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { AppContainer } from "../../components/AppContainer";
import React from "react";
import { useIntl } from "react-intl";

export function ErrorPage({ code }: { code: "404" | "500" }) {
  const intl = useIntl();
  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <Content
        style={{ padding: "10px", display: "flex", justifyContent: "center" }}
      >
        <ErrorPanel code={code} />
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
