import { FormattedMessage } from "react-intl";

export function MissingFeature() {
  return (
    <span className="missing-feature">
      <FormattedMessage id="missingFeatureMessage" />
    </span>
  );
}
