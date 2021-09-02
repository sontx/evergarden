import error404 from "../../../images/errors/404.svg";
import error500 from "../../../images/errors/500.svg";
import { FormattedMessage } from "react-intl";

export function ErrorPanel({ code = "404" }: { code: "404" | "500" }) {
  return (
    <div className="error-page">
      <div className="item">
        <img src={code === "404" ? error404 : error500} alt="404" />
        <div className="text">
          <h1 className="code">{code}</h1>
          <p>
            <FormattedMessage id={`error${code}`} />
          </p>
        </div>
      </div>
    </div>
  );
}
