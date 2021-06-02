import { Auth } from "../../features/auth/Auth";
import { SEO } from "../../components/SEO";
import {useIntl} from "react-intl";
import {AppFooter} from "../../components/AppFooter";

export function Login() {
  const intl = useIntl();
  return (
    <>
      <SEO title={intl.formatMessage({id: "pageTitleLogin"})}/>
      <Auth />
      <AppFooter float/>
    </>
  );
}
