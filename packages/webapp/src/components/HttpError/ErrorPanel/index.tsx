import error404 from "../../../images/errors/404.svg";
import error500 from "../../../images/errors/500.svg";
import { FormattedMessage } from "react-intl";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

export function ErrorPanel({
  code = "404",
  className,
  ...rest
}: { code: "404" | "500" } & StandardProps) {
  return (
    <div className={classNames("error-panel", className)} {...rest}>
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
