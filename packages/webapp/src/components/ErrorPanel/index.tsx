import error404 from "../../images/errors/404.svg";
import error500 from "../../images/errors/500.svg";
import error503 from "../../images/errors/503.png";
import errorGeneral from "../../images/errors/general.png";
import { FormattedMessage } from "react-intl";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { ReactNode } from "react";

const CODE_MAPS: { [x: string]: string } = {
  "404": error404,
  "500": error500,
  "503": error503,
  general: errorGeneral,
};

export function ErrorPanel({
  code,
  className,
  errorMessage,
  hideCode,
  ...rest
}: {
  code: number;
  errorMessage?: ReactNode;
  hideCode?: boolean;
} & StandardProps) {
  return (
    <div className={classNames("error-panel", className)} {...rest}>
      <div className="item">
        <img
          src={
            CODE_MAPS[`${code}`] ? CODE_MAPS[`${code}`] : CODE_MAPS["general"]
          }
          alt={`${code}`}
        />
        <div className="text">
          {!hideCode && <h1 className="code">{code}</h1>}
          <p>{errorMessage || <FormattedMessage id={`error${code}`} />}</p>
        </div>
      </div>
    </div>
  );
}
