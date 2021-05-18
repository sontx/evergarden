import * as React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

export function SEO(props: { lang?: string; meta?: any[]; title: string }) {
  const { lang = "en", meta = [], title } = props;
  const intl = useIntl();
  const metaDescription = intl.formatMessage({ id: "description" });
  const defaultTitle = "Evergarden";

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: "sontx0" || "",
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  );
}
